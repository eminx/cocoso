import { Meteor } from 'meteor/meteor';
import React, { useContext, useState } from 'react';
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

import { message } from '/imports/ui/generic/message';
import { call } from '/imports/ui/utils/shared';
import { StateContext } from '/imports/ui/LayoutContainer';
import { Login } from './index';

export default function LoginPage() {
  const [t] = useTranslation('accounts');
  const { currentUser, currentHost, platform, role } = useContext(StateContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isJoinModal, setIsJoinModal] = useState(false);
  const navigate = useNavigate();

  if (currentUser && ['participant', 'contributor', 'admin'].includes(role)) {
    return <Navigate to="/admin/my-profile/general" />;
  }

  const handleSubmit = (values) => {
    if (values?.username?.length < 4 || values?.password?.length < 8) {
      return;
    }
    setIsSubmitted(true);
    Meteor.loginWithPassword(values.username, values.password, (error) => {
      if (error) {
        message.error(error.reason);
        setIsSubmitted(false);
        return;
      }
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
      message.error(error.reason || error.error);
    }
  };

  return (
    <Box pb="8">
      <Modal
        contentProps={{ h: 'auto' }}
        hideHeader
        hideFooter
        id="login-page"
        open
        size="2xl"
        onClose={() => navigate('/')}
      >
        <Center mb="8">
          <Box w="xs">
            {platform && (
              <Center p="4">
                <Image w="240px" src={platform?.logo} />
              </Center>
            )}

            <Heading mb="4" size="md" textAlign="center">
              {t('login.labels.title')}
            </Heading>

            <Center mb="6">
              <Text>
                {t('login.labels.subtitle')}{' '}
                <Link to="/register">
                  <CLink as="span" color="blue.500">
                    <b>{t('actions.signup')}</b>
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
              <Login isSubmitted={isSubmitted} onSubmit={handleSubmit} />
            </Box>
            <Center>
              <Text textAlign="center">
                {t('actions.forgot')}
                <br />
                <Link to="/forgot-password">
                  <CLink as="span" color="blue.500">
                    <b>{t('actions.reset')}</b>
                  </CLink>
                </Link>
              </Text>
            </Center>
          </Box>
        </Center>
      </Modal>

      <Modal
        open={isJoinModal}
        id="login-page-join"
        title={t('profile.joinHost', {
          host: currentHost?.settings?.name,
        })}
        onConfirm={() => confirmJoin()}
        onClose={() => cancelJoin()}
        confirmText={t('profile.join')}
      >
        <Center>
          <Image src={currentHost?.logo} m="4" width="4xs" />
        </Center>
        <Text fontSize="lg">{t('profile.joinAsParticipantQuestion')}</Text>
      </Modal>
    </Box>
  );
}
