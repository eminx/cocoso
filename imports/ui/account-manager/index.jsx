import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
const Joi = require('joi');
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';

import FormField from '../UIComponents/FormField';
import {
  loginModel,
  signupModel,
  forgotPasswordModel,
  resetPasswordModel,
  usernameSchema,
  emailSchema,
  passwordSchema,
} from './account.helpers';

const Login = ({ onSubmit }) => {
  const { formState, handleSubmit, register } = useForm({
    defaultValues: loginModel,
  });
  const { isDirty, isSubmitting } = formState;

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <VStack spacing="6">
        <FormField label="Username or Email address">
          <Input {...register('username')} />
        </FormField>

        <FormField label="Password">
          <Input {...register('password')} type="password" />
        </FormField>

        <Flex justify="flex-end" py="4" w="100%">
          <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit">
            Confirm
          </Button>
        </Flex>
      </VStack>
    </form>
  );
};

const Signup = ({ onSubmit }) => {
  const schema = Joi.object({
    ...usernameSchema,
    ...emailSchema,
    ...passwordSchema,
  });

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
          helperText="Minimum 4 characters, only lowercase letters and numbers"
          isInvalid={errors.username}
          label="Username"
        >
          <Input {...register('username')} />
        </FormField>

        <FormField
          errorMessage={errors.email?.message}
          isInvalid={errors.email}
          label="Email address"
        >
          <Input {...register('email')} type="email" />
        </FormField>

        <FormField
          errorMessage={errors.password?.message}
          helperText="Notice>minimum 8 characters"
          isInvalid={errors.password}
          label="Password"
        >
          <Input {...register('password')} type="password" />
        </FormField>
        <Center>
          <Text fontSize="xs" textAlign="center">
            Your password is encrypted in the database.
          </Text>
        </Center>

        <Flex justify="flex-end" py="4" w="100%">
          <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit">
            Confirm
          </Button>
        </Flex>
      </VStack>
    </form>
  );
};

const ForgotPassword = ({ onForgotPassword }) => {
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
          label="Type your email please"
        >
          <Input {...register('email')} type="email" />
        </FormField>

        <Flex justify="flex-end" py="4" w="100%">
          <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit">
            Confirm
          </Button>
        </Flex>
      </VStack>
    </form>
  );
};

const ResetPassword = ({ onResetPassword }) => {
  const schema = Joi.object({
    ...passwordSchema,
  });

  const { formState, handleSubmit, register } = useForm({
    defaultValues: resetPasswordModel,
    resolver: joiResolver(schema),
  });
  const { errors, isDirty, isSubmitting } = formState;

  return (
    <form onSubmit={handleSubmit((data) => onResetPassword(data))}>
      <VStack spacing="6">
        <FormField
          errorMessage={errors.password?.message}
          helperText="Minimum 8 characters"
          isInvalid={errors.password}
          label="Password"
        >
          <Input {...register('password')} type="password" />
        </FormField>

        <Flex justify="flex-end" py="4" w="100%">
          <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit">
            Confirm
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
          <Text>Have an account?</Text>
          <Link onClick={() => setMode('login')}>Login</Link>
        </Center>
      </Box>
    );
  }

  if (mode === 'recover') {
    return (
      <Box>
        <ForgotPassword />
        <Flex justify="space-around">
          <Link onClick={() => setMode('login')}>Login</Link>
          <Link onClick={() => setMode('signup')}>Signup</Link>
        </Flex>
      </Box>
    );
  }

  return (
    <Box>
      <Login />
      <Center mb="8">
        <Heading>Don't have an account?</Heading>
        <Link onClick={() => setMode('signup')}>Signup</Link>
      </Center>
      <Center>
        <Heading>Forgot your password?</Heading>
        <Link onClick={() => setMode('recover')}>Reset your password</Link>
      </Center>
    </Box>
  );
};

export { Login, Signup, ForgotPassword, ResetPassword, AuthContainer };
