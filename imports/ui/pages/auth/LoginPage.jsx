import { Meteor } from 'meteor/meteor';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Center, Heading, Image, Link as CLink, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../../LayoutContainer';
import Template from '../../components/Template';
import ConfirmModal from '../../components/ConfirmModal';
import { Login } from './index';
import { message } from '../../components/message';

function LoginPage() {
  const [t] = useTranslation('accounts');
  const { currentUser, currentHost, role } = useContext(StateContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isJoinModal, setIsJoinModal] = useState(false);

  if (currentUser && ['participant', 'contributor', 'admin'].includes(role)) {
    return <Redirect to={`/@${currentUser.username}/profile`} />;
  }

  const handleSubmit = (values) => {
    Meteor.loginWithPassword(values.username, values.password, (error) => {
      if (error) {
        message.error(error.reason);
        return;
      }
      setIsSubmitted(true);
      setTimeout(() => {
        setIsJoinModal(true);
      }, 300);
    });
  };

  const cancelJoin = () => {
    Meteor.logout();
    setIsJoinModal(false);
    setIsSubmitted(false);
    message.info(t('logout.messages.success'));
  };

  const confirmJoin = async () => {
    try {
      await call('setSelfAsParticipant');
      message.success(t('profile.message.participant'));
    } catch (error) {
      console.error(error);
      message.error(error.reason);
    }
  };

  return (
    <Box pb="8" minHeight="100vh">
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
              <Login isSubmitted={isSubmitted} onSubmit={handleSubmit} />
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

      <ConfirmModal
        title={t('profile.join') + ' ' + currentHost?.settings?.name}
        visible={isJoinModal}
        onConfirm={() => confirmJoin()}
        onCancel={() => cancelJoin()}
        confirmText={t('profile.join')}
      >
        <Center>
          <Image src={currentHost?.logo} m="4" width="4xs" />
        </Center>
        <Text fontSize="lg">{t('profile.joinAsParticipantQuestion')}</Text>
      </ConfirmModal>
    </Box>
  );
}

export default LoginPage;
