import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

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
import {
  currentHostAtom,
  currentUserAtom,
  platformAtom,
  roleAtom,
} from '/imports/state';

import { loginWithPassword } from './functions';
import { Login } from './index';

export default function LoginPage() {
  const currentHost = useAtomValue(currentHostAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const platform = useAtomValue(platformAtom);
  const role = useAtomValue(roleAtom);
  const [t] = useTranslation('accounts');
  const [submitted, setSubmitted] = useState(false);
  const [joinModal, setJoinModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    if (['participant', 'contributor', 'admin'].includes(role)) {
      navigate('/admin/my-profile/general');
    } else {
      setJoinModal(true);
    }
  }, [currentUser]);

  const handleSubmit = async (values) => {
    if (values?.username?.length < 4 || values?.password?.length < 8) {
      return;
    }
    setSubmitted(true);
    try {
      await loginWithPassword(values.username, values.password);
    } catch (error) {
      message.error(error.reason);
    } finally {
      setSubmitted(false);
    }
  };

  const cancelJoin = () => {
    Meteor.logout();
    setJoinModal(false);
    setSubmitted(false);
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
              <Login isSubmitted={submitted} onSubmit={handleSubmit} />
            </Box>
            <Center>
              <Text textAlign="center">
                {t('actions.forgot')}
                <br />
                <Link to="/forgot-password">
                  <CLink
                    as="span"
                    color="blue.500"
                    css={{ marginTop: '0.5rem' }}
                  >
                    <b>{t('actions.reset')}</b>
                  </CLink>
                </Link>
              </Text>
            </Center>
          </Box>
        </Center>
      </Modal>

      <Modal
        open={joinModal}
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
