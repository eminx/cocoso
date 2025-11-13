import React, { useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

import {
  Alert,
  Box,
  Button,
  Center,
  Divider,
  Heading,
  Modal,
  Tabs,
  Text,
} from '/imports/ui/core';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/api/_utils/shared';
import { currentUserAtom, platformAtom, roleAtom } from '/imports/state';

export const subSpanStyle = {
  fontSize: '0.875rem',
  fontWeight: 300,
  textTransform: 'lowercase',
};

export default function EditProfile() {
  const currentUser = useAtomValue(currentUserAtom);
  const platform = useAtomValue(platformAtom);
  const role = useAtomValue(roleAtom);
  const [isDeleteModalOn, setIsDeleteModalOn] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const deleteAccount = async () => {
    setIsDeleting(true);
    try {
      await call('deleteAccount');
      message.success(tc('message.success.remove'));
      navigate('/');
    } catch (error) {
      message.error(error.reason);
    }
  };

  const tabs = [
    {
      title: tc('menu.member.general'),
      path: 'general',
    },
    {
      title: t('profile.menu.language'),
      path: 'language',
    },
    {
      title: t('profile.menu.privacy'),
      path: 'privacy',
    },
  ];

  const isMember = ['admin', 'contributor', 'participant'].includes(role);

  if (!isMember) {
    return (
      <Center p="8">
        <Alert type="error">{t('profile.message.deny')}</Alert>
      </Center>
    );
  }

  const pathname = location?.pathname;
  const pathnameLastPart = pathname.split('/').pop();
  const tabIndex =
    tabs && tabs.findIndex((tab) => tab.path === pathnameLastPart);

  if (tabs && !tabs.find((tab) => tab.path === pathnameLastPart)) {
    return <Navigate to={tabs[0].path} />;
  }

  return (
    <>
      <Box mb="8" css={{ minHeight: '100vh' }}>
        <Box w="100%">
          <Heading size="md" mb="4">
            {platform?.name}{' '}
            <span style={subSpanStyle}>{tc('domains.platform')}</span>
          </Heading>

          <Box mb="4">
            <Alert bg="bluegray.50" mb="8" type="info">
              <Text fontSize="sm" mr="4">
                {t('profile.message.platform', {
                  platform: platform?.name,
                })}
              </Text>
            </Alert>
          </Box>

          <Tabs align="center" index={tabIndex} tabs={tabs} />

          <Box mt="8">
            <Outlet />
          </Box>
        </Box>

        <Divider my="4" />

        <Box bg="red.100" mt="24">
          <Center p="4">
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => setIsDeleteModalOn(true)}
            >
              {t('delete.action')}
            </Button>
          </Center>
        </Box>

        <Modal
          id="edit-profile-delete-account-confirm"
          open={isDeleteModalOn}
          title={t('delete.title')}
          confirmText={t('delete.label')}
          confirmButtonProps={{
            colorScheme: 'red',
            isLoading: isDeleting,
            isDisabled: isDeleting,
          }}
          onConfirm={deleteAccount}
          onClose={() => setIsDeleteModalOn(false)}
        >
          <Text>{t('delete.body')}</Text>
        </Modal>
      </Box>
    </>
  );
}
