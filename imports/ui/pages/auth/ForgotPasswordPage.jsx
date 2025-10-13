import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Center,
  Flex,
  Heading,
  Link as CLink,
  Text,
} from '/imports/ui/core';

import { message } from '/imports/ui/generic/message';
import { call } from '/imports/ui/utils/shared';
import { StateContext } from '/imports/ui/LayoutContainer';

import { ForgotPassword } from './index';

function ForgotPasswordPage() {
  const [t] = useTranslation('accounts');
  const [emailSent, setEmailSent] = useState(false);
  const { currentUser } = useContext(StateContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    navigate(`/@${currentUser.username}/profile`);
  }, [currentUser]);

  const handleForgotPassword = async (email) => {
    try {
      await call('resetUserPassword', email);
      message.success(t('password.message.checkMail'));
      setEmailSent(true);
    } catch (error) {
      message.error(error.reason);
    }
  };

  return (
    <Box pb="8">
      <Center p="4">
        <Box w="xs">
          <Heading size="md" textAlign="center">
            {t('password.labels.title')}
          </Heading>
          <Center pt="4" px="4">
            <Text mb="4" textAlign="center">
              {t('password.labels.subtitle.forgot')}
            </Text>
          </Center>

          <Box
            bg="theme.50"
            p="6"
            css={{
              border: '1px solid',
              borderColor: 'var(--cocoso-colors-theme-100)',
            }}
          >
            {emailSent ? (
              <Text>{t('password.message.linkSend')}</Text>
            ) : (
              <ForgotPassword onForgotPassword={handleForgotPassword} />
            )}
          </Box>

          <Flex justify="space-around" mt="4">
            <Link to="/login">
              <CLink as="span" color="blue.500">
                <b>{t('actions.login')}</b>
              </CLink>
            </Link>
            <Link to="/register">
              <CLink as="span" color="blue.500">
                <b>{t('actions.signup')}</b>
              </CLink>
            </Link>
          </Flex>
        </Box>
      </Center>
    </Box>
  );
}

export default ForgotPasswordPage;
