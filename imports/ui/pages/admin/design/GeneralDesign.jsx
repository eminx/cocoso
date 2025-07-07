import React, { useContext, useState } from 'react';
import { Box, Button, Center, Flex, Text } from '@chakra-ui/react';
import { ChromePicker } from 'react-color';
import { Trans } from 'react-i18next';

import Boxling from '/imports/ui/pages/admin/Boxling';
import ImageUploader from '/imports/ui/forms/ImageUploader';
import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import GenericColorPicker from '/imports/ui/generic/GenericColorPicker';

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

  const confirmBackground = () => {
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
    setTimeout(() => {
      window.location.reload();
    }, 1200);
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
        <Flex justify="space-between">
          <Box px="6" w="50%">
            <Text fontWeight="bold" mb="4">
              Background color
            </Text>
          </Box>
          <Box px="6" w="50%">
            <Text fontWeight="bold" mb="4">
              Background image
            </Text>
          </Box>
        </Flex>
        <Boxling backgroundColor={backgroundColor} mb="2" w="100%">
          <Flex justify="space-between">
            <Box>
              <Center>
                <GenericColorPicker
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
            </Box>
            <Box>
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
            </Box>
          </Flex>
        </Boxling>

        <Flex justify="flex-end">
          <Button
            isLoading={uploadingBackgroundImage}
            mt="2"
            onClick={confirmBackground}
          >
            <Trans i18nKey="common:actions.submit" />
          </Button>
        </Flex>
      </Box>
    </>
  );
}
