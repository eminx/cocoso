import React from 'react';
import Dropzone from 'react-dropzone';
import { Box, Button, Center, Image, Text } from '@chakra-ui/react';

const FileDropper = ({
  height = '100%',
  imageFit = 'contain',
  imageUrl,
  label,
  round = false,
  uploadableImageLocal,
  setUploadableImage,
  ...otherProps
}) => {
  const containerStyle = {
    borderWidth: 1,
    borderStyle: 'dashed',
    cursor: 'pointer',
  };

  if (round) {
    containerStyle.borderRadius = '50%';
    containerStyle.overflow = 'hidden';
  }

  return (
    <Dropzone onDrop={setUploadableImage}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <Box
          {...getRootProps()}
          bg={isDragActive ? 'gray.300' : 'gray.100'}
          h={height}
          style={containerStyle}
          w="xs"
          {...otherProps}
        >
          {uploadableImageLocal || imageUrl ? (
            <Image
              fit={imageFit}
              width="100%"
              src={uploadableImageLocal || imageUrl}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <Center p="8">
              <Text textAlign="center" fontSize="sm">
                Drop an image or images; or alternatively click to open the file
                picker
              </Text>
            </Center>
          )}
          <input {...getInputProps()} />
        </Box>
      )}
    </Dropzone>
  );
};

export default FileDropper;
