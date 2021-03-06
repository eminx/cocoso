import React from 'react';
import Dropzone from 'react-dropzone';
import { Box, Button, Image, Text } from 'grommet';

const FileDropper = ({
  setUploadableImage,
  uploadableImageLocal,
  imageUrl,
  label,
  round = false,
  ...otherProps
}) => {
  return (
    <Dropzone onDrop={setUploadableImage}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <Box
          {...getRootProps()}
          background={isDragActive ? 'dark-3' : 'dark-1'}
          border={{ size: 'xsmall' }}
          elevation="medium"
          height="small"
          style={round ? { borderRadius: '50%', overflow: 'hidden' } : null}
          width="medium"
          {...otherProps}
        >
          {uploadableImageLocal || imageUrl ? (
            <Image
              fit="cover"
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
