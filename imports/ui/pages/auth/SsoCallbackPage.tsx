import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, useNavigate } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';
import { useAtomValue, useSetAtom } from 'jotai';

import {
  Box,
  Center,
  Flex,
  Image,
  Link as CLink,
  Loader,
  Text,
} from '/imports/ui/core';
import { call } from '/imports/api/_utils/shared';
import { currentUserAtom, roleAtom } from '/imports/state';
import { AVATAR_BASED_RETURN } from './SsoButton';

const PENDING_KEY = 'cocoso_sso_pending';

export default function SsoCallbackPage({
  platform,
}: {
  platform?: { logo?: string };
}) {
  const navigate = useNavigate();
  const [t] = useTranslation('accounts');
  const [error, setError] = useState<string | null>(null);
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const currentUser = useAtomValue(currentUserAtom);
  const setRole = useSetAtom(roleAtom);

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');

      const pendingRaw = localStorage.getItem(PENDING_KEY);
      localStorage.removeItem(PENDING_KEY);

      if (!code || !state || !pendingRaw) {
        setError(t('sso.callback.errors.missing'));
        return;
      }

      const pending = JSON.parse(pendingRaw);
      if (pending.state !== state) {
        setError(t('sso.callback.errors.stateMismatch'));
        return;
      }

      try {
        const { token } = await call<{ token: string }>('exchangeSsoCode', {
          code,
          codeVerifier: pending.codeVerifier,
        });

        Meteor.loginWithToken(token, (loginError?: Error) => {
          if (loginError) {
            setError(loginError.message || t('sso.callback.errors.failed'));
            return;
          }
          // Where this lands is decided below, once currentUser reloads —
          // /login's own "join this host?" check still applies for a
          // brand-new member, same as before this button skipped /login.
          setReturnTo(pending.returnTo || '/login');
        });
      } catch (exchangeError: any) {
        setError(exchangeError.reason || t('sso.callback.errors.failed'));
      }
    })();
  }, []);

  // Mirrors LoginPage's own post-login membership check: only send the
  // person on to a real destination once we know they already belong here,
  // otherwise fall back to /login so its join-as-participant prompt still
  // gets a chance to run — same gate for a returning member (real page) and
  // a brand-new one (avatar-based destination) alike.
  useEffect(() => {
    if (!returnTo) {
      return;
    }
    if (returnTo === '/login') {
      navigate('/login');
      return;
    }
    if (!currentUser) {
      return;
    }
    const hostWithinUser = (currentUser as any)?.memberships?.find(
      (membership: any) => membership?.host === window.location.host
    );
    setRole(hostWithinUser?.role || null);
    if (
      !['participant', 'contributor', 'admin'].includes(hostWithinUser?.role)
    ) {
      navigate('/login');
      return;
    }
    if (returnTo === AVATAR_BASED_RETURN) {
      navigate(
        (currentUser as any)?.avatar?.src ? '/' : '/admin/my-profile/general'
      );
    } else {
      navigate(returnTo);
    }
  }, [returnTo, currentUser]);

  if (!error) {
    return (
      <Center p="8">
        <Loader speed={1} />
        <Box w="xs" textAlign="center">
          {platform?.logo && (
            <Center p="4" mb="4">
              <Image
                alt="logo"
                h="120px"
                fit="contain"
                src={platform.logo}
                w="auto"
              />
            </Center>
          )}
          <Text color="gray.600">
            <Trans i18nKey="accounts.sso.callback.verifying">
              Verifying your sign-in…
            </Trans>
          </Text>
        </Box>
      </Center>
    );
  }

  return (
    <Center p="8">
      <Flex direction="column" align="center" textAlign="center">
        <Text css={{ marginBottom: '1rem' }}>{error}</Text>
        <Link to="/login">
          <CLink color="blue.500">
            <Trans i18nKey="accounts.sso.callback.backToSignIn">
              Back to sign in
            </Trans>
          </CLink>
        </Link>
      </Flex>
    </Center>
  );
}
