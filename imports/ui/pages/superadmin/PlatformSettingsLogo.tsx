import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';

import { Box, Button, Center, Text } from '/imports/ui/core';
import { Platform } from '/imports/ui/types';
import { platformAtom } from '/imports/state';
import { message } from '/imports/ui/generic/message';
import { call, resizeImage, uploadImage } from '/imports/api/_utils/shared';
import FileDropper from '/imports/ui/forms/FileDropper';

export function PlatformSettingsLogo() {
  const [platform, setPlatform] = useAtom(platformAtom);
  const [uploading, setUploading] = useState(false);
  const [localImage, setLocalImage] = useState(null);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const setUploadableImage = (files: File[]) => {
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
      const uploadedImage = await uploadImage(
        resizedImage,
        'platformLogoUpload'
      );
      await call('updatePlatformSettings', { logo: uploadedImage });
      const respond = (await call('getPlatform')) as Platform;
      setPlatform(respond);
      message.success(t('logo.message.success'));
    } catch (error: any) {
      console.error('Error uploading:', error);
      message.error(error.reason);
    } finally {
      setUploading(false);
    }
  };

  const isImage = localImage?.uploadableImageLocal;

  return (
    <>
      <Text fontWeight="bold">{t('logo.info')}</Text>
      <Box>
        <FileDropper
          uploadableImageLocal={localImage && localImage.uploadableImageLocal}
          imageUrl={platform?.logo}
          setUploadableImage={setUploadableImage}
          width={isImage && '120px'}
          height={isImage && '80px'}
        />
      </Box>
      {localImage && localImage.uploadableImageLocal && (
        <Center p="2">
          <Button loading={uploading} onClick={() => uploadLogo()}>
            {tc('actions.submit')}
          </Button>
        </Center>
      )}
    </>
  );
}
