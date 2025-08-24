import React, { useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Center,
  Heading,
  Image,
  Link as CLink,
  Modal,
  Text,
} from '/imports/ui/core';

import { StateContext } from '/imports/ui/LayoutContainer';
import { Signup } from './index';
import { createAccount } from './functions';

export default function SignupPage() {
  const [t] = useTranslation('accounts');
  const { currentUser, platform } = useContext(StateContext);
  const navigate = useNavigate();

  if (currentUser && platform?.isFederationLayout) {
    return <Navigate to="/intro" />;
  } else if (currentUser) {
    return <Navigate to={`/@${currentUser.username}`} />;
  }

  return (
    <Box pb="8">
      <Modal
        // contentProps={{ h: 'auto' }}
        hideHeader
        hideFooter
        open
        // scrollBehavior="outside"
        size="2xl"
        onClose={() => navigate('/')}
      >
        <Center>
          <Box w="sm">
            {platform && (
              <Center>
                <Box>
                  {platform?.logo && (
                    <Center p="4">
                      <Image w="240px" src={platform?.logo} />
                    </Center>
                  )}
                  <Heading mb="4" size="md" textAlign="center">
                    {t('signup.labels.title')}
                  </Heading>
                  {/* {platform?.isFederationLayout && ( */}
                  <Text textAlign="center">
                    {t('signup.labels.platform', {
                      platform: platform?.name,
                    })}
                  </Text>
                  {/* )} */}
                </Box>
              </Center>
            )}

            <Center py="4">
              <Text>
                {t('signup.labels.subtitle')}{' '}
                <Link to="/login">
                  <CLink as="span" color="blue.500">
                    <b>{t('actions.login')}</b>
                  </CLink>
                </Link>
              </Text>
            </Center>

            <Box
              bg="gray.50"
              mb="4"
              p="6"
              css={{
                border: '1px solid',
                borderColor: 'var(--cocoso-colors-gray-300)',
              }}
            >
              <Signup onSubmit={(values) => createAccount(values)} />
            </Box>
          </Box>
        </Center>
      </Modal>
    </Box>
  );
}
