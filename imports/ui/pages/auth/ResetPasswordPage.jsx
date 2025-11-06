import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

import {
  Box,
  Center,
  Flex,
  Heading,
  Link as CLink,
  Text,
} from '/imports/ui/core';
import { currentUserAtom } from '/imports/state';
import { call } from '../../../api/_utils/shared';
import { message } from '/imports/ui/generic/message';

import { ResetPassword } from './index';

function ResetPasswordPage() {
  const currentUser = useAtomValue(currentUserAtom);
  const [t] = useTranslation('accounts');
  const navigate = useNavigate();
  const { token } = useParams();

  const handleResetPassword = async ({ password }) => {
    try {
      await call('resetPassword', token, password);
      message.success(t('password.message.reset'));
      navigate('/login');
    } catch (error) {
      message.error(error.reason);
    }
  };

  if (currentUser) {
    return <Navigate to={`/@${currentUser.username}/profile`} />;
  }

  return (
    <Box pb="8">
      <Center p="4">
        <Box w="xs">
          <Heading size="md" textAlign="center" mb="4">
            {t('password.labels.title')}
          </Heading>
          <Center>
            <Text fontSize="lg">{t('password.labels.subtitle.reset')}</Text>
          </Center>
          <Box bg="theme.50" maxW="420px" my="4" p="6">
            <ResetPassword onResetPassword={handleResetPassword} />
          </Box>
          <Flex justify="space-around" mt="4">
            <Link to="/login">
              <CLink as="span" fontWeight="bold">
                <b>{t('actions.login')}</b>
              </CLink>
            </Link>
            <Link to="/register">
              <CLink as="span">
                <b>{t('actions.signup')}</b>
              </CLink>
            </Link>
          </Flex>
        </Box>
      </Center>
    </Box>
  );
}

export default ResetPasswordPage;
