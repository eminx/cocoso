import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Button, Center, Heading } from '@chakra-ui/react';

import { StateContext } from '../LayoutContainer';
import Template from '../UIComponents/Template';
import { Login, SimpleText } from './index';
import { loginWithPassword } from './functions';

function LoginPage() {
  const { currentUser } = useContext(StateContext);

  if (currentUser) {
    return <Redirect to="/my-profile" />;
  }

  const handleSubmit = (values) => {
    loginWithPassword(values.username, values.password);
  };

  return (
    <Template>
      <Center>
        <Box w="xs">
          <Heading size="md" textAlign="center">
            Login to Your Account
          </Heading>
          <Center pt="4">
            <SimpleText>
              Don't have an account?
              <br />
              <Link to="/signup">
                <Button variant="link">Signup</Button>
              </Link>
            </SimpleText>
          </Center>
          <Box p="4" bg="white" mb="4">
            <Login onSubmit={handleSubmit} />
          </Box>
          <Center>
            <SimpleText>
              Forgot your password?
              <br />
              <Link to="/forgot-password">
                <Button variant="link">Reset your password</Button>
              </Link>
            </SimpleText>
          </Center>
        </Box>
      </Center>
    </Template>
  );
}

export default LoginPage;
