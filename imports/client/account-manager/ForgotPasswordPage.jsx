import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Button, Center, Heading, HStack, Text } from '@chakra-ui/react';

import Template from '../UIComponents/Template';
import { ForgotPassword, SimpleText } from './index';
import { StateContext } from '../LayoutContainer';
import { call } from '../functions';
import { message } from '../UIComponents/message';

function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const { currentUser } = useContext(StateContext);

  const handleForgotPassword = async (email) => {
    try {
      await call('forgotPassword', email);
      message.success(
        'Please check your email and see if you received a link to reset your password'
      );
      setEmailSent(true);
    } catch (error) {
      message.error(error.reason);
    }
  };

  if (currentUser) {
    return <Redirect to="/my-profile" />;
  }

  return (
    <Template>
      <Center>
        <Box w="xs">
          <Heading px="4" size="md" textAlign="center">
            Reset Password
          </Heading>
          <Center pt="4" px="4">
            <Text mb="4" textAlign="center">
              If you forgot your password, reset it via a link sent to your
              email.
            </Text>
          </Center>

          <Box bg="white" p="4">
            {emailSent ? (
              <Text>Reset link is sent to your email.</Text>
            ) : (
              <ForgotPassword onForgotPassword={handleForgotPassword} />
            )}
          </Box>

          <HStack justify="space-around" mt="4">
            <SimpleText>
              <Link to="/login">
                <Button variant="link">Login</Button>
              </Link>
            </SimpleText>
            <SimpleText>
              <Link to="/signup">
                <Button variant="link">Signup</Button>
              </Link>
            </SimpleText>
          </HStack>
        </Box>
      </Center>
    </Template>
  );
}

export default ForgotPasswordPage;
