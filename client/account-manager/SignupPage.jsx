import React, { useContext } from 'react';
import { Redirect } from 'react-router';
import { Anchor, Box, Heading } from 'grommet';

import { UserContext } from '../LayoutContainer';
import Template from '../UIComponents/Template';
import { Signup, SimpleText } from './index';
import { createAccount } from './functions';

const SignupPage = ({ history }) => {
  const { currentUser } = useContext(UserContext);

  if (currentUser) {
    return <Redirect to="/my-profile" />;
  }

  return (
    <Template>
      <Box width="medium" alignSelf="center">
        <Heading level={2}>Register New Account</Heading>
        <SimpleText>
          Have an account?{' '}
          <Anchor onClick={() => history.push('/login')}>Login</Anchor>
        </SimpleText>

        <Signup onSubmit={createAccount} />
      </Box>
    </Template>
  );
};

export default SignupPage;
