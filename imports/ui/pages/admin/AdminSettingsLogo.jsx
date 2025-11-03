import React, { useState } from 'react';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';

import FileDropper from '/imports/ui/forms/FileDropper';
import { currentHostAtom } from '/imports/state';
import { Button, Center, Text } from '/imports/ui/core';
import { message } from '/imports/ui/generic/message';
import { call, resizeImage, uploadImage } from '/imports/ui/utils/shared';

import Boxling from './Boxling';

export default function AdminSettingsLogo() {
  const currentHost = useAtomValue(currentHostAtom);
  const [uploading, setUploading] = useState(false);
  const [localImage, setLocalImage] = useState(null);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const setUploadableImage = (files) => {
    if (files.length > 1) {
      message.error(t('logo.message.fileDropper'));
      return;
    }
    const uploadableImage = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadableImage);
    reader.addEventListener(
      'load',
      () => {
        setLocalImage({
          uploadableImage,
          uploadableImageLocal: reader.result,
        });
      },
      false
    );
  };

  const uploadLogo = async () => {
    setUploading(true);
    try {
      const resizedImage = await resizeImage(localImage.uploadableImage, 800);
      const uploadedImage = await uploadImage(resizedImage, 'hostLogoUpload');
      await call('assignHostLogo', uploadedImage);
      setCurrentHost(await call('getCurrentHost'));
      message.success(t('logo.message.success'));
    } catch (error) {
      message.error(error.reason);
    } finally {
      setUploading(false);
    }
  };

  const isImage =
    (localImage && localImage.uploadableImageLocal) ||
    (currentHost && currentHost.logo);

  return (
    <>
      <Center>
        <Text fontWeight="bold" mb="4" textAlign="center">
          {t('logo.info')}
        </Text>
      </Center>

      <Boxling>
        <Center>
          <FileDropper
            imageUrl={currentHost && currentHost.logo}
            height={isImage && '120px'}
            width={isImage && '280px'}
            round={false}
            setUploadableImage={setUploadableImage}
            uploadableImageLocal={localImage && localImage.uploadableImageLocal}
          />
        </Center>
        {localImage && localImage.uploadableImageLocal && (
          <Center p="4">
            <Button loading={uploading} onClick={() => uploadLogo()}>
              {tc('actions.submit')}
            </Button>
          </Center>
        )}
      </Boxling>
    </>
  );
}
