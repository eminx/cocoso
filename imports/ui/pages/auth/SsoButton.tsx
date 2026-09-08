import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';

import { Box, Button } from '/imports/ui/core';
import { platformAtom } from '/imports/state';

const publicSettings = Meteor.settings.public;

const PENDING_KEY = 'cocoso_sso_pending';

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Read by SsoCallbackPage: means "decide the landing page from the
// freshly-loaded user's avatar" rather than bouncing back to a literal
// captured page. Used by the old /register, and /reset-password/:token
// flows, which never had a "page the person was on" to return to.
export const AVATAR_BASED_RETURN = '__avatar__';

// Shared by both entry points below: generates the PKCE pair, stashes it
// (plus where to come back to) under PENDING_KEY, and returns the query
// params every broker URL needs. returnTo defaults to wherever the caller
// actually is — the button on a group page should come back to that group
// page, not to /login. /login's own auto-redirect (LoginPage.tsx) calls
// startSso with no override, so it naturally gets '/login' back and keeps
// its existing post-login checks.
async function preparePendingAuth(returnTo?: string): Promise<URLSearchParams> {
  const codeVerifier = base64UrlEncode(
    crypto.getRandomValues(new Uint8Array(32))
  );
  const challengeDigest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(codeVerifier)
  );
  const codeChallenge = base64UrlEncode(new Uint8Array(challengeDigest));
  const state = base64UrlEncode(crypto.getRandomValues(new Uint8Array(16)));

  localStorage.setItem(
    PENDING_KEY,
    JSON.stringify({
      codeVerifier,
      state,
      returnTo: returnTo || `${window.location.pathname}${window.location.search}`,
    })
  );

  return new URLSearchParams({
    client_id: window.location.host,
    redirect_uri: `${window.location.origin}/sso-callback`,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
}

// screenHint only steers which form the broker shows when nobody's
// recognized yet (see screen_hint handling in oauth.js's handleAuthorizeGet)
// — an existing broker session still wins and goes to the account chooser.
export async function startSso(
  authDomain: string,
  returnTo?: string,
  screenHint?: 'register'
) {
  const params = await preparePendingAuth(returnTo);
  params.set('response_type', 'code');
  if (screenHint) {
    params.set('screen_hint', screenHint);
  }

  window.location.href = `https://${authDomain}/oauth/authorize?${params.toString()}`;
}

// Skips the broker's "already signed in?" cookie check entirely — for the
// account-recovery paths (forgot-password, reset-password/:token), which
// must work standalone against a specific email/token regardless of any
// existing broker session, and shouldn't get rerouted to an account chooser.
export async function startDirectAuthFlow(
  authDomain: string,
  brokerPath: string,
  returnTo?: string
) {
  const params = await preparePendingAuth(returnTo);
  window.location.href = `https://${authDomain}${brokerPath}?${params.toString()}`;
}

export default function SsoButton() {
  const platform = useAtomValue(platformAtom);
  const [t] = useTranslation('accounts');
  const authDomain = publicSettings?.authDomain;

  if (!authDomain) {
    return null;
  }

  return (
    <Box>
      <Button
        size="lg"
        variant="solid"
        css={{ width: '100%' }}
        onClick={() => startSso(authDomain)}
      >
        {t('sso.button', { platform: platform?.name || publicSettings?.name })}
      </Button>
    </Box>
  );
}
