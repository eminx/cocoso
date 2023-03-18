import { Meteor } from 'meteor/meteor';
import React, { useContext, useLayoutEffect, useState } from 'react';
import { Redirect, Route, Switch as RouteSwitch, useLocation, useParams } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';

import ProfileForm from './ProfileForm';
import Breadcrumb from '../../components/Breadcrumb';
import ConfirmModal from '../../components/ConfirmModal';
import { message } from '../../components/message';
import { call, resizeImage, uploadImage } from '../../utils/shared';
import FormSwitch from '../../components/FormSwitch';
import { StateContext } from '../../LayoutContainer';
import AvatarUploader from './AvatarUploader';
import Tabs from '../../components/Tabs';
import ChangeLanguage from '../../components/ChangeLanguageMenu';
import FormField from '../../components/FormField';

function EditProfile({ history }) {
  const [isDeleteModalOn, setIsDeleteModalOn] = useState(false);
  const [isLeaveModalOn, setIsLeaveModalOn] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadableAvatarLocal, setUploadableAvatarLocal] = useState(null);
  const [uploadableAvatar, setUploadableAvatar] = useState(null);
  const [lang, setLang] = useState(null);
  const location = useLocation();
  const { currentHost, currentUser, isDesktop, platform, role } = useContext(StateContext);
  const { username } = useParams();
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');

  useLayoutEffect(() => {
    setLang(currentUser?.lang);
  }, [currentUser]);

  if (!currentUser || currentUser.username !== username) {
    return <Redirect to="/login" />;
  }

  const handleSetUploadableAvatar = (files) => {
    if (!files) {
      setUploadableAvatar(null);
      setUploadableAvatarLocal(null);
      return;
    }

    const uploadableAvatar = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(uploadableAvatar);
    reader.addEventListener(
      'load',
      () => {
        setUploadableAvatar(uploadableAvatar);
        setUploadableAvatarLocal(reader.result);
      },
      false
    );
  };

  const uploadAvatar = async () => {
    setIsUploading(true);

    try {
      const resizedAvatar = await resizeImage(uploadableAvatar, 1200);
      const uploadedAvatar = await uploadImage(resizedAvatar, 'avatarImageUpload');
      await call('setAvatar', uploadedAvatar);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.your')} ${tc('domains.avatar')}`,
        })
      );
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitInfo = async (values) => {
    try {
      await call('saveUserInfo', values);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.your')} ${tc('domains.data')}`,
        })
      );
    } catch (error) {
      console.log(error);
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
      console.log(error);
      message.error(error.reason);
    }
  };

  const deleteAccount = () => {
    setIsDeleting(true);
    Meteor.call('deleteAccount', (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.reason);
        return;
      }
      message.success(
        tc('message.success.remove', {
          domain: `${tc('domains.account')}`,
        })
      );
      history.push('/');
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
      history.push('/');
      setIsLeaveModalOn(false);
    } catch {
      console.log(error);
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
      console.log(error);
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
      console.log(error);
      message.error(error.reason);
    }
  };

  const furtherBreadcrumbLinks = [
    {
      label: currentUser.username,
      link: `/@${currentUser.username}`,
    },
    {
      label: tc('actions.update'),
      link: null,
    },
  ];

  const isMember = ['admin', 'contributor', 'participant'].includes(role);
  const currentMembership = currentUser.memberships.find((m) => m.host === currentHost.host);
  const isUserPublic = Boolean(currentMembership.isPublic);
  const isUserPublicGlobally = currentUser.isPublic;

  if (!isMember) {
    return (
      <Center p="8">
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{t('profile.message.deny')}</AlertTitle>
        </Alert>
      </Center>
    );
  }

  const tabs = [
    {
      title: t('profile.menu.avatar'),
      path: `/@${currentUser.username}/edit/avatar`,
      content: (
        <Box>
          <AvatarUploader
            imageUrl={uploadableAvatarLocal || (currentUser.avatar && currentUser.avatar.src)}
            isUploading={isUploading}
            uploadableAvatarLocal={uploadableAvatarLocal}
            uploadAvatar={uploadAvatar}
            setUploadableAvatar={handleSetUploadableAvatar}
            setUploadableAvatarLocal={setUploadableAvatarLocal}
          />
        </Box>
      ),
    },
    {
      title: t('profile.menu.about'),
      path: `/@${currentUser.username}/edit/about`,
      content: (
        <Box>
          <Heading mb="2" size="sm">
            {t('profile.label')}
          </Heading>
          <Box maxWidth={400}>
            <ProfileForm defaultValues={currentUser} onSubmit={handleSubmitInfo} />
          </Box>
        </Box>
      ),
    },
    {
      title: t('profile.menu.language'),
      path: `/@${currentUser.username}/edit/language`,
      content: (
        <Box>
          <FormField label={tc('langs.form.label')}>
            <ChangeLanguage
              currentLang={currentUser?.lang}
              hideHelper
              select
              onChange={(lang) => setLang(lang)}
            />
          </FormField>

          <Flex justify="flex-end" mt="4">
            <Button disabled={lang === currentUser.lang} onClick={handleSetLanguage}>
              {tc('actions.submit')}
            </Button>
          </Flex>
        </Box>
      ),
    },
    {
      title: t('profile.menu.options'),
      path: `/@${currentUser.username}/edit/options`,
      content: (
        <Box>
          <Text fontSize="sm" mb="2">
            {t('profile.makePublic.helperTextGlobal')}
          </Text>

          <FormSwitch
            colorScheme="green"
            isChecked={isUserPublicGlobally}
            label={t('profile.makePublic.label')}
            onChange={({ target: { checked } }) => setProfilePublicGlobally(checked)}
          />
        </Box>
      ),
    },
  ];

  const pathname = location?.pathname;
  const tabIndex = tabs && tabs.findIndex((tab) => tab.path === pathname);

  if (tabs && !tabs.find((tab) => tab.path === pathname)) {
    return <Redirect to={tabs[0].path} />;
  }

  const communityName = currentHost?.settings?.name;

  return (
    <Box>
      <Box ml={isDesktop ? '0' : '4'}>
        <Breadcrumb furtherItems={furtherBreadcrumbLinks} />
      </Box>

      <Box py="4" px={isDesktop ? '4' : '8'}>
        <Heading color="gray.800" size="lg">
          <Text as="span" fontWeight="normal">
            {t('profile.settings')}
          </Text>
        </Heading>
      </Box>

      <Flex flexDirection={isDesktop ? 'row' : 'column'} minH="100vh">
        <Box flexBasis={isDesktop ? '40%' : '100%'} ml={isDesktop ? '0' : '4'} p="4">
          <Heading size="md">
            {communityName}{' '}
            <Text as="span" fontSize="md" fontWeight="light" textTransform="lowercase">
              {tc('domains.community')}
            </Text>
          </Heading>

          <Box mt="4">
            <Alert bg="white" status="info" p="0">
              <AlertIcon color="gray.800" />
              <Text fontSize="sm">
                <Trans
                  i18nKey="accounts:profile.message.role"
                  defaults="You as <bold>{{ username }}</bold> are part of {{ host }} with the <bold>{{ role }}</bold> role"
                  values={{
                    host: communityName,
                    role,
                    username: currentUser.username,
                  }}
                  components={{ bold: <strong /> }}
                />
              </Text>
            </Alert>
          </Box>

          <Box my="4">
            <Text fontSize="sm" mb="2">
              {t('profile.makePublic.helperText')}
            </Text>

            <FormSwitch
              colorScheme="green"
              isChecked={isUserPublic}
              isDisabled={!isUserPublicGlobally || currentHost.isPortalHost}
              label={t('profile.makePublic.label')}
              onChange={({ target: { checked } }) => setProfilePublic(checked)}
            />
          </Box>

          <Box my="4">
            <Button colorScheme="red" size="sm" onClick={() => setIsLeaveModalOn(true)}>
              {t('actions.leave', { host: communityName })}
            </Button>
          </Box>
        </Box>

        <Box flexBasis={isDesktop ? '40%' : '100%'} p="4">
          <Heading size="md" ml="4">
            {platform?.name}{' '}
            <Text as="span" fontSize="md" fontWeight="light" textTransform="lowercase">
              {tc('domains.platform')}
            </Text>
          </Heading>

          <Alert bg="white" mb="4" ml="4" px="0" status="info">
            <AlertIcon color="gray.800" />
            <Text fontSize="sm">{t('profile.message.platform', { platform: platform?.name })}</Text>
          </Alert>

          <Tabs index={tabIndex} tabs={tabs} />

          <Box px="4">
            <RouteSwitch history={history}>
              {tabs.map((tab) => (
                <Route
                  key={tab.title}
                  exact
                  path={tab.path}
                  render={(props) => (
                    <Box {...props} pt="2">
                      {tab.content}
                    </Box>
                  )}
                />
              ))}
            </RouteSwitch>
          </Box>
        </Box>
      </Flex>

      <Box bg="red.100" my="8">
        <VStack spacing="4" mt="4" p="4">
          <Button colorScheme="red" size="sm" onClick={() => setIsDeleteModalOn(true)}>
            {t('delete.action')}
          </Button>
        </VStack>
      </Box>

      <ConfirmModal
        visible={isLeaveModalOn}
        title={t('leave.title')}
        confirmText={t('leave.label')}
        confirmButtonProps={{
          colorScheme: 'red',
          isLoading: isLeaving,
        }}
        onConfirm={leaveHost}
        onCancel={() => setIsLeaveModalOn(false)}
      >
        <Text>{t('leave.body')}</Text>
      </ConfirmModal>

      <ConfirmModal
        visible={isDeleteModalOn}
        title={t('delete.title')}
        confirmText={t('delete.label')}
        confirmButtonProps={{
          colorScheme: 'red',
          isLoading: isDeleting,
          isDisabled: isDeleting,
        }}
        onConfirm={deleteAccount}
        onCancel={() => setIsDeleteModalOn(false)}
      >
        <Text>{t('delete.body')}</Text>
      </ConfirmModal>
    </Box>
  );
}

export default EditProfile;
