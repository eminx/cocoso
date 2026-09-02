import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Center,
  Image,
  Link as CLink,
  Loader,
  Text,
} from '/imports/ui/core';
import { call } from '/imports/api/_utils/shared';

const PENDING_KEY = 'cocoso_sso_pending';

export default function SsoCallbackPage({
  platform,
}: {
  platform?: { logo?: string };
}) {
  const navigate = useNavigate();
  const [t] = useTranslation('accounts');
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   (async () => {
  //     const params = new URLSearchParams(window.location.search);
  //     const code = params.get('code');
  //     const state = params.get('state');

  //     const pendingRaw = sessionStorage.getItem(PENDING_KEY);
  //     sessionStorage.removeItem(PENDING_KEY);

  //     if (!code || !state || !pendingRaw) {
  //       setError(t('sso.callback.errors.missing'));
  //       return;
  //     }

  //     const pending = JSON.parse(pendingRaw);
  //     if (pending.state !== state) {
  //       setError(t('sso.callback.errors.stateMismatch'));
  //       return;
  //     }

  //     try {
  //       const { token } = await call<{ token: string }>('exchangeSsoCode', {
  //         code,
  //         codeVerifier: pending.codeVerifier,
  //       });

  //       Meteor.loginWithToken(token, (loginError?: Error) => {
  //         if (loginError) {
  //           setError(loginError.message || t('sso.callback.errors.failed'));
  //           return;
  //         }
  //         navigate('/login');
  //       });
  //     } catch (exchangeError: any) {
  //       setError(exchangeError.reason || t('sso.callback.errors.failed'));
  //     }
  //   })();
  // }, []);

  // if (!error) {
  return (
    <Center p="8">
      <Loader speed={1} />
      <Box w="xs" textAlign="center">
        {platform?.logo && (
          <Center p="4" mb="4">
            <Image w="120px" src={platform.logo} />
          </Center>
        )}
        <Text color="gray.600">{t('sso.callback.verifying')}</Text>
      </Box>
    </Center>
  );
  // }

  return (
    <Center p="8">
      <Box textAlign="center">
        <Text css={{ marginBottom: '1rem' }}>{error}</Text>
        <Link to="/login">
          <CLink color="blue.500">{t('sso.callback.backToSignIn')}</CLink>
        </Link>
      </Box>
    </Center>
  );
}
