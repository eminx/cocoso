import { Meteor } from 'meteor/meteor';
import React, { useContext, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { Box, Button, Center, Heading, HStack, Switch, VStack, Text } from '@chakra-ui/react';

import ProfileForm from './ProfileForm';
import Template from '../../components/Template';
import Breadcrumb from '../../components/Breadcrumb';
import ConfirmModal from '../../components/ConfirmModal';
import { message } from '../../components/message';
import { call, resizeImage, uploadImage } from '../../utils/shared';
import FileDropper from '../../components/FileDropper';
import FormField from '../../components/FormField';
import { StateContext } from '../../LayoutContainer';

function Profile({ history }) {
  const [isDeleteModalOn, setIsDeleteModalOn] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadableAvatarLocal, setUploadableAvatarLocal] = useState(null);
  const [uploadableAvatar, setUploadableAvatar] = useState(null);

  const { currentHost, currentUser, role } = useContext(StateContext);
  const { username } = useParams();
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');

  if (!currentUser || currentUser.username !== username) {
    return <Redirect to="/login" />;
  }

  const handleSubmit = async (values) => {
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

  const handleSetUploadableAvatar = (files) => {
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
          domain: `${tc('domains.your')} ${tc('domains.account')}`,
        })
      );
      history.push('/');
    });
  };

  const setProfilePublic = async (isPublic) => {
    try {
      await call('setProfilePublic', isPublic);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.your')} ${tc('domains.profile')}`,
        })
      );
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  const membersInMenu = currentHost?.settings?.menu?.find((item) => item.name === 'members');

  const furtherBreadcrumbLinks = [
    {
      label: membersInMenu?.label,
      link: '/members',
    },
    {
      label: currentUser.username,
      link: `/@${currentUser.username}`,
    },
    {
      label: tc('actions.update'),
      link: null,
    },
  ];

  return (
    <Box>
      <Breadcrumb furtherItems={furtherBreadcrumbLinks} />
      <Template>
        <Box bg="white">
          <Center my="2" p="2">
            {['admin', 'contributor', 'participant'].includes(role) && (
              <Text textAlign="center" fontSize="sm">
                <Trans
                  i18nKey="accounts:profile.message.role"
                  defaults="You as <bold>{{ username }}</bold> are part of this organisation with the <bold>{{ role }}</bold> role"
                  values={{ username: currentUser.username, role }}
                  components={{ bold: <strong /> }}
                />
              </Text>
            )}
          </Center>

          <Center bg="white" p="4" mb="4">
            <Box mb="4">
              <Heading size="md" mb="2" textAlign="center">
                {t('profile.form.avatar.label')}
              </Heading>
              <Center style={{ overflow: 'hidden' }}>
                <Box w="120px" h="120px">
                  <FileDropper
                    imageUrl={
                      uploadableAvatarLocal || (currentUser.avatar && currentUser.avatar.src)
                    }
                    label={t('profile.form.avatar.fileDropper')}
                    round
                    height="100%"
                    imageFit="cover"
                    setUploadableImage={handleSetUploadableAvatar}
                  />
                </Box>
              </Center>
              {uploadableAvatarLocal && (
                <HStack spacing="2" p="4">
                  <Button
                    colorScheme="red"
                    margin={{ top: 'small' }}
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setUploadableAvatar(null);
                      setUploadableAvatarLocal(null);
                    }}
                  >
                    {t('profile.form.avatar.remove')}
                  </Button>

                  <Button
                    colorScheme="green"
                    isDisabled={isUploading}
                    isLoading={isUploading}
                    size="sm"
                    variant="solid"
                    onClick={() => uploadAvatar()}
                  >
                    {tc('actions.submit')}
                  </Button>
                </HStack>
              )}
            </Box>
          </Center>

          <Box p="4" mb="12" textAlign="center">
            <Heading size="md" mb="2" textAlign="center">
              {t('profile.makePublic.label')}
            </Heading>
            <FormField helperText={t('profile.makePublic.helperText')}>
              <Switch
                colorScheme="green"
                isChecked={currentUser.isPublic}
                size="lg"
                onChange={({ target: { checked } }) => setProfilePublic(checked)}
              />
            </FormField>
          </Box>

          <Box bg="white" p="4">
            <Box>
              <Heading mb="2" size="md" textAlign="center">
                {t('profile.label')}
              </Heading>
              <ProfileForm defaultValues={currentUser} onSubmit={handleSubmit} />
            </Box>
          </Box>
        </Box>

        <Center>
          <VStack spacing="4" mt="4" p="4">
            <Button colorScheme="red" size="sm" onClick={() => setIsDeleteModalOn(true)}>
              {t('delete.action')}
            </Button>
          </VStack>
        </Center>

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
      </Template>
    </Box>
  );
}

export default Profile;
