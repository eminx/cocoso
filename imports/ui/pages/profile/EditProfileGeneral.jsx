import React, { useState } from 'react';
import { useAtomValue } from 'jotai';
import { Trans, useTranslation } from 'react-i18next';

import { currentUserAtom } from '/imports/state';
import { Box, Heading } from '/imports/ui/core';
import AvatarUploader from '/imports/ui/pages/profile/AvatarUploader';
import Boxling from '/imports/ui/pages/admin/Boxling';
import { call, resizeImage, uploadImage } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';

import ProfileForm from './ProfileForm';
import KeywordsManager from './KeywordsManager';

export default function EditProfileGeneral() {
  const currentUser = useAtomValue(currentUserAtom);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadableAvatarLocal, setUploadableAvatarLocal] = useState(null);
  const [uploadableAvatar, setUploadableAvatar] = useState(null);
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');

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

  return (
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
  );
}
