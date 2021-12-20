import React, { useState } from 'react';
import { Anchor, Box, Button, Form, FormField, Text, TextInput } from 'grommet';

import { emailIsValid } from '../functions';
const regexUsername = /[^a-z0-9]+/g;

const Login = ({ onSubmit }) => {
  return (
    <Box margin={{ bottom: 'medium' }}>
      <Form onSubmit={({ value }) => onSubmit(value)}>
        <FormField label="Username or Email address">
          <TextInput plain={false} name="username" placeholder="" />
        </FormField>

        <FormField label="Password">
          <TextInput
            plain={false}
            name="password"
            placeholder=""
            type="password"
          />
        </FormField>

        <Box direction="row" justify="end" pad="small">
          <Button type="submit" primary label="Login" />
        </Box>
      </Form>
    </Box>
  );
};

const Signup = ({ onSubmit }) => {
  const [errors, setErrors] = useState({});
  // const [value, setValue] = useState({});
  // const [touched, setTouched] = useState(false);

  const handleSubmit = ({ value, touched }) => {
    const { username, email, password } = value;
    let usernameError, emailError, passwordError;

    if (!username || username.length < 4) {
      usernameError = 'At least 4 characters';
    } else if (regexUsername.test(username)) {
      usernameError = 'Only lowercase-letters and numbers';
    }
    if (!email || email.length === 0) {
      emailError = 'Please type your email';
    } else if (!emailIsValid(email)) {
      emailError = 'Email is not valid';
    }
    if (!password || password.length < 8) {
      passwordError = 'At least 8 characters';
    }

    if (usernameError || emailError || passwordError) {
      setErrors({
        usernameError,
        emailError,
        passwordError,
      });
    } else {
      onSubmit(value, usernameError, emailError, passwordError);
    }
  };

  return (
    <Box margin={{ bottom: 'medium' }}>
      <Form onSubmit={handleSubmit}>
        <FormField
          label="Username"
          help={
            <Notice>
              minimum 4 characters, only lowercase letters and numbers
            </Notice>
          }
          error={<Notice isError>{errors.usernameError}</Notice>}
        >
          <TextInput plain={false} name="username" placeholder="" />
        </FormField>

        <FormField
          label="Email address"
          error={<Notice isError>{errors.emailError}</Notice>}
        >
          <TextInput plain={false} type="email" name="email" placeholder="" />
        </FormField>

        <FormField
          label="Password"
          help={<Notice>minimum 8 characters</Notice>}
          error={<Notice isError>{errors.passwordError}</Notice>}
        >
          <TextInput
            plain={false}
            name="password"
            placeholder=""
            type="password"
          />
          <Notice margin={{ left: 'small', top: 'small' }}>
            Your password is encrypted in the database.
          </Notice>
        </FormField>

        <Box direction="row" justify="end" pad="small">
          <Button type="submit" primary label="Signup" />
        </Box>
      </Form>
    </Box>
  );
};

const Notice = ({ isError, children, ...otherProps }) => (
  <Text
    color={isError ? 'status-error' : 'dark-3'}
    size="small"
    {...otherProps}
  >
    {children}
  </Text>
);

const ForgotPassword = ({ onForgotPassword }) => {
  return (
    <Box margin={{ bottom: 'medium' }}>
      <Form onSubmit={({ value }) => onForgotPassword(value)}>
        <FormField
          label="Type your email please"
          margin={{ bottom: 'medium', top: 'medium' }}
        >
          <TextInput plain={false} type="email" name="email" placeholder="" />
        </FormField>

        <Box direction="row" justify="end" pad="small">
          <Button type="submit" primary label="Send reset link" />
        </Box>
      </Form>
    </Box>
  );
};

const ResetPassword = ({ onResetPassword }) => {
  const [passwordError, setPasswordError] = useState(null);

  const handleSubmit = (value) => {
    const { password } = value;
    if (password.length < 8) {
      setPasswordError('minimum 8 characters');
    } else {
      onResetPassword(password);
    }
  };

  return (
    <Box margin={{ bottom: 'medium' }}>
      <Form onSubmit={({ value }) => handleSubmit(value)}>
        <FormField
          label="Password"
          margin={{ bottom: 'medium', top: 'medium' }}
          help={<Notice>minimum 8 characters</Notice>}
          error={<Notice isError>{passwordError}</Notice>}
        >
          <TextInput
            plain={false}
            type="password"
            name="password"
            placeholder=""
          />
        </FormField>

        <Box direction="row" justify="end" pad="small">
          <Button type="submit" primary label="Reset Password" />
        </Box>
      </Form>
    </Box>
  );
};

const AuthContainer = () => {
  const [mode, setMode] = useState('signup');

  if (mode === 'signup') {
    return (
      <Box>
        <Signup />
        <SimpleText>
          Have an account?{' '}
          <Anchor onClick={() => setMode('login')}>Login</Anchor>
        </SimpleText>
      </Box>
    );
  }

  if (mode === 'recover') {
    return (
      <Box>
        <ForgotPassword />
        <Box direction="row" justify="around">
          <SimpleText>
            <Anchor onClick={() => setMode('login')}>Login</Anchor>
          </SimpleText>
          <SimpleText>
            <Anchor onClick={() => setMode('signup')}>Signup</Anchor>
          </SimpleText>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Login />
      <SimpleText>
        Don't have an account?{' '}
        <Anchor onClick={() => setMode('signup')}>Signup</Anchor>
      </SimpleText>
      <SimpleText>
        Forgot your password?
        <br />
        <Anchor onClick={() => setMode('recover')}>Reset your password</Anchor>
      </SimpleText>
    </Box>
  );
};

const SimpleText = ({ children, ...otherProps }) => (
  <Text
    textAlign="center"
    margin={{ bottom: 'medium' }}
    size="small"
    {...otherProps}
  >
    {children}
  </Text>
);

export {
  Login,
  Signup,
  ForgotPassword,
  ResetPassword,
  AuthContainer,
  SimpleText,
};
