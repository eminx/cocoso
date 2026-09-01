import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';

import { Box, Center, Image, Link as CLink, Loader, Text } from '/imports/ui/core';
import { call } from '../../../api/_utils/shared';
import { platformAtom } from '/imports/state';

const PENDING_KEY = 'cocoso_sso_pending';

export default function SsoCallbackPage() {
  const navigate = useNavigate();
  const platform = useAtomValue(platformAtom);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');

      const pendingRaw = sessionStorage.getItem(PENDING_KEY);
      sessionStorage.removeItem(PENDING_KEY);

      if (!code || !state || !pendingRaw) {
        setError('Missing sign-in information. Please try again.');
        return;
      }

      const pending = JSON.parse(pendingRaw);
      if (pending.state !== state) {
        setError('Sign-in could not be verified. Please try again.');
        return;
      }

      try {
        const { token } = await call<{ token: string }>('exchangeSsoCode', {
          code,
          codeVerifier: pending.codeVerifier,
        });

        Meteor.loginWithToken(token, (loginError?: Error) => {
          if (loginError) {
            setError(loginError.message || 'Sign-in failed. Please try again.');
            return;
          }
          navigate('/login');
        });
      } catch (exchangeError: any) {
        setError(exchangeError.reason || 'Sign-in failed. Please try again.');
      }
    })();
  }, []);

  if (!error) {
    return (
      <Center p="8">
        <Box w="xs" textAlign="center">
          {platform?.logo && (
            <Center p="4">
              <Image w="120px" src={platform.logo} />
            </Center>
          )}
          <Loader relative speed={1} />
          <Text mt="4" color="gray.600">
            Verifying your sign-in…
          </Text>
        </Box>
      </Center>
    );
  }

  return (
    <Center p="8">
      <Box textAlign="center">
        <Text mb="4">{error}</Text>
        <Link to="/login">
          <CLink as="span" color="blue.500">
            Back to sign in
          </CLink>
        </Link>
      </Box>
    </Center>
  );
}
