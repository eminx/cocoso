import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Center, Heading, Image, Link as CLink, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../../LayoutContainer';
import Template from '../../components/Template';
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
      <Template>
        <Center p="4">
          <Box>
            <Heading size="md" textAlign="center">
              {t('signup.labels.title')}
            </Heading>

            <Center pt="4" mb="4">
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
              <Center p="2">
                <Box>
                  <Center mb="2">
                    <Image w="240px" src={platform?.logo} />
                  </Center>
                  <Text>{t('signup.labels.platform', { platform: platform?.name })}</Text>
                </Box>
              </Center>
            )}

            <Box p="6" bg="white" mb="4">
              <Signup onSubmit={(values) => createAccount(values)} />
            </Box>
          </Box>
        </Center>
      </Template>
    </Box>
  );
}

export default SignupPage;
