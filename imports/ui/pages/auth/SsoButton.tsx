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

async function startSso(authDomain: string) {
  const codeVerifier = base64UrlEncode(
    crypto.getRandomValues(new Uint8Array(32))
  );
  const challengeDigest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(codeVerifier)
  );
  const codeChallenge = base64UrlEncode(new Uint8Array(challengeDigest));
  const state = base64UrlEncode(crypto.getRandomValues(new Uint8Array(16)));

  sessionStorage.setItem(PENDING_KEY, JSON.stringify({ codeVerifier, state }));

  const params = new URLSearchParams({
    client_id: window.location.host,
    redirect_uri: `${window.location.origin}/sso-callback`,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    response_type: 'code',
  });

  window.location.href = `https://${authDomain}/oauth/authorize?${params.toString()}`;
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
