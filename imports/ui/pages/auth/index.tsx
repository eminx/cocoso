import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import i18next from 'i18next';

import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Heading,
  Input,
  Link,
  Modal,
  Text,
} from '/imports/ui/core';
import FormField from '/imports/ui/forms/FormField';
import Terms from '/imports/ui/entry/Terms';
import { call } from '/imports/api/_utils/shared';

import {
  loginModel,
  signupModel,
  forgotPasswordModel,
  resetPasswordModel,
  usernameSchema,
  emailSchema,
  passwordSchema,
} from './account.helpers';

interface LoginProps {
  isSubmitted?: boolean;
  onSubmit: (data: any) => void;
}

const Login = ({ isSubmitted, onSubmit }: LoginProps) => {
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');

  const { handleSubmit, register } = useForm({
    defaultValues: loginModel,
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <Flex direction="column">
        <FormField label={t('login.form.username.label')} required>
          <Input {...register('username')} />
        </FormField>

        <FormField label={t('login.form.password.label')} required>
          <Input {...register('password')} type="password" />
        </FormField>

        <Flex justify="flex-end" py="4" w="100%">
          <Button loading={isSubmitted} type="submit">
            {tc('actions.submit')}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

interface SignupProps {
  hideTermsCheck?: boolean;
  // When set, the terms link opens this URL in a new tab instead of the
  // in-page Terms modal — used where there's no single host's terms to show
  // inline (e.g. the SSO broker, which isn't scoped to one community).
  termsHref?: string;
  onSubmit: (data: any) => void;
}

const Signup = ({ hideTermsCheck = false, termsHref, onSubmit }: SignupProps) => {
  const [termsChecked, setTermsChecked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [usernameUnique, setUsernameUnique] = useState(false);
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');

  const tr = i18next.t;

  const schema = z.object({
    ...usernameSchema(tr),
    ...emailSchema(tr),
    ...passwordSchema(tr),
  });

  const passwordHelperText = t('signup.form.password.helper');

  const { formState, handleSubmit, register, watch } = useForm({
    defaultValues: signupModel,
    resolver: zodResolver(schema),
  });
  const { errors, isDirty, isSubmitting } = formState;

  const confirmModal = () => {
    setTermsChecked(true);
    setModalOpen(false);
  };

  const checkIfUsernameUnique = async (usernameTyped: string) => {
    if (!usernameTyped || usernameTyped.length < 4) {
      return;
    }
    const usernameTaken = await call('isUsernameUnique', usernameTyped);
    setUsernameUnique(!usernameTaken);
  };

  useEffect(() => {
    checkIfUsernameUnique(watch('username'));
  }, [watch('username')]);

  return (
    <>
      <Center>
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <Flex direction="column" maxW="420px">
            <FormField
              errorMessage={
                errors.username?.message ||
                (!usernameUnique && t('signup.form.username.errorNotUnique'))
              }
              helper={t('signup.form.username.helper')}
              label={t('signup.form.username.label')}
              required
            >
              <Input {...register('username')} />
            </FormField>

            <FormField
              errorMessage={errors.email?.message}
              // isInvalid={errors.email}
              label={t('signup.form.email.label')}
              required
            >
              <Input {...register('email')} type="email" />
            </FormField>
            <Box>
              <FormField
                errorMessage={errors.password?.message}
                helper={passwordHelperText}
                // isInvalid={errors.password}
                label={t('signup.form.password.label')}
                required
              >
                <Input {...register('password')} type="password" />
              </FormField>

              <Center mt="2">
                <Text fontSize="xs" textAlign="center">
                  {t('signup.form.password.info')}
                </Text>
              </Center>
            </Box>

            {!hideTermsCheck && (
              <FormField label={t('signup.form.terms.agreement')} required>
                <Checkbox
                  checked={termsChecked}
                  id="is-terms-checked"
                  size="lg"
                  onChange={() => setTermsChecked(!termsChecked)}
                >
                  <Link
                    as={termsHref ? 'a' : undefined}
                    href={termsHref}
                    target={termsHref ? '_blank' : undefined}
                    rel={termsHref ? 'noopener noreferrer' : undefined}
                    css={{
                      color: 'var(--cocoso-colors-blue-500)',
                      fontSize: '0.875rem',
                      textDecoration: 'underline',
                    }}
                    onClick={termsHref ? undefined : () => setModalOpen(true)}
                  >
                    {t('signup.form.terms.label', {
                      terms: t('signup.form.terms.terms'),
                    })}
                  </Link>
                </Checkbox>
              </FormField>
            )}

            <Flex justify="flex-end" py="4" w="100%">
              <Button
                disabled={
                  !isDirty ||
                  (!termsChecked && !hideTermsCheck) ||
                  !usernameUnique
                }
                loading={isSubmitting}
                type="submit"
              >
                {tc('actions.submit')}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Center>

      <Modal
        confirmText={tc('actions.confirmRead')}
        cancelText={tc('actions.close')}
        id="terms-privacy"
        open={modalOpen}
        scrollBehavior="inside"
        size="full"
        title="Terms of Service & Privacy Policy"
        onConfirm={confirmModal}
        onClose={() => setModalOpen(false)}
      >
        <Terms />
      </Modal>
    </>
  );
};

interface ForgotPasswordProps {
  onForgotPassword: (data: any) => void;
}

const ForgotPassword = ({ onForgotPassword }: ForgotPasswordProps) => {
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');

  const tr = i18next.t;
  const schema = z.object({
    ...emailSchema(tr),
  });

  const { formState, handleSubmit, register } = useForm({
    defaultValues: forgotPasswordModel,
    resolver: zodResolver(schema),
  });
  const { errors, isDirty, isSubmitting } = formState;

  return (
    <form onSubmit={handleSubmit((data) => onForgotPassword(data))}>
      <Flex direction="column" gap="6">
        <FormField
          errorMessage={errors.email?.message}
          // isInvalid={errors.email}
          label={t('password.form.email.label')}
        >
          <Input {...register('email')} type="email" />
        </FormField>

        <Flex justify="flex-end" py="4" w="100%">
          <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit">
            {tc('actions.submit')}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

interface ResetPasswordProps {
  onResetPassword: (data: any) => void;
}

const ResetPassword = ({ onResetPassword }: ResetPasswordProps) => {
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');

  const tr = i18next.t;
  const schema = z.object({
    ...passwordSchema(tr),
  });

  const { formState, handleSubmit, register } = useForm({
    defaultValues: resetPasswordModel,
    resolver: zodResolver(schema),
  });
  const { errors, isDirty, isSubmitting } = formState;

  const passwordHelperText = t('signup.form.password.helper');

  return (
    <form onSubmit={handleSubmit((data) => onResetPassword(data))}>
      <Flex direction="column" gap="6">
        <FormField
          errorMessage={errors.password?.message}
          helper={passwordHelperText}
          // isInvalid={errors.password}
          label={t('login.form.password.label')}
        >
          <Input {...register('password')} type="password" />
        </FormField>

        <Flex justify="flex-end" py="4" w="100%">
          <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit">
            {tc('actions.submit')}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

type AuthMode = 'login' | 'signup' | 'recover' | 'reset';

interface AuthContainerProps {
  initialMode?: AuthMode;
  isSubmitted?: boolean;
  termsHref?: string;
  onLogin?: (data: any) => void;
  onSignup?: (data: any) => void;
  onForgotPassword?: (data: any) => void;
  onResetPassword?: (data: any) => void;
}

const noop = () => {};

// Presentational shell around Login/Signup/ForgotPassword/ResetPassword —
// none of the four form components touch global state themselves, so this
// (and they) can be reused anywhere a full tenant app shell isn't wanted,
// e.g. the SSO broker's lightweight auth page.
const AuthContainer = ({
  initialMode = 'login',
  isSubmitted = false,
  termsHref,
  onLogin = noop,
  onSignup = noop,
  onForgotPassword = noop,
  onResetPassword = noop,
}: AuthContainerProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [t] = useTranslation('accounts');

  if (mode === 'signup') {
    return (
      <Box>
        <Signup termsHref={termsHref} onSubmit={onSignup} />
        <Center>
          <Text>{t('signup.labels.subtitle')}</Text>
          <Link onClick={() => setMode('login')}>{t('actions.login')}</Link>
        </Center>
      </Box>
    );
  }

  if (mode === 'recover') {
    return (
      <Box>
        <ForgotPassword onForgotPassword={onForgotPassword} />
        <Flex justify="space-around">
          <Link onClick={() => setMode('login')}>{t('actions.login')}</Link>
          <Link onClick={() => setMode('signup')}>{t('actions.signup')}</Link>
        </Flex>
      </Box>
    );
  }

  if (mode === 'reset') {
    return (
      <Box>
        <ResetPassword onResetPassword={onResetPassword} />
        <Flex justify="space-around">
          <Link onClick={() => setMode('login')}>{t('actions.login')}</Link>
          <Link onClick={() => setMode('signup')}>{t('actions.signup')}</Link>
        </Flex>
      </Box>
    );
  }

  return (
    <Box>
      <Login isSubmitted={isSubmitted} onSubmit={onLogin} />
      <Center mb="8">
        <Heading>{t('login.labels.subtitle')}</Heading>
        <Link onClick={() => setMode('signup')}>{t('actions.signup')}</Link>
      </Center>
      <Center>
        <Heading>{t('actions.forgot')}</Heading>
        <Link onClick={() => setMode('recover')}>{t('actions.reset')}</Link>
      </Center>
    </Box>
  );
};

export { Login, Signup, ForgotPassword, ResetPassword, AuthContainer };
