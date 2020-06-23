import React from 'react';
import Dropzone from 'react-dropzone';
import { Box, Button, Image, Text } from 'grommet';

const FileDropper = ({
  setUploadableImage,
  uploadableImageLocal,
  imageUrl,
  label,
  ...otherProps
}) => {
  return (
    <Dropzone onDrop={setUploadableImage}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <Box
          {...getRootProps()}
          background={isDragActive ? 'dark-3' : 'white'}
          width="medium"
          height="small"
          border={{ style: 'dashed', size: 'medium' }}
          {...otherProps}
        >
          {uploadableImageLocal || imageUrl ? (
            <Image
              fit="contain"
              fill
              src={uploadableImageLocal || imageUrl}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <Box alignSelf="center" pad="medium">
              <Button
                plain
                hoverIndicator="light-1"
                label={
                  <Box alignSelf="center">
                    <Text size="xsmall" textAlign="center">
                      {label ||
                        'Drop an image or images; or alternatively click to open the file picker'}
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
