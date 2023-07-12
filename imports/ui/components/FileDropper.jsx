import React from 'react';
import Dropzone from 'react-dropzone';
import { Box, Center, Image, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const containerStyle = {
  borderWidth: 1,
  borderStyle: 'dashed',
  cursor: 'pointer',
  width: '100%',
};

function FileDropper({
  height = '100%',
  imageFit = 'contain',
  imageUrl,
  label,
  round = false,
  uploadableImageLocal,
  setUploadableImage,
  isMultiple = false,
  ...otherProps
}) {
  if (round) {
    containerStyle.borderRadius = '50%';
    containerStyle.overflow = 'hidden';
  } else {
    containerStyle.borderRadius = '4px';
  }

  const [tc] = useTranslation('common');
  return (
    <Dropzone onDrop={setUploadableImage}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <Box
          {...getRootProps()}
          bg={isDragActive ? 'gray.300' : 'white'}
          h={height}
          style={containerStyle}
          // w="xs"
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
              <Text textAlign="center" fontSize="sm">
                {isMultiple
                  ? tc('plugins.fileDropper.helperMultiple')
                  : tc('plugins.fileDropper.helper')}
              </Text>
            </Center>
          )}
          <input {...getInputProps()} />
        </Box>
      )}
    </Dropzone>
  );
}

export default FileDropper;
