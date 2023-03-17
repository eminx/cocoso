import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Center, Flex, Heading, Link as CLink, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Template from '../../components/Template';
import { ResetPassword } from './index';
import { StateContext } from '../../LayoutContainer';
import { call } from '../../utils/shared';
import { message } from '../../components/message';

const ResetPasswordPage = ({ history, match }) => {
  const [t] = useTranslation('accounts');
  const { currentUser } = useContext(StateContext);
  const { token } = match.params;

  const handleResetPassword = async ({ password }) => {
    try {
      await call('resetPassword', token, password);
      message.success(t('password.message.reset'));
      history.push('/login');
    } catch (error) {
      message.error(error.reason);
    }
  };

  if (currentUser) {
    return <Redirect to={`/@${currentUser.username}/profile`} />;
  }

  return (
    <Box pb="8" minHeight="100vh">
      <Template>
        <Center p="4">
          <Box w="xs">
            <Heading size="md" textAlign="center" mb="4">
              {t('password.labels.title')}
            </Heading>
            <Text fontSize="lg" mb="6" textAlign="center">
              {t('password.labels.subtitle.reset')}
            </Text>
            <Box p="6" bg="white" mb="4">
              <ResetPassword onResetPassword={handleResetPassword} />
            </Box>
            <Flex justify="space-around" mt="4">
              <Link to="/login">
                <CLink as="span">{t('actions.login')}</CLink>
              </Link>
              <Link to="/register">
                <CLink as="span">{t('actions.signup')}</CLink>
              </Link>
            </Flex>
          </Box>
        </Center>
      </Template>
    </Box>
  );
};

export default ResetPasswordPage;
