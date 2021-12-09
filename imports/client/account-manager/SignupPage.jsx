import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Button, Center, Heading } from '@chakra-ui/react';

import { StateContext } from '../LayoutContainer';
import Template from '../UIComponents/Template';
import { Signup, SimpleText } from './index';
import { createAccount } from './functions';

function SignupPage() {
  const { currentUser } = useContext(StateContext);

  if (currentUser) {
    return <Redirect to="/my-profile" />;
  }

  return (
    <Template>
      <Center>
        <Box w="xs">
          <Heading size="md" textAlign="center">
            Register New Account
          </Heading>
          <Center pt="4">
            <SimpleText>
              Have an account?
              <br />
              <Link to="/login">
                <Button as="span" variant="link">
                  Login
                </Button>
              </Link>
            </SimpleText>
          </Center>
          <Box p="4" bg="white" mb="4">
            <Signup onSubmit={(values) => createAccount(values)} />
          </Box>
        </Box>
      </Center>
    </Template>
  );
}

export default SignupPage;
