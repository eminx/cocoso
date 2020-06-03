import React, { useContext } from 'react';
import { Redirect } from 'react-router';
import { Anchor, Box, Heading } from 'grommet';

import { UserContext } from '../LayoutContainer';
import Template from '../UIComponents/Template';
import { Login, SimpleText } from './index';

const LoginPage = ({ history }) => {
  const { currentUser } = useContext(UserContext);

  if (currentUser) {
    return <Redirect to="/my-profile" />;
  }

  return (
    <Template>
      <Box width="medium" alignSelf="center">
        <Heading level={2}>Login to Your Account</Heading>
        <SimpleText>
          Don't have an account?{' '}
          <Anchor onClick={() => history.push('/signup')}>Signup</Anchor>
        </SimpleText>
        <Login />
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
