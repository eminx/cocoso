import React, { useRef, useState } from 'react';
import { useAtomValue } from 'jotai';

import { Box, Center, Image, Link as CLink, Text } from '/imports/ui/core';
import { platformAtom } from '/imports/state';
import { Login, Signup } from './index';

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

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Incorrect username/email or password.',
  missing_fields: 'Please fill in all fields.',
  username_taken: 'That username is already taken.',
  registration_failed: 'Could not create your account. Please try again.',
};

function readErrorMessage(): string | null {
  const code = new URLSearchParams(window.location.search).get('error');
  if (!code) {
    return null;
  }
  return ERROR_MESSAGES[code] || 'Something went wrong. Please try again.';
}

export default function BrokerAuthPage() {
  const platform = useAtomValue(platformAtom);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [oauthParams] = useState(readOAuthParams);
  const [errorMessage] = useState(readErrorMessage);

  const isRegister = window.location.pathname.startsWith('/register');

  // Submits via a real native browser form POST (not fetch) so the
  // resulting 302 from /oauth/authorize|register is followed by the
  // browser itself — same as the plain-HTML broker form before it, just
  // rendered through the real Login/Signup components now.
  const submitNative = (fields: Record<string, string>) => {
    const form = formRef.current;
    if (!form) {
      return;
    }
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
    submitNative({
      username: data.username,
      password: data.password,
      ...oauthParams,
    });
  };

  const handleRegister = (data: any) => {
    submitNative({
      username: data.username,
      email: data.email,
      password: data.password,
      ...oauthParams,
    });
  };

  const toggleParams = new URLSearchParams(oauthParams as any).toString();
  const toggleHref = `${isRegister ? '/login' : '/register'}?${toggleParams}`;

  return (
    <Center mt="16" mb="8">
      <Box w="xs">
        {platform?.logo && (
          <Center p="4">
            <Image w="240px" src={platform.logo} />
          </Center>
        )}

        <Text mb="4" textAlign="center" fontWeight="bold">
          {isRegister ? 'Create your account' : 'Sign in'}
        </Text>

        {errorMessage && (
          <Center mb="4">
            <Text color="red.500" fontSize="sm">
              {errorMessage}
            </Text>
          </Center>
        )}

        <Box
          bg="gray.50"
          mb="4"
          p="6"
          css={{
            border: '1px solid',
            borderColor: 'var(--cocoso-colors-gray-300)',
          }}
        >
          {isRegister ? (
            <Signup hideTermsCheck onSubmit={handleRegister} />
          ) : (
            <Login isSubmitted={submitting} onSubmit={handleLogin} />
          )}
        </Box>

        <Center>
          <Text textAlign="center">
            <CLink as="a" href={toggleHref} color="blue.500">
              <b>
                {isRegister
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Register"}
              </b>
            </CLink>
          </Text>
        </Center>

        {/* Hidden native form: the real submission target. React only
            fills its fields and calls .submit() — this is a genuine
            browser navigation, not an XHR/fetch, so no CORS is needed
            and the server can set the broker session cookie normally. */}
        <form
          ref={formRef}
          method="POST"
          action={isRegister ? '/oauth/register' : '/oauth/authorize'}
          style={{ display: 'none' }}
        >
          <input name="username" type="text" readOnly />
          {isRegister && <input name="email" type="email" readOnly />}
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
