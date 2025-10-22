import { Meteor } from 'meteor/meteor';
import React, { useLayoutEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router';
import { Trans, useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

import {
  Alert,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  Heading,
  Modal,
  Tabs,
  Text,
} from '/imports/ui/core';
import { message } from '/imports/ui/generic/message';
import ChangeLanguage from '/imports/ui/layout/ChangeLanguageMenu';
import { call, resizeImage, uploadImage } from '/imports/ui/utils/shared';
import {
  currentHostAtom,
  currentUserAtom,
  platformAtom,
  roleAtom,
} from '/imports/ui/LayoutContainer';

import AvatarUploader from './AvatarUploader';
import Boxling from '../admin/Boxling';
import KeywordsManager from './KeywordsManager';
import ProfileForm from './ProfileForm';

const subSpanStyle = {
  fontSize: '0.875rem',
  fontWeight: 300,
  textTransform: 'lowercase',
};

export default function EditProfile() {
  const currentHost = useAtomValue(currentHostAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const platform = useAtomValue(platformAtom);
  const role = useAtomValue(roleAtom);
  const [isDeleteModalOn, setIsDeleteModalOn] = useState(false);
  const [isLeaveModalOn, setIsLeaveModalOn] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadableAvatarLocal, setUploadableAvatarLocal] = useState(null);
  const [uploadableAvatar, setUploadableAvatar] = useState(null);
  const [lang, setLang] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');

  useLayoutEffect(() => {
    setLang(currentUser?.lang);
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleSetUploadableAvatar = (files) => {
    if (!files) {
      setUploadableAvatar(null);
      setUploadableAvatarLocal(null);
      return;
    }

    const uploadableAvatarFile = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(uploadableAvatarFile);
    reader.addEventListener(
      'load',
      () => {
        setUploadableAvatar(uploadableAvatarFile);
        setUploadableAvatarLocal(reader.result);
      },
      false
    );
  };

  const uploadAvatar = async () => {
    setIsUploading(true);

    try {
      const resizedAvatar = await resizeImage(uploadableAvatar, 1200);
      const uploadedAvatar = await uploadImage(
        resizedAvatar,
        'avatarImageUpload'
      );
      await call('setAvatar', uploadedAvatar);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.your')} ${tc('domains.avatar')}`,
        })
      );
    } catch (error) {
      message.error(error.reason);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitInfo = async (values) => {
    const formValues = {
      firstName: values.firstName || '',
      lastName: values.lastName || '',
      bio: values.bio || '',
      contactInfo: values.contactInfo || '',
    };
    try {
      await call('saveUserInfo', formValues);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.your')} ${tc('domains.data')}`,
        })
      );
    } catch (error) {
      message.error(error.reason);
    }
  };

  const handleSetLanguage = async () => {
    try {
      await call('setPreferredLanguage', lang);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.data')}`,
        })
      );
    } catch (error) {
      message.error(error.reason);
    }
  };

  const deleteAccount = () => {
    setIsDeleting(true);
    Meteor.call('deleteAccount', (error) => {
      if (error) {
        message.error(error.reason);
        return;
      }
      message.success(tc('message.success.remove'));
      navigate('/');
    });
  };

  const leaveHost = async () => {
    setIsLeaving(true);
    try {
      await call('leaveHost');
      message.success(
        tc('message.success.leave', {
          host: currentHost?.settings?.name,
        })
      );
      Meteor.logout();
      navigate('/');
      setIsLeaveModalOn(false);
    } catch (error) {
      message.error(error.reason);
    } finally {
      setIsLeaving(false);
    }
  };

  const setProfilePublic = async (isPublic) => {
    try {
      await call('setProfilePublic', isPublic);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.profile')}`,
        })
      );
    } catch (error) {
      message.error(error.reason);
    }
  };

  const setProfilePublicGlobally = async (isPublic) => {
    try {
      await call('setProfilePublicGlobally', isPublic);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.profile')}`,
        })
      );
    } catch (error) {
      message.error(error.reason);
    }
  };

  const removeAvatar = async () => {
    try {
      await call('setAvatar', null);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.profile')}`,
        })
      );
    } catch (error) {
      message.error(error.reason);
    }
  };

  const isMember = ['admin', 'contributor', 'participant'].includes(role);
  const currentMembership = currentUser.memberships.find(
    (m) => m.host === currentHost.host
  );
  const isUserPublic = Boolean(currentMembership?.isPublic);
  const isUserPublicGlobally = currentUser?.isPublic;
  const communityName = currentHost?.settings?.name;

  const { username } = currentUser;

  const tabs = [
    {
      title: tc('menu.member.general'),
      path: 'general',
      content: (
        <Box>
          <Boxling mb="8">
            <Heading mb="4" size="md">
              {t('profile.image')}
            </Heading>
            <AvatarUploader
              imageUrl={
                uploadableAvatarLocal ||
                (currentUser.avatar && currentUser.avatar.src)
              }
              isUploading={isUploading}
              uploadableAvatarLocal={uploadableAvatarLocal}
              removeAvatar={removeAvatar}
              uploadAvatar={uploadAvatar}
              setUploadableAvatar={handleSetUploadableAvatar}
              setUploadableAvatarLocal={setUploadableAvatarLocal}
            />
          </Boxling>

          <Boxling mb="8">
            <Heading my="2" size="md">
              {t('profile.label')}
            </Heading>
            <Box mb="4">
              <ProfileForm
                defaultValues={currentUser}
                onSubmit={handleSubmitInfo}
              />
            </Box>
          </Boxling>

          <Boxling>
            <KeywordsManager currentUser={currentUser} />
          </Boxling>
        </Box>
      ),
    },
    {
      title: t('profile.menu.language'),
      path: 'language',
      content: (
        <Boxling>
          <Heading mb="4" size="md">
            {tc('langs.form.label')}
          </Heading>
          <ChangeLanguage
            hideHelper
            select
            onChange={(selectedLang) => setLang(selectedLang)}
          />

          <Flex justify="flex-end" mt="4">
            <Button
              disabled={lang === currentUser.lang}
              onClick={handleSetLanguage}
            >
              {tc('actions.submit')}
            </Button>
          </Flex>
        </Boxling>
      ),
    },
    {
      title: t('profile.menu.privacy'),
      path: 'privacy',
      content: (
        <Boxling>
          <Box mb="4">
            <Heading size="md" pb="2">
              {platform?.name}{' '}
              <span style={subSpanStyle}>{tc('domains.platform')}</span>
            </Heading>
            <Checkbox
              checked={isUserPublicGlobally}
              id="is-user-public-globally"
              onChange={({ target: { checked } }) =>
                setProfilePublicGlobally(checked)
              }
            >
              {t('profile.makePublic.labelGlobal')}
            </Checkbox>
            <p>
              <Text fontSize="sm" my="2">
                {t('profile.makePublic.helperTextGlobal')}
              </Text>
            </p>
          </Box>

          <Divider my="4" />

          <Box pt="2">
            <Heading size="md" pb="2">
              {communityName}{' '}
              <span style={subSpanStyle}>{tc('domains.community')}</span>
            </Heading>

            <Alert bg="white" type="info" css={{ marginBottom: '0.4rem' }}>
              <Text fontSize="sm">
                <Trans
                  i18nKey="accounts:profile.message.role"
                  defaults="You as <bold>{{ username }}</bold> are part of {{ host }} with the <bold>{{ role }}</bold> role"
                  values={{
                    host: communityName,
                    role,
                    username,
                  }}
                  components={{ bold: <strong /> }}
                />
              </Text>
            </Alert>

            <Box py="4">
              <Checkbox
                checked={isUserPublic}
                disabled={!isUserPublicGlobally || currentHost.isPortalHost}
                id="is-user-public-locally"
                onChange={({ target: { checked } }) =>
                  setProfilePublic(checked)
                }
              >
                {t('profile.makePublic.label')}
              </Checkbox>
              <p>
                <Text fontSize="sm" my="2">
                  {t('profile.makePublic.helperText')}
                </Text>
              </p>
            </Box>

            <Box py="2">
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => setIsLeaveModalOn(true)}
              >
                {t('actions.leave', { host: communityName })}
              </Button>
            </Box>
          </Box>
        </Boxling>
      ),
    },
  ];

  const pathname = location?.pathname;
  const pathnameLastPart = pathname.split('/').pop();
  const tabIndex =
    tabs && tabs.findIndex((tab) => tab.path === pathnameLastPart);

  if (!isMember) {
    return (
      <Center p="8">
        <Alert type="error">{t('profile.message.deny')}</Alert>
      </Center>
    );
  }

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

          <Box>
            <Routes>
              {tabs.map((tab) => (
                <Route
                  key={tab.title}
                  path={tab.path}
                  element={<Box pt="2">{tab.content}</Box>}
                />
              ))}
            </Routes>
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
          id="edit-profile-leave-confirm"
          open={isLeaveModalOn}
          title={t('leave.title')}
          confirmText={t('leave.label')}
          confirmButtonProps={{
            colorScheme: 'red',
            isLoading: isLeaving,
          }}
          onConfirm={leaveHost}
          onClose={() => setIsLeaveModalOn(false)}
        >
          <Text>{t('leave.body')}</Text>
        </Modal>

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
