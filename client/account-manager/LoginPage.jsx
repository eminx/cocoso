import React, { useContext } from 'react';
import { Redirect } from 'react-router';
import { Anchor, Box, Heading } from 'grommet';

import { StateContext } from '../LayoutContainer';
import Template from '../UIComponents/Template';
import { Login, SimpleText } from './index';
import { loginWithPassword } from './functions';

const LoginPage = ({ history }) => {
  const { currentUser } = useContext(StateContext);

  if (currentUser) {
    return <Redirect to="/my-profile" />;
  }

  const handleSubmit = (values) => {
    loginWithPassword(values.username, values.password);
  };

  return (
    <Template>
      <Box width="medium" alignSelf="center">
        <Heading level={2} textAlign="center">
          Login to Your Account
        </Heading>
        <SimpleText>
          Don't have an account?{' '}
          <Anchor onClick={() => history.push('/signup')}>Signup</Anchor>
        </SimpleText>
        <Box
          pad="medium"
          elevation="small"
          background="white"
          margin={{ bottom: 'medium' }}
        >
          <Login onSubmit={handleSubmit} />
        </Box>
        <Box>
          <SimpleText>
            Forgot your password?
            <br />
            <Anchor onClick={() => history.push('/forgot-password')}>
              Recover your password
            </Anchor>
          </SimpleText>
        </Box>
      </Box>
    </Template>
  );
};

export default LoginPage;
