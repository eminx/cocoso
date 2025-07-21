import React, { useState } from 'react';
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
  VStack,
} from '/imports/ui/core';
import FormField from '/imports/ui/forms/FormField';
import Terms from '/imports/ui/entry/Terms';

import {
  loginModel,
  signupModel,
  forgotPasswordModel,
  resetPasswordModel,
  usernameSchema,
  emailSchema,
  passwordSchema,
} from './account.helpers';

const Login = ({ isSubmitted, onSubmit }) => {
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');

  const { handleSubmit, register } = useForm({
    defaultValues: loginModel,
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <VStack spacing="6">
        <FormField label={t('login.form.username.label')}>
          <Input {...register('username')} />
        </FormField>

        <FormField label={t('login.form.password.label')}>
          <Input {...register('password')} type="password" />
        </FormField>

        <Flex justify="flex-end" py="4" w="100%">
          <Button isLoading={isSubmitted} type="submit">
            {tc('actions.submit')}
          </Button>
        </Flex>
      </VStack>
    </form>
  );
};

const Signup = ({ hideTermsCheck = false, onSubmit }) => {
  const [termsChecked, setTermsChecked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');

  const tr = i18next.t;

  const schema = z.object({
    ...usernameSchema(tr),
    ...emailSchema(tr),
    ...passwordSchema(tr),
  });

  const passwordHelperText = t('signup.form.password.helper');

  const { formState, handleSubmit, register } = useForm({
    defaultValues: signupModel,
    resolver: zodResolver(schema),
  });
  const { errors, isDirty, isSubmitting } = formState;

  const confirmModal = () => {
    setTermsChecked(true);
    setModalOpen(false);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <VStack spacing="6">
          <FormField
            errorMessage={errors.username?.message}
            helperText={t('signup.form.username.helper')}
            isInvalid={errors.username}
            label={t('signup.form.username.label')}
          >
            <Input {...register('username')} />
          </FormField>

          <FormField
            errorMessage={errors.email?.message}
            isInvalid={errors.email}
            label={t('signup.form.email.label')}
          >
            <Input {...register('email')} type="email" />
          </FormField>
          <Box>
            <FormField
              errorMessage={errors.password?.message}
              helperText={passwordHelperText}
              isInvalid={errors.password}
              label={t('signup.form.password.label')}
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
            <FormField>
              <Flex>
                <Box pr="2" pt="1">
                  <Checkbox
                    checked={termsChecked}
                    size="lg"
                    onChange={() => setTermsChecked(!termsChecked)}
                  />
                </Box>
                <Link
                  as="span"
                  color="theme.600"
                  textDecoration="underline"
                  onClick={() => setModalOpen(true)}
                >
                  {t('signup.form.terms.label', {
                    terms: t('signup.form.terms.terms'),
                  })}
                </Link>
              </Flex>
            </FormField>
          )}

          <Flex justify="flex-end" py="4" w="100%">
            <Button
              isDisabled={!isDirty || (!termsChecked && !hideTermsCheck)}
              isLoading={isSubmitting}
              type="submit"
            >
              {tc('actions.submit')}
            </Button>
          </Flex>
        </VStack>
      </form>

      <Modal
        confirmText={tc('actions.confirmRead')}
        cancelText={tc('actions.close')}
        scrollBehavior="inside"
        size="full"
        title="Terms of Service & Privacy Policy"
        open={modalOpen}
        onConfirm={confirmModal}
        onClose={() => setModalOpen(false)}
      >
        <Terms />
      </Modal>
    </Box>
  );
};

const ForgotPassword = ({ onForgotPassword }) => {
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
      <VStack spacing="6">
        <FormField
          errorMessage={errors.email?.message}
          isInvalid={errors.email}
          label={t('password.form.email.label')}
        >
          <Input {...register('email')} type="email" />
        </FormField>

        <Flex justify="flex-end" py="4" w="100%">
          <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit">
            {tc('actions.submit')}
          </Button>
        </Flex>
      </VStack>
    </form>
  );
};

const ResetPassword = ({ onResetPassword }) => {
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
      <VStack spacing="6">
        <FormField
          errorMessage={errors.password?.message}
          helperText={passwordHelperText}
          isInvalid={errors.password}
          label={t('login.form.password.label')}
        >
          <Input {...register('password')} type="password" />
        </FormField>

        <Flex justify="flex-end" py="4" w="100%">
          <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit">
            {tc('actions.submit')}
          </Button>
        </Flex>
      </VStack>
    </form>
  );
};

const AuthContainer = () => {
  const [mode, setMode] = useState('signup');
  const [t] = useTranslation('accounts');

  if (mode === 'signup') {
    return (
      <Box>
        <Signup />
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
        <ForgotPassword />
        <Flex justify="space-around">
          <Link onClick={() => setMode('login')}>{t('actions.login')}</Link>
          <Link onClick={() => setMode('signup')}>{t('actions.signup')}</Link>
        </Flex>
      </Box>
    );
  }

  return (
    <Box>
      <Login />
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
