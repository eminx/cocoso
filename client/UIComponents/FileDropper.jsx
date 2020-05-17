import React from 'react';
import Dropzone from 'react-dropzone';
import { Box, Button, Image } from 'grommet';

function FileDropper({ setUploadableImages, uploadableImageLocal, imageUrl }) {
  const isImage = uploadableImageLocal || imageUrl;

  let imageSet;
  if (typeof isImage === 'string') {
    imageSet = [isImage];
  } else if (typeof isImage === 'object') {
    imageSet = isImage;
  }

  console.log(imageSet);

  return (
    <Dropzone onDrop={setUploadableImages}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <Box
          {...getRootProps()}
          background="light-2"
          round="8px"
          width="large"
          height="medium"
        >
          {imageSet ? (
            <Box>
              {imageSet.map(image => (
                <Box width="large" height="medium">
                  <Image
                    fit="contain"
                    fill
                    src={image}
                    style={{ cursor: 'pointer' }}
                  />
                </Box>
              ))}
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
