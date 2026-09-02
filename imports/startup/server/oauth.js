import crypto from 'crypto';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { Accounts } from 'meteor/accounts-base';
import cookie from 'cookie';

import Hosts from '../../api/hosts/host';
import AuthorizationCodes from '../../api/sso/authorizationCode';

const CODE_TTL_MS = 60 * 1000;
const BROKER_COOKIE_NAME = 'cocoso_broker_session';
const BROKER_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, in seconds
const MAX_BODY_BYTES = 1024 * 100; // 100kb, generous for a login/register form

function base64url(buffer) {
  return buffer.toString('base64url');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    let bytes = 0;
    req.on('data', (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES) {
        reject(new Error('Request body too large'));
        req.destroy();
        return;
      }
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function oauthQueryString({ host, redirectUri, state, codeChallenge, codeChallengeMethod }) {
  const params = new URLSearchParams({
    client_id: host || '',
    redirect_uri: redirectUri || '',
    state: state || '',
    code_challenge: codeChallenge || '',
    code_challenge_method: codeChallengeMethod || 'S256',
  });
  return params.toString();
}

// Failures past this point in the flow (bad credentials, taken username)
// bounce back to the real React login/register page with a short error
// code — never back to an unvalidated redirect_uri, and never with a
// hand-rolled HTML response.
function redirectToBrokerForm(res, pathname, oauthFields, errorCode) {
  const qs = oauthQueryString(oauthFields);
  const errorPart = errorCode ? `&error=${encodeURIComponent(errorCode)}` : '';
  res.writeHead(302, { Location: `${pathname}?${qs}${errorPart}` });
  res.end();
}

async function findBrokerSessionUserId(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies[BROKER_COOKIE_NAME];
  if (!token) {
    return null;
  }

  const hashedToken = Accounts._hashLoginToken(token);
  const user = await Meteor.users.findOneAsync(
    { 'services.resume.loginTokens.hashedToken': hashedToken },
    { fields: { _id: 1 } }
  );
  return user?._id || null;
}

function setBrokerCookie(res, token) {
  const existing = res.getHeader('Set-Cookie');
  const serialized = cookie.serialize(BROKER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: BROKER_COOKIE_MAX_AGE,
    path: '/',
  });
  res.setHeader('Set-Cookie', existing ? [].concat(existing, serialized) : serialized);
}

function clearBrokerCookie(res) {
  const existing = res.getHeader('Set-Cookie');
  const serialized = cookie.serialize(BROKER_COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  res.setHeader('Set-Cookie', existing ? [].concat(existing, serialized) : serialized);
}

// client_id has no separate registry in this design — it's always just the
// tenant's own host string, validated below against a real Hosts doc.
function validateRedirect(host, redirectUri) {
  let redirectHost;
  try {
    redirectHost = new URL(redirectUri).hostname;
  } catch {
    return null;
  }
  if (redirectHost !== host) {
    return null;
  }
  return redirectHost;
}

async function mintCodeAndRedirect(res, { userId, host, redirectUri, state, codeChallenge, codeChallengeMethod }) {
  const code = base64url(crypto.randomBytes(32));
  await AuthorizationCodes.insertAsync({
    code,
    userId,
    host,
    redirectUri,
    codeChallenge,
    codeChallengeMethod: codeChallengeMethod || 'S256',
    expiresAt: new Date(Date.now() + CODE_TTL_MS),
    used: false,
    createdAt: new Date(),
  });

  const url = new URL(redirectUri);
  url.searchParams.set('code', code);
  if (state) {
    url.searchParams.set('state', state);
  }

  res.writeHead(302, { Location: url.toString() });
  res.end();
}

// Shared tail for both login and registration success: mint the broker's
// own "already signed in" cookie, then mint the one-time authorization
// code and redirect back to the tenant.
async function completeBrokerAuth(res, userId, oauthFields) {
  const stampedToken = Accounts._generateStampedLoginToken();
  await Accounts._insertLoginToken(userId, stampedToken);
  setBrokerCookie(res, stampedToken.token);

  await mintCodeAndRedirect(res, { userId, ...oauthFields });
}

async function handleAuthorizeGet(req, res, params) {
  const {
    // Wire format is OAuth2's "client_id" — but in this design it's always
    // just the requesting tenant's own host string, so it's kept as `host`
    // everywhere past this one destructuring line.
    client_id: host,
    redirect_uri: redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: codeChallengeMethod,
  } = params;

  if (!host || !redirectUri || !codeChallenge) {
    res.statusCode = 400;
    res.end('Missing required parameters');
    return;
  }

  const redirectHost = validateRedirect(host, redirectUri);
  if (!redirectHost) {
    res.statusCode = 400;
    res.end('client_id / redirect_uri mismatch');
    return;
  }

  const hostDoc = await Hosts.findOneAsync({ host: redirectHost });
  if (!hostDoc) {
    res.statusCode = 400;
    res.end('Unknown client');
    return;
  }

  const oauthFields = { host, redirectUri, state, codeChallenge, codeChallengeMethod };

  const userId = await findBrokerSessionUserId(req);
  if (userId) {
    // Recognized, but never auto-sign-in silently — send to the account
    // chooser so the person actually confirms it's them (or picks
    // something else) before a code is ever minted. username/avatar here
    // are for display only; /oauth/confirm re-derives identity from the
    // cookie itself rather than trusting anything from this URL.
    const user = await Meteor.users.findOneAsync(userId, {
      fields: { username: 1, 'avatar.src': 1 },
    });
    const qs = oauthQueryString(oauthFields);
    const identityQs = new URLSearchParams({
      username: user?.username || '',
      avatar: user?.avatar?.src || '',
    }).toString();
    res.writeHead(302, { Location: `/confirm?${qs}&${identityQs}` });
    res.end();
    return;
  }

  // No broker session yet — hand off to the real React login page
  // (imports/ui/pages/auth/BrokerAuthPage.tsx), which posts back here.
  redirectToBrokerForm(res, '/login', oauthFields);
}

async function handleAuthorizePost(req, res) {
  const rawBody = await readBody(req);
  const params = Object.fromEntries(new URLSearchParams(rawBody));
  const {
    username,
    password,
    client_id: host,
    redirect_uri: redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: codeChallengeMethod,
  } = params;
  const oauthFields = { host, redirectUri, state, codeChallenge, codeChallengeMethod };

  const redirectHost = validateRedirect(host, redirectUri);
  const hostDoc = redirectHost ? await Hosts.findOneAsync({ host: redirectHost }) : null;
  if (!hostDoc) {
    res.statusCode = 400;
    res.end('Unknown client');
    return;
  }

  const user =
    (await Accounts.findUserByUsername(username)) ||
    (await Accounts.findUserByEmail(username));
  const checkResult = user
    ? await Accounts._checkPasswordAsync(user, password)
    : null;

  if (!user || checkResult?.error) {
    redirectToBrokerForm(res, '/login', oauthFields, 'invalid_credentials');
    return;
  }

  await completeBrokerAuth(res, user._id, oauthFields);
}

async function handleRegisterPost(req, res) {
  const rawBody = await readBody(req);
  const params = Object.fromEntries(new URLSearchParams(rawBody));
  const {
    username,
    email,
    password,
    client_id: host,
    redirect_uri: redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: codeChallengeMethod,
  } = params;
  const oauthFields = { host, redirectUri, state, codeChallenge, codeChallengeMethod };

  const redirectHost = validateRedirect(host, redirectUri);
  const hostDoc = redirectHost ? await Hosts.findOneAsync({ host: redirectHost }) : null;
  if (!hostDoc) {
    res.statusCode = 400;
    res.end('Unknown client');
    return;
  }

  if (!username || !email || !password) {
    redirectToBrokerForm(res, '/register', oauthFields, 'missing_fields');
    return;
  }

  const usernameTaken = await Accounts.findUserByUsername(username);
  if (usernameTaken) {
    redirectToBrokerForm(res, '/register', oauthFields, 'username_taken');
    return;
  }

  let userId;
  try {
    userId = await Accounts.createUserAsync({ username, email, password });
  } catch (error) {
    console.error('[oauth] registration failed', error);
    redirectToBrokerForm(res, '/register', oauthFields, 'registration_failed');
    return;
  }

  await completeBrokerAuth(res, userId, oauthFields);
}

// The "Continue as X?" confirmation step. Deliberately re-derives the
// user from the broker cookie rather than trusting anything the client
// sent — the account-chooser screen's displayed username is cosmetic
// only, this is where identity is actually established.
async function handleConfirmPost(req, res) {
  const rawBody = await readBody(req);
  const params = Object.fromEntries(new URLSearchParams(rawBody));
  const {
    client_id: host,
    redirect_uri: redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: codeChallengeMethod,
  } = params;
  const oauthFields = { host, redirectUri, state, codeChallenge, codeChallengeMethod };

  const redirectHost = validateRedirect(host, redirectUri);
  const hostDoc = redirectHost ? await Hosts.findOneAsync({ host: redirectHost }) : null;
  if (!hostDoc) {
    res.statusCode = 400;
    res.end('Unknown client');
    return;
  }

  const userId = await findBrokerSessionUserId(req);
  if (!userId) {
    // Cookie expired/was cleared between the confirm page loading and this
    // click — fall back to a normal login instead of erroring.
    redirectToBrokerForm(res, '/login', oauthFields);
    return;
  }

  // Sliding expiration: every confirmed use re-extends the broker session
  // by another BROKER_COOKIE_MAX_AGE, same as the password-login and
  // registration paths already do via completeBrokerAuth. Without this,
  // the "remember me" cookie only ever counted down from its very first
  // login and was never refreshed by later confirmations.
  const existingToken = cookie.parse(req.headers.cookie || '')[BROKER_COOKIE_NAME];
  if (existingToken) {
    setBrokerCookie(res, existingToken);
  }

  await mintCodeAndRedirect(res, { userId, ...oauthFields });
}

// "Log out of all sessions": invalidates every login token this account
// has anywhere — every tenant site, every device — not just the broker's
// own cookie. A real "sign out everywhere," so it's an explicit, separate
// action from "use a different account" above.
async function handleLogoutEverywherePost(req, res) {
  const rawBody = await readBody(req);
  const params = Object.fromEntries(new URLSearchParams(rawBody));
  const oauthFields = {
    host: params.client_id,
    redirectUri: params.redirect_uri,
    state: params.state,
    codeChallenge: params.code_challenge,
    codeChallengeMethod: params.code_challenge_method,
  };

  const userId = await findBrokerSessionUserId(req);
  if (userId) {
    await Meteor.users.updateAsync(userId, {
      $set: { 'services.resume.loginTokens': [] },
    });
  }

  clearBrokerCookie(res);
  redirectToBrokerForm(res, '/login', oauthFields);
}

async function handleToken(req, res) {
  const rawBody = await readBody(req);
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'invalid_request' }));
    return;
  }

  const { code, code_verifier: codeVerifier, redirect_uri: redirectUri, client_id: host } = payload;

  const respondInvalid = () => {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'invalid_grant' }));
  };

  if (!code || !codeVerifier || !redirectUri || !host) {
    respondInvalid();
    return;
  }

  const authCode = await AuthorizationCodes.findOneAsync({ code });
  if (
    !authCode ||
    authCode.used ||
    authCode.expiresAt.getTime() < Date.now() ||
    authCode.redirectUri !== redirectUri ||
    authCode.host !== host
  ) {
    respondInvalid();
    return;
  }

  const expectedChallenge = base64url(
    crypto.createHash('sha256').update(codeVerifier).digest()
  );
  if (expectedChallenge !== authCode.codeChallenge) {
    respondInvalid();
    return;
  }

  // Atomic single-use guard: only one concurrent request can win this update.
  const updatedCount = await AuthorizationCodes.updateAsync(
    { code, used: false },
    { $set: { used: true } }
  );
  if (updatedCount === 0) {
    respondInvalid();
    return;
  }

  const stampedToken = Accounts._generateStampedLoginToken();
  await Accounts._insertLoginToken(authCode.userId, stampedToken);

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ token: stampedToken.token, tokenExpires: stampedToken.when }));
}

