import React from 'react';
import Dropzone from 'react-dropzone';
import { Box, Button, Image } from 'grommet';

function FileDropper({ setUploadableImage, uploadableImageLocal, imageUrl }) {
  return (
    <Dropzone onDrop={setUploadableImage}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <Box
          {...getRootProps()}
          background="light-2"
          round="8px"
          width="large"
          height="medium"
        >
          {uploadableImageLocal || imageUrl ? (
            <Box width="large" height="medium">
              <Image
                fit="contain"
                fill
                src={uploadableImageLocal || imageUrl}
                style={{ cursor: 'pointer' }}
              />
            </Box>
          ) : (
            <Box alignSelf="center" pad="large">
              <Button
                plain
                hoverIndicator="light-1"
                label="Drop an image or click to open the file picker"
              />
            </Box>
          )}
          <input {...getInputProps()} />
        </Box>
      )}
    </Dropzone>
  );
}

export default FileDropper;
