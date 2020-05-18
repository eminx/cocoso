import React from 'react';
import Dropzone from 'react-dropzone';
import { Box, Button, Image, Text } from 'grommet';

const FileDropper = ({
  setUploadableImage,
  uploadableImageLocal,
  imageUrl
}) => {
  return (
    <Dropzone onDrop={setUploadableImage}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <Box
          {...getRootProps()}
          background={isDragActive ? 'dark-3' : 'light-2'}
          width="large"
          height="medium"
        >
          {uploadableImageLocal || imageUrl ? (
            <Image
              fit="contain"
              fill
              src={uploadableImageLocal || imageUrl}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <Box alignSelf="center" pad="large">
              <Button
                plain
                hoverIndicator="light-1"
                label={
                  <Box alignSelf="center">
                    <Text size="small" textAlign="center">
                      Drop an image or images; or alternatively click to open
                      the file picker
                    </Text>
                  </Box>
                }
              />
            </Box>
          )}
          <input {...getInputProps()} />
        </Box>
      )}
    </Dropzone>
  );
};

export default FileDropper;