Meteor.startup(() => {
  const authDomain = Meteor.settings.public?.authDomain;
  if (!authDomain) {
    return;
  }

  WebApp.connectHandlers.use(async (req, res, next) => {
    if (req.headers.host !== authDomain) {
      next();
      return;
    }

    const [pathname, search = ''] = req.url.split('?');
    const params = Object.fromEntries(new URLSearchParams(search));

    try {
      if (pathname === '/oauth/authorize' && req.method === 'GET') {
        await handleAuthorizeGet(req, res, params);
      } else if (pathname === '/oauth/authorize' && req.method === 'POST') {
        await handleAuthorizePost(req, res);
      } else if (pathname === '/oauth/register' && req.method === 'POST') {
        await handleRegisterPost(req, res);
      } else if (pathname === '/oauth/confirm' && req.method === 'POST') {
        await handleConfirmPost(req, res);
      } else if (pathname === '/oauth/logout-everywhere' && req.method === 'POST') {
        await handleLogoutEverywherePost(req, res);
      } else if (pathname === '/oauth/token' && req.method === 'POST') {
        await handleToken(req, res);
      } else {
        // Not an OAuth protocol endpoint — let it fall through to normal
        // Meteor page/asset serving, so /login, /register, the client
        // bundle, and DDP/sockjs all work on this domain too. The
        // client boot sequence (imports/startup/client/index.jsx) and SSR
        // (imports/startup/server/serverRenderer.js) are what keep this
        // domain from ever rendering the full tenant app or SetupHome.
        next();
      }
    } catch (error) {
      console.error('[oauth]', error);
      res.statusCode = 500;
      res.end('Internal error');
    }
  });
});
