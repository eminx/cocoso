import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Button, Center, Flex, Heading, Text } from '@chakra-ui/react';

import Template from '../UIComponents/Template';
import { ResetPassword } from './index';
import { StateContext } from '../LayoutContainer';
import { call } from '../functions';
import { message } from '../UIComponents/message';

const ResetPasswordPage = ({ history, match }) => {
  const { currentUser } = useContext(StateContext);
  const { token } = match.params;

  const handleResetPassword = async (password) => {
    try {
      await call('resetPassword', token, password);
      message.success('Your password is successfully reset. Now you can login');
      history.push('/login');
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
          <Heading>Reset Your Password</Heading>
          <Text fontSize="lg" mb="6">
            Type your desired password
          </Text>
          <ResetPassword onResetPassword={handleResetPassword} />
          <Flex justify="space-around" mt="4">
            <Link to="/login">
              <Button as="span" type="link">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button as="span" type="link">
                Signup
              </Button>
            </Link>
          </Flex>
        </Box>
      </Center>
    </Template>
  );
};

export default ResetPasswordPage;
