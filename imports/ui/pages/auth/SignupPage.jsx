import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Center, Heading, Image, Link as CLink, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../../LayoutContainer';
import { Signup } from './index';
import { createAccount } from './functions';

function SignupPage() {
  const [t] = useTranslation('accounts');
  const { currentUser, platform } = useContext(StateContext);

  if (currentUser) {
    return <Redirect to={`/@${currentUser.username}/profile`} />;
  }

  return (
    <Box pb="8" minHeight="100vh">
      <Center p="4">
        <Box w="sm">
          <Heading size="md" textAlign="center">
            {t('signup.labels.title')}
          </Heading>

          <Center py="4">
            <Text>
              {t('signup.labels.subtitle')}{' '}
              <Link to="/login">
                <CLink as="span">
                  <b>{t('actions.login')}</b>
                </CLink>
              </Link>
            </Text>
          </Center>

          {platform && (
            <Center py="4">
              <Box>
                <Center mb="4">
                  <Image w="240px" src={platform?.logo} />
                </Center>
                <Text textAlign="center">
                  {t('signup.labels.platform', { platform: platform?.name })}
                </Text>
              </Box>
            </Center>
          )}

          <Box bg="brand.50" mb="4" p="6">
            <Signup onSubmit={(values) => createAccount(values)} />
          </Box>
        </Box>
      </Center>
    </Box>
  );
}

export default SignupPage;
