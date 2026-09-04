import React, { useRef, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Image,
  Link as CLink,
  Text,
} from '/imports/ui/core';
import { message } from '/imports/ui/generic/message';
import { call } from '../../../api/_utils/shared';
import { AuthContainer } from './index';
import { C } from 'react-router/dist/development/index-react-server-client-BSxMvS7Z';

interface OAuthParams {
  client_id: string;
  redirect_uri: string;
  state: string;
  code_challenge: string;
  code_challenge_method: string;
}

function readOAuthParams(): OAuthParams {
  const params = new URLSearchParams(window.location.search);
  return {
    client_id: params.get('client_id') || '',
    redirect_uri: params.get('redirect_uri') || '',
    state: params.get('state') || '',
    code_challenge: params.get('code_challenge') || '',
    code_challenge_method: params.get('code_challenge_method') || 'S256',
  };
}

// The broker has no real router — just a handful of known paths, matched
// by hand. /reset-password/:token mirrors the shape resetUserPassword
// (imports/api/users/user.methods.js) generates its email links with.
function resolveModeAndToken() {
  const { pathname } = window.location;
  if (pathname.startsWith('/register')) {
    return { mode: 'signup' as const, token: undefined };
  }
  if (pathname.startsWith('/forgot-password')) {
    return { mode: 'recover' as const, token: undefined };
  }
  if (pathname.startsWith('/reset-password/')) {
    return {
      mode: 'reset' as const,
      token: pathname.split('/reset-password/')[1],
    };
  }
  return { mode: 'login' as const, token: undefined };
}

function isConfirmPath() {
  return window.location.pathname.startsWith('/confirm');
}

// username/avatar here are set by oauth.js's handleAuthorizeGet purely for
// display on the "Continue as X?" screen — /oauth/confirm re-derives the
// actual identity from the broker cookie itself, never trusts these.
function readConfirmIdentity() {
  const params = new URLSearchParams(window.location.search);
  return {
    username: params.get('username') || '',
    avatar: params.get('avatar') || '',
  };
}

// Populated by oauth.js's redirectToBrokerForm() when a native form POST
// to /oauth/authorize or /oauth/register fails — see handleAuthorizePost/
// handleRegisterPost. Read once on load, same as oauthParams/mode below,
// since a failure always arrives via a fresh page load (full navigation).
// Maps the wire error code to its translation key under sso.broker.errors.
const ERROR_CODE_KEYS: Record<string, string> = {
  invalid_credentials: 'invalidCredentials',
  missing_fields: 'missingFields',
  username_taken: 'usernameTaken',
  registration_failed: 'registrationFailed',
};

function readErrorCode(): string | null {
  return new URLSearchParams(window.location.search).get('error');
}

interface BrokerAuthPageProps {
  platform?: { logo?: string } | null;
}

