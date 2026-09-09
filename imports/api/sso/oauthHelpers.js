// Shared between imports/startup/server/oauth.js (the broker's HTTP
// endpoints), imports/api/sso/magicLink.methods.js (the DDP-based
// magic-link request step), and imports/api/_utils/services/sso/sso.methods.js
// (the DDP-based code mint used after a password reset) — kept in one place
// to avoid the three drifting.

import crypto from 'crypto';

import AuthorizationCodes from './authorizationCode';

// A one-time code only needs to survive an immediate redirect.
const CODE_TTL_MS = 60 * 1000;

function base64url(buffer) {
  return buffer.toString('base64url');
}

// client_id has no separate registry in this design — it's always just the
// tenant's own host string, validated here against a real Hosts doc.
function validateRedirect(host, redirectUri) {
  let redirectHost;
  try {
    // .host (not .hostname) so the port is included — client_id is
    // window.location.host (SsoButton.tsx), which keeps the port too, and
    // Hosts docs are keyed the same port-inclusive way everywhere else in
    // this app (e.g. serverRenderer.js's Hosts.findOneAsync({ host })).
    // Using .hostname here broke every non-default-port deployment,
    // i.e. always on localhost dev.
    redirectHost = new URL(redirectUri).host;
  } catch {
    return null;
  }
  if (redirectHost !== host) {
    return null;
  }
  return redirectHost;
}

// The one-time authorization code, minted the same way regardless of
// whether the caller is about to write it into a 302 (the native
// login/register/confirm form posts) or hand it back over DDP (a password
// reset completing on the broker's own already-authenticated connection).
async function mintAuthorizationCode({
  userId,
  host,
  redirectUri,
  codeChallenge,
  codeChallengeMethod,
}) {
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
  return code;
}

export { base64url, validateRedirect, mintAuthorizationCode };
