import React, { useRef, useState } from 'react';

import { Box, Center, Image, Text } from '/imports/ui/core';
import { message } from '/imports/ui/generic/message';
import { call } from '../../../api/_utils/shared';
import { AuthContainer } from './index';

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

// Populated by oauth.js's redirectToBrokerForm() when a native form POST
// to /oauth/authorize or /oauth/register fails — see handleAuthorizePost/
// handleRegisterPost. Read once on load, same as oauthParams/mode below,
// since a failure always arrives via a fresh page load (full navigation).
const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Incorrect username/email or password.',
  missing_fields: 'Please fill in all fields.',
  username_taken: 'That username is already taken.',
  registration_failed:
    'Could not create your account — that email or username may already be in use.',
};

function readErrorMessage(): string | null {
  const code = new URLSearchParams(window.location.search).get('error');
  if (!code) {
    return null;
  }
  return ERROR_MESSAGES[code] || 'Something went wrong. Please try again.';
}

interface BrokerAuthPageProps {
  platform?: { logo?: string } | null;
}

export default function BrokerAuthPage({ platform }: BrokerAuthPageProps) {
  const [submitting, setSubmitting] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [oauthParams] = useState(readOAuthParams);
  const [{ mode: initialMode, token }] = useState(resolveModeAndToken);
  const [errorMessage] = useState(readErrorMessage);

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
      await call('resetUserPassword', data.email);
      message.success('Check your email for a link to reset your password.');
    } catch (error: any) {
      message.error(
        error?.error?.reason || error?.reason || 'Something went wrong.'
      );
    }
  };

  const handleResetPassword = async (data: any) => {
    try {
      await call('resetPassword', token, data.password);
      message.success('Your password has been reset.');
      setResetDone(true);
    } catch (error: any) {
      message.error(error?.reason || 'Something went wrong.');
    }
  };

  return (
    <Center my="8">
      <Box w="xs">
        {platform?.logo && (
          <Center p="4">
            <Image w="240px" src={platform.logo} />
          </Center>
        )}

        {resetDone ? (
          <Center>
            <Text textAlign="center">
              Your password has been reset. You can return to the site you were
              signing in from and sign in again.
            </Text>
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
