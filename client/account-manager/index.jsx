import React, { useState } from 'react';
import {
  Anchor,
  Box,
  Button,
  Heading,
  Form,
  FormField,
  Text,
  TextInput,
} from 'grommet';

const Login = ({ onSubmit }) => {
  return (
    <Box margin={{ bottom: 'medium' }}>
      <Form onSubmit={({ value }) => onSubmit(value)}>
        <FormField label="Username or Email address" required>
          <TextInput plain={false} name="username" placeholder="" />
        </FormField>

        <FormField label="Password" required>
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
  const [value, setValue] = useState({});
  let usernameError, emailError, passwordError;
  const regexUsername = /[^a-z0-9]+/g;

  const { username, email, password } = value;
  if (!username || username.length < 4) {
    usernameError = 'At least 4 characters';
  } else if (regexUsername.test(username)) {
    usernameError = 'Only lowercase letters and numbers please';
  }
  if (!password || password.length < 8) {
    passwordError = 'At least 8 characters';
  }
  if (!email || email.length === 0) {
    emailError = 'Please type your email';
  }

  return (
    <Box margin={{ bottom: 'medium' }}>
      <Form
        value={value}
        onChange={(nextValue) => setValue(nextValue)}
        onSubmit={({ value }) => onSubmit(value)}
      >
        <FormField
          label="Username"
          validate={[{ regexp: regexUsername }]}
          help={
            <Text color="dark-3" size="small">
              minimum 4 characters, only lowercase letters and numbers
            </Text>
          }
          error={
            <Text color="status-error" size="small">
              {usernameError}
            </Text>
          }
        >
          <TextInput plain={false} name="username" placeholder="" />
        </FormField>

        <FormField
          label="Email address"
          error={
            <Text color="status-error" size="small">
              {emailError}
            </Text>
          }
        >
          <TextInput plain={false} type="email" name="email" placeholder="" />
        </FormField>

        <FormField
          label="Password"
          help={
            <Text color="dark-3" size="small">
              minimum 8 characters, with at least 1 special
            </Text>
          }
          error={
            <Text color="status-error" size="small">
              {passwordError}
            </Text>
          }
        >
          <TextInput
            plain={false}
            name="password"
            placeholder=""
            type="password"
          />
        </FormField>

        <Box direction="row" justify="end" pad="small">
          <Button
            type="submit"
            primary
            disabled={usernameError || emailError || passwordError}
            label="Signup"
          />
        </Box>
      </Form>
    </Box>
  );
};

const ForgotPassword = () => {
  return (
    <Box margin={{ bottom: 'medium' }}>
      <Form onSubmit={({ value }) => console.log(value)}>
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

const AuthContainer = () => {
  const [mode, setMode] = useState('signup');
  // const [signup, setSignup] = useState(true);
  // const [recover, setRecover]

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
        <Anchor onClick={() => setMode('recover')}>
          Recover your password
        </Anchor>
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

export { Login, Signup, ForgotPassword, AuthContainer, SimpleText };
