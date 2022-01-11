import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Center, Heading, Link as CLink, Text } from '@chakra-ui/react';

import { StateContext } from '../LayoutContainer';
import Template from '../components/Template';
import { Signup } from './index';
import { createAccount } from './functions';

function SignupPage() {
  const { currentUser } = useContext(StateContext);

  if (currentUser) {
    return <Redirect to="/my-profile" />;
  }

  return (
    <Template>
      <Center>
        <Box>
          <Heading size="md" textAlign="center">
            Register New Account
          </Heading>
          <Center pt="4" mb="4">
            <Text>
              Have an account?{' '}
              <Link to="/login">
                <CLink as="span">
                  <b>Login</b>
                </CLink>
              </Link>
            </Text>
          </Center>
          <Box p="6" bg="white" mb="4">
            <Signup onSubmit={(values) => createAccount(values)} />
          </Box>
        </Box>
      </Center>
    </Template>
  );
}

export default SignupPage;
