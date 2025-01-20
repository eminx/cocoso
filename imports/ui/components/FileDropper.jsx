import React from 'react';
import Dropzone from 'react-dropzone';
import { Center, Flex, Image, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const containerStyle = {
  borderRadius: 0,
};

function FileDropper({
  height = '120px',
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
    <Dropzone onDrop={setUploadableImage} data-oid="helsli7">
      {({ getRootProps, getInputProps, isDragActive }) => (
        <Flex
          {...getRootProps()}
          _hover={{ bg: 'brand.50' }}
          align="center"
          bg={isDragActive ? 'gray.300' : 'white'}
          border="2px dashed"
          borderColor="brand.500"
          borderRadius="0px"
          cursor="grab"
          direction="column"
          justify="center"
          h={height}
          w="100%"
          {...containerStyle}
          {...otherProps}
          data-oid="br1j5ra"
        >
          {uploadableImageLocal || imageUrl ? (
            <Image
              fit={imageFit}
              width="100%"
              height="100%"
              src={uploadableImageLocal || imageUrl}
              style={{ cursor: 'pointer' }}
              data-oid="dkakz91"
            />
          ) : (
            <Center p="8" data-oid=":9jpif5">
              <Text textAlign="center" fontSize="sm" data-oid=":hga89h">
                {isMultiple
                  ? tc('plugins.fileDropper.helperMultiple')
                  : tc('plugins.fileDropper.helper')}
              </Text>
            </Center>
          )}
          <input {...getInputProps()} data-oid="a55qy99" />
        </Flex>
      )}
    </Dropzone>
  );
}

export default FileDropper;