export default function BrokerAuthPage({ platform }: BrokerAuthPageProps) {
  const [t] = useTranslation('accounts');
  const [submitting, setSubmitting] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [oauthParams] = useState(readOAuthParams);
  const [{ mode: initialMode, token }] = useState(resolveModeAndToken);
  const [isConfirm] = useState(isConfirmPath);
  const [confirmIdentity] = useState(readConfirmIdentity);
  const [errorCode] = useState(readErrorCode);
  const errorMessage = errorCode
    ? t(`sso.broker.errors.${ERROR_CODE_KEYS[errorCode] || 'generic'}`)
    : null;

  // A reset-password link arrives standalone, potentially hours later on
  // any device — there's no active OAuth round-trip to return to, so the
  // terms link (tied to the originating tenant) only makes sense when one
  // is actually in flight.
  const termsHref = oauthParams.client_id
    ? `https://${oauthParams.client_id}/terms-&-privacy-policy`
    : undefined;

  // Submits via a real native browser form POST (not fetch) so the
  // resulting 302 from /oauth/authorize|register is followed by the
  // browser itself — no CORS needed, and the server can set the broker
  // session cookie normally.
  const submitNative = (action: string, fields: Record<string, string>) => {
    const form = formRef.current;
    if (!form) {
      return;
    }
    form.action = action;
    Object.entries(fields).forEach(([name, value]) => {
      const input = form.elements.namedItem(name) as HTMLInputElement | null;
      if (input) {
        input.value = value;
      }
    });
    setSubmitting(true);
    form.submit();
  };

  // These three don't need username/email/password — the hidden form's
  // extra empty fields are harmless, the server handlers only read the
  // oauth.* fields for these three actions.
  const handleConfirmContinue = () => {
    submitNative('/oauth/confirm', { ...oauthParams });
  };

  // Purely a navigation — doesn't touch the broker cookie at all. If the
  // person actually completes a login as someone else, that new login
  // naturally replaces the cookie (see completeBrokerAuth in oauth.js).
  // If they abandon it, the original recognized account is untouched.
  const handleUseDifferentAccount = () => {
    const qs = new URLSearchParams(oauthParams as any).toString();
    window.location.href = `/login?${qs}`;
  };

  const handleLogoutEverywhere = () => {
    submitNative('/oauth/logout-everywhere', { ...oauthParams });
  };

  const handleLogin = (data: any) => {
    submitNative('/oauth/authorize', {
      username: data.username,
      password: data.password,
      ...oauthParams,
    });
  };

  const handleSignup = (data: any) => {
    submitNative('/oauth/register', {
      username: data.username,
      email: data.email,
      password: data.password,
      ...oauthParams,
    });
  };

  const handleForgotPassword = async (data: any) => {
    try {
      // resetUserPassword's parameter is misleadingly named `email` but
      // actually forwards straight into accounts-password's built-in
      // 'forgotPassword' method, which requires { email } — not a bare
      // string. Pass the whole form object through, not data.email.
      await call('resetUserPassword', data);
      message.success(t('sso.broker.forgotSuccess'));
    } catch (error: any) {
      message.error(
        error?.error?.reason || error?.reason || t('sso.broker.errors.generic')
      );
    }
  };

  const handleResetPassword = async (data: any) => {
    try {
      await call('resetPassword', token, data.password);
      message.success(t('sso.broker.resetSuccess'));
      setResetDone(true);
    } catch (error: any) {
      message.error(error?.reason || t('sso.broker.errors.generic'));
    }
  };

  return (
    <Center my="8" p="4">
      <Toaster containerStyle={{ minWidth: '120px', zIndex: 999999 }} />
      <Box w="xs">
        {platform?.logo && (
          <Center p="4" mb="8">
            <Image h="120px" w="auto" src={platform.logo} />
          </Center>
        )}

        {isConfirm ? (
          <Box textAlign="center">
            <Center
              mb="12"
              css={{
                backgroundColor: '#f8fafc',
                padding: '1rem',
                borderRadius: '1rem',
              }}
            >
              <Flex align="center" gap="4">
                <Avatar
                  borderRadius="50%"
                  name={confirmIdentity.username}
                  size="xl"
                  src={confirmIdentity.avatar || undefined}
                />
                <Flex direction="column" align="center" gap="2">
                  <Text fontSize="lg" fontWeight="bold">
                    {t('sso.confirm.continueAs', {
                      username: confirmIdentity.username,
                    })}
                  </Text>
                  <Button loading={submitting} onClick={handleConfirmContinue}>
                    {t('sso.confirm.continue')}
                  </Button>
                </Flex>
              </Flex>
            </Center>

            <Flex align="center" direction="column" gap="4" justify="center">
              <Button variant="outline" onClick={handleUseDifferentAccount}>
                {t('sso.confirm.differentAccount')}
              </Button>
              <Button
                variant="ghost"
                css={{ width: '100%' }}
                onClick={() => {
                  const qs = new URLSearchParams(oauthParams as any).toString();
                  window.location.href = `/register?${qs}`;
                }}
              >
                {t('sso.confirm.createAccount')}
              </Button>
            </Flex>
            <Center mt="8">
              <Flex
                align="center"
                direction="column"
                justify="center"
                textAlign="center"
              >
                <Button
                  my="2"
                  variant="ghost"
                  colorScheme="red"
                  size="sm"
                  onClick={handleLogoutEverywhere}
                >
                  {t('sso.confirm.logoutEverywhere')}
                </Button>
                <Text color="gray.600" fontSize="xs">
                  {t('sso.confirm.logoutEverywhereHelper')}
                </Text>
              </Flex>
            </Center>
          </Box>
        ) : resetDone ? (
          <Center>
            <Text textAlign="center">{t('sso.broker.resetDone')}</Text>
          </Center>
        ) : (
          <Box
            bg="gray.50"
            p="6"
            css={{
              border: '1px solid',
              borderColor: 'var(--cocoso-colors-gray-300)',
            }}
          >
            {errorMessage && (
              <Center mb="4">
                <Text color="red.500" fontSize="sm" textAlign="center">
                  {errorMessage}
                </Text>
              </Center>
            )}
            <AuthContainer
              initialMode={initialMode}
              isSubmitted={submitting}
              termsHref={termsHref}
              onLogin={handleLogin}
              onSignup={handleSignup}
              onForgotPassword={handleForgotPassword}
              onResetPassword={handleResetPassword}
            />
          </Box>
        )}

        {oauthParams.client_id && (
          <Center mt="6">
            <CLink
              color="gray.700"
              fontSize="sm"
              href={`https://${oauthParams.client_id}/`}
            >
              ← {t('sso.backToSite', { host: oauthParams.client_id })}
            </CLink>
          </Center>
        )}

        {/* Hidden native form: the real submission target for login and
            register. React only fills its fields and calls .submit(). */}
        <form ref={formRef} method="POST" style={{ display: 'none' }}>
          <input name="username" type="text" readOnly />
          <input name="email" type="email" readOnly />
          <input name="password" type="password" readOnly />
          <input name="client_id" type="hidden" readOnly />
          <input name="redirect_uri" type="hidden" readOnly />
          <input name="state" type="hidden" readOnly />
          <input name="code_challenge" type="hidden" readOnly />
          <input name="code_challenge_method" type="hidden" readOnly />
        </form>
      </Box>
    </Center>
  );
}
