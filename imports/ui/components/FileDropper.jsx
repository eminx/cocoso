import React from 'react';
import Dropzone from 'react-dropzone';
import { Box, Center, Image, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const containerStyle = {
  borderRadius: 0,
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
  }

  const [tc] = useTranslation('common');
  return (
    <Dropzone onDrop={setUploadableImage}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <Box
          {...getRootProps()}
          bg={isDragActive ? 'gray.300' : 'gray.100'}
          border="1px dashed"
          borderColor="brand.500"
          borderRadius="0px"
          cursor="grab"
          h={height}
          w="100%"
          {...containerStyle}
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
