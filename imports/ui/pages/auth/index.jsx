import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { useTranslation } from 'react-i18next';
import { Box, Button, Center, Flex, Input, Link, Text, VStack } from '@chakra-ui/react';

import FormField from '../../components/FormField';
import {
  loginModel,
  signupModel,
  forgotPasswordModel,
  resetPasswordModel,
  usernameSchema,
  emailSchema,
  passwordSchema,
} from './account.helpers';

const Joi = require('joi');

const Login = ({ onSubmit }) => {
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');
  const { formState, handleSubmit, register } = useForm({
    defaultValues: loginModel,
  });
  const { isDirty, isSubmitting } = formState;

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
          <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit">
            {tc('actions.submit')}
          </Button>
        </Flex>
      </VStack>
    </form>
  );
};

const Signup = ({ onSubmit }) => {
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');
  const schema = Joi.object({
    ...usernameSchema,
    ...emailSchema,
    ...passwordSchema,
  });

  const passwordHelperText = t('signup.form.password.helper');

  const { formState, handleSubmit, register } = useForm({
    defaultValues: signupModel,
    resolver: joiResolver(schema),
  });
  const { errors, isDirty, isSubmitting } = formState;

  return (
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

        <FormField
          errorMessage={errors.password?.message}
          helperText={passwordHelperText}
          isInvalid={errors.password}
          label={t('signup.form.password.label')}
        >
          <Input {...register('password')} type="password" />
        </FormField>
        <Center>
          <Text fontSize="xs" textAlign="center">
            {t('signup.form.password.info')}
          </Text>
        </Center>

        <Flex justify="flex-end" py="4" w="100%">
          <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit">
            {tc('actions.submit')}
          </Button>
        </Flex>
      </VStack>
    </form>
  );
};

const ForgotPassword = ({ onForgotPassword }) => {
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');
  const schema = Joi.object({
    ...emailSchema,
  });

  const { formState, handleSubmit, register } = useForm({
    defaultValues: forgotPasswordModel,
    resolver: joiResolver(schema),
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
  const schema = Joi.object({
    ...passwordSchema,
  });

  const { formState, handleSubmit, register } = useForm({
    defaultValues: resetPasswordModel,
    resolver: joiResolver(schema),
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
