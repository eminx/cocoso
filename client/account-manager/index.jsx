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

const Login = ({ value, onChange, disabled = true }) => {
  return (
    <Box margin={{ bottom: 'medium' }}>
      <Form onSubmit={({ value }) => console.log(value)}>
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

const Signup = ({ value, onChange, disabled = true }) => {
  return (
    <Box margin={{ bottom: 'medium' }}>
      <Form onSubmit={({ value }) => console.log(value)}>
        <FormField label="Username">
          <TextInput plain={false} name="username" placeholder="" />
        </FormField>

        <FormField label="Email address">
          <TextInput plain={false} name="email" placeholder="" />
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
          <Button type="submit" primary label="Signup" />
        </Box>
      </Form>
    </Box>
  );
};

const PasswordRecovery = () => {
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
        <SimpleText>
          Forgot your password?
          <br />
          <Anchor onClick={() => setMode('recover')}>
            Recover your password
          </Anchor>
        </SimpleText>
      </Box>
    );
  }

  if (mode === 'recover') {
    return (
      <Box>
        <PasswordRecovery />
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
    </Box>
  );
};

const SimpleText = ({ children }) => (
  <Text textAlign="center" margin={{ bottom: 'medium' }}>
    {children}
  </Text>
);

export { Login, Signup, PasswordRecovery, AuthContainer };
