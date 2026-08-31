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
const MAX_BODY_BYTES = 1024 * 100; // 100kb, generous for a login form / token exchange

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

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

function renderLoginForm({ host, redirectUri, state, codeChallenge, codeChallengeMethod, error }) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Sign in</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 360px; margin: 80px auto; padding: 0 16px; color: #222; }
  input { width: 100%; padding: 10px; margin-bottom: 12px; box-sizing: border-box; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; }
  button { width: 100%; padding: 12px; font-size: 16px; border: none; border-radius: 4px; background: #222; color: #fff; cursor: pointer; }
  .error { color: #c00; margin-bottom: 12px; font-size: 14px; }
</style>
</head>
<body>
  <h2>Sign in</h2>
  ${error ? `<div class="error">${escapeHtml(error)}</div>` : ''}
  <form method="POST" action="/oauth/authorize">
    <input type="text" name="username" placeholder="Username or email" autofocus required autocomplete="username" />
    <input type="password" name="password" placeholder="Password" required autocomplete="current-password" />
    <input type="hidden" name="client_id" value="${escapeHtml(host)}" />
    <input type="hidden" name="redirect_uri" value="${escapeHtml(redirectUri)}" />
    <input type="hidden" name="state" value="${escapeHtml(state)}" />
    <input type="hidden" name="code_challenge" value="${escapeHtml(codeChallenge)}" />
    <input type="hidden" name="code_challenge_method" value="${escapeHtml(codeChallengeMethod)}" />
    <button type="submit">Sign in</button>
  </form>
</body>
</html>`;
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

  const userId = await findBrokerSessionUserId(req);
  if (userId) {
    await mintCodeAndRedirect(res, {
      userId,
      host,
      redirectUri,
      state,
      codeChallenge,
      codeChallengeMethod,
    });
    return;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(renderLoginForm({ host, redirectUri, state, codeChallenge, codeChallengeMethod }));
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
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(
      renderLoginForm({
        host,
        redirectUri,
        state,
        codeChallenge,
        codeChallengeMethod,
        error: 'Invalid username or password',
      })
    );
    return;
  }

  const stampedToken = Accounts._generateStampedLoginToken();
  await Accounts._insertLoginToken(user._id, stampedToken);
  setBrokerCookie(res, stampedToken.token);

  await mintCodeAndRedirect(res, {
    userId: user._id,
    host,
    redirectUri,
    state,
    codeChallenge,
    codeChallengeMethod,
  });
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
      } else if (pathname === '/oauth/token' && req.method === 'POST') {
        await handleToken(req, res);
      } else {
        res.statusCode = 404;
        res.end('Not found');
      }
    } catch (error) {
      console.error('[oauth]', error);
      res.statusCode = 500;
      res.end('Internal error');
    }
  });
});
