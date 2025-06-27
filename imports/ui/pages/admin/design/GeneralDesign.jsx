import React, { useContext, useState } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { ChromePicker } from 'react-color';

import Boxling from '/imports/ui/pages/admin/Boxling';
import ImageUploader from '/imports/ui/forms/ImageUploader';
import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';

export default function GeneralDesign() {
  const { currentHost } = useContext(StateContext);
  const settings = currentHost?.settings;
  const [state, setState] = useState({
    backgroundColor: settings?.backgroundColor || '#000000',
    backgroundImage: settings?.backgroundImage || null,
    uploadingBackgroundImage: false,
  });

  const handleBackgroundColorChange = (color) => {
    setState((prevState) => ({
      ...prevState,
      backgroundColor: color.hex,
    }));
  };

  const handleUploadedBackgroundImage = (images) => {
    setState((prevState) => ({
      ...prevState,
      backgroundImage: images[0],
    }));
    saveBackground(images[0]);
  };

  const confirmBackground = async () => {
    setState((prevState) => ({
      ...prevState,
      uploadingBackgroundImage: true,
    }));
  };

  const saveBackground = async (backgroundImage) => {
    const { backgroundColor } = state;

    try {
      await call('updateHostSettings', {
        backgroundColor,
        backgroundImage,
      });
      message.success('Background saved');
    } catch (error) {
      console.log(error);
    }
  };

  const { backgroundColor, backgroundImage, uploadingBackgroundImage } =
    state;

  return (
    <>
      <Box mb="4" mt="6">
        <Text fontWeight="bold" mb="4" textAlign="center">
          Background
        </Text>

        <Boxling bg={backgroundColor}>
          <Flex justify="space-between">
            <Box>
              <Text mb="2">Color:</Text>
              <ChromePicker
                color={backgroundColor}
                onChange={handleBackgroundColorChange}
              />
            </Box>

            <Box maxW="250px">
              <Text mb="2">Image:</Text>
              <ImageUploader
                isMultiple={false}
                ping={uploadingBackgroundImage}
                preExistingImages={[backgroundImage] || []}
                onUploadedImages={handleUploadedBackgroundImage}
              />
            </Box>
          </Flex>

          <Button mt="2" onClick={confirmBackground}>
            Confirm
          </Button>
        </Boxling>
      </Box>
    </>
  );
}
