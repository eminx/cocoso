import React, { useContext, useState } from 'react';
import { Box, Button, Center, Flex, Text } from '@chakra-ui/react';
import { ChromePicker } from 'react-color';

import Boxling from '/imports/ui/pages/admin/Boxling';
import ImageUploader from '/imports/ui/forms/ImageUploader';
import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';

export default function GeneralDesign() {
  const { currentHost, getCurrentHost } = useContext(StateContext);
  const [state, setState] = useState({
    style: currentHost?.style || {
      body: {
        backgroundColor: '#faf7f5',
        backgroundImage: null,
      },
    },
    uploadingBackgroundImage: false,
  });

  const handleBackgroundColorChange = (color) => {
    setState((prevState) => ({
      ...prevState,
      style: {
        ...prevState.style,
        body: {
          ...prevState.style.body,
          backgroundColor: color.hex,
        },
      },
    }));
  };

  const handleUploadedBackgroundImage = (images) => {
    const newStyle = {
      ...state.style,
      body: {
        ...state.style.body,
        backgroundImage: images[0],
      },
    };
    updateHostStyle(newStyle);
  };

  const confirmBackgroundColor = () => {
    updateHostStyle({ ...state.style });
  };

  const confirmBackgroundImage = () => {
    setState((prevState) => ({
      ...prevState,
      uploadingBackgroundImage: true,
    }));
  };

  const updateHostStyle = async (newStyle) => {
    try {
      await call('updateHostStyle', newStyle);
      await getCurrentHost();
      setState((prevState) => ({
        ...prevState,
        uploadingBackgroundImage: false,
      }));
      message.success('Background saved');
    } catch (error) {
      message.error(error.error || error.reason);
    }
  };

  const removeBackgroundImage = async () => {
    handleUploadedBackgroundImage([null]);
  };

  const resetBackgroundColor = () => {
    setState((prevState) => ({
      ...prevState,
      style: {
        ...prevState.style,
        body: {
          ...prevState.style.body,
          backgroundColor: '#f0ebe6',
        },
      },
    }));
  };

  const { style, uploadingBackgroundImage } = state;
  const backgroundImage = style?.body?.backgroundImage;
  const backgroundColor = style?.body?.backgroundColor;

  return (
    <>
      <Box mb="4" mt="6">
        <Text fontWeight="bold" mb="4">
          Background color
        </Text>
        <Boxling bg={backgroundColor} mb="2" w="100%">
          <Center>
            <ChromePicker
              color={backgroundColor}
              onChange={handleBackgroundColorChange}
            />
          </Center>

          <Center>
            <Button
              bg="white"
              size="xs"
              variant="ghost"
              mt="2"
              onClick={resetBackgroundColor}
            >
              Reset
            </Button>
          </Center>
        </Boxling>

        <Flex justify="flex-end">
          <Button mt="2" onClick={confirmBackgroundColor}>
            Confirm
          </Button>
        </Flex>
      </Box>

      <Box mb="4" mt="6">
        <Text fontWeight="bold" mb="4">
          Background image
        </Text>
        <Boxling mb="2">
          <ImageUploader
            isMultiple={false}
            ping={uploadingBackgroundImage}
            preExistingImages={[backgroundImage] || []}
            onUploadedImages={handleUploadedBackgroundImage}
          />
          <Center my="4">
            <Button
              bg="white"
              colorScheme="red"
              size="xs"
              variant="ghost"
              onClick={removeBackgroundImage}
            >
              Remove
            </Button>
          </Center>
        </Boxling>

        <Flex justify="flex-end">
          <Button
            mt="2"
            isLoading={uploadingBackgroundImage}
            onClick={confirmBackgroundImage}
          >
            Confirm
          </Button>
        </Flex>
      </Box>
    </>
  );
}
