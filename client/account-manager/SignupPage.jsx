import React, { useContext } from 'react';
import { Redirect } from 'react-router';
import { Anchor, Box, Heading } from 'grommet';

import { StateContext } from '../LayoutContainer';
import Template from '../UIComponents/Template';
import { Signup, SimpleText } from './index';
import { createAccount } from './functions';

const SignupPage = ({ history }) => {
  const { currentUser } = useContext(StateContext);

  if (currentUser) {
    return <Redirect to="/my-profile" />;
  }

  return (
    <Template>
      <Box width="medium" alignSelf="center">
        <Heading level={2} textAlign="center">
          Register New Account
        </Heading>
        <SimpleText>
          Have an account?{' '}
          <Anchor onClick={() => history.push('/login')}>Login</Anchor>
        </SimpleText>
        <Box
          pad="medium"
          elevation="small"
          background="white"
          margin={{ bottom: 'medium' }}
        >
          <Signup onSubmit={createAccount} />
        </Box>
      </Box>
    </Template>
  );
};

export default SignupPage;
