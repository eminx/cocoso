// Shared between imports/startup/server/oauth.js (the broker's HTTP
// endpoints) and imports/api/sso/magicLink.methods.js (the DDP-based
// magic-link request step) — kept in one place to avoid the two drifting.

function base64url(buffer) {
  return buffer.toString('base64url');
}

// client_id has no separate registry in this design — it's always just the
// tenant's own host string, validated here against a real Hosts doc.
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

export { base64url, validateRedirect };
