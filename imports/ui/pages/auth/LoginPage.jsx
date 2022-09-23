import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Center, Heading, Link as CLink, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../../LayoutContainer';
import Template from '../../components/Template';
import Header from '../../components/Header';
import { Login } from './index';
import { loginWithPassword } from './functions';

function LoginPage() {
  const [t] = useTranslation('accounts');
  const { currentUser } = useContext(StateContext);

  if (currentUser) {
    return <Redirect to={`/@${currentUser.username}/profile`} />;
  }

  const handleSubmit = (values) => {
    loginWithPassword(values.username, values.password);
  };

  return (
    <Box bg="gray.100" pb="8" minHeight="100vh">
      <Header />
      <Template>
        <Center p="4">
          <Box w="xs">
            <Heading size="md" textAlign="center">
              {t('login.labels.title')}
            </Heading>
            <Center pt="4" mb="4">
              <Text>
                {t('login.labels.subtitle')}{' '}
                <Link to="/signup">
                  <CLink as="span">
                    <b>{t('actions.signup')}</b>
                  </CLink>
                </Link>
              </Text>
            </Center>
            <Box p="6" bg="white" mb="4">
              <Login onSubmit={handleSubmit} />
            </Box>
            <Center>
              <Text>
                {t('actions.forgot')}
                <br />
                <Link to="/forgot-password">
                  <CLink as="span">
                    <b>{t('actions.reset')}</b>
                  </CLink>
                </Link>
              </Text>
            </Center>
          </Box>
        </Center>
      </Template>
    </Box>
  );
}

export default LoginPage;
