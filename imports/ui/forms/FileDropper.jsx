import React from 'react';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import { Center, Flex, Image, Text } from '/imports/ui/core';

const containerStyle = {
  borderRadius: 'var(--cocoso-border-radius)',
  border: '2px dashed',
  cursor: 'grab',
  '&:hover': {
    bg: 'var(--cocoso-colors-gray-50)',
    borderColor: 'var(--cocoso-colors-theme-300)',
  },
};

export default function FileDropper({
  height = '280px',
  imageFit = 'contain',
  imageUrl,
  round = false,
  uploadableImageLocal,
  setUploadableImage,
  isMultiple = false,
  ...otherProps
}) {
  if (round) {
    containerStyle.borderRadius = '50%';
    containerStyle.overflow = 'hidden';
  }

  const [tc] = useTranslation('common');
  return (
    <Dropzone onDrop={setUploadableImage} isMultiple={isMultiple}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <Flex
          {...getRootProps()}
          align="center"
          bg={isDragActive ? 'gray.300' : 'white'}
          direction="column"
          justify="center"
          h={height}
          w="100%"
          css={{
            ...containerStyle,
            borderColor: isDragActive
              ? 'var(--cocoso-colors-theme-500)'
              : 'var(--cocoso-colors-theme-200)',
          }}
          {...otherProps}
        >
          {uploadableImageLocal || imageUrl ? (
            <Image
              fit={imageFit}
              width="100%"
              height="100%"
              src={uploadableImageLocal || imageUrl}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <Center p="8">
              <Text fontSize="sm" css={{ textAlign: 'center' }}>
                {isMultiple
                  ? tc('plugins.fileDropper.helperMultiple')
                  : tc('plugins.fileDropper.helper')}
              </Text>
            </Center>
          )}
          <input {...getInputProps()} />
        </Flex>
      )}
    </Dropzone>
  );
}
