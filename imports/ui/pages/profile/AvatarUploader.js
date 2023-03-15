import React from 'react';
import { Box, Button, Center, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import FileDropper from '../../components/FileDropper';

export default function AvatarUploader({
  imageUrl,
  isUploading,
  uploadableAvatarLocal,
  setUploadableAvatar,
  setUploadableAvatarLocal,
  uploadAvatar,
}) {
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');

  return (
    <Box w="120px" h="120px" mb="16">
      <FileDropper
        imageUrl={imageUrl}
        label={t('profile.form.avatar.fileDropper')}
        height="100%"
        imageFit="cover"
        round
        setUploadableImage={setUploadableAvatar}
      />
      {uploadableAvatarLocal && (
        <Center>
          <VStack spacing="2" p="4">
            <Button
              colorScheme="green"
              isLoading={isUploading}
              size="sm"
              variant="solid"
              onClick={() => uploadAvatar()}
            >
              {tc('actions.submit')}
            </Button>
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
          </VStack>
        </Center>
      )}

      {!uploadableAvatarLocal && (
        <Text fontSize="sm" textAlign="center" mt="2">
          {t('profile.form.avatar.changeHelper')}
        </Text>
      )}
    </Box>
  );
}
