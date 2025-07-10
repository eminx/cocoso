import React, { useContext, useState } from 'react';
import { ChromePicker } from 'react-color';
import { Trans } from 'react-i18next';

import { Box, Button, Center, Flex, Text } from '/imports/ui/core';
import Boxling, {
  BoxlingColumn,
} from '/imports/ui/pages/admin/Boxling';
import ImageUploader from '/imports/ui/forms/ImageUploader';
import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import GenericColorPicker from '/imports/ui/generic/GenericColorPicker';
import ColorPicker from '/imports/ui/pages/admin/design/ColorPicker';
import Menu from '/imports/ui/generic/Menu';

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
      <Text fontWeight="bold" mb="4" mt="6">
        Background
      </Text>
      <Boxling mb="2" w="100%">
        <Flex justify="space-between">
          <BoxlingColumn title="Background color">
            <GenericColorPicker
              color={backgroundColor}
              onChange={handleBackgroundColorChange}
            />
            <Button
              bg="white"
              size="xs"
              variant="ghost"
              onClick={resetBackgroundColor}
            >
              Reset
            </Button>
          </BoxlingColumn>

          <BoxlingColumn title="Background image">
            <ImageUploader
              isMultiple={false}
              ping={uploadingBackgroundImage}
              preExistingImages={[backgroundImage] || []}
              onUploadedImages={handleUploadedBackgroundImage}
            />
            <Button
              bg="white"
              colorScheme="red"
              mt="2"
              size="xs"
              variant="ghost"
              onClick={removeBackgroundImage}
            >
              Remove
            </Button>
          </BoxlingColumn>
        </Flex>
      </Boxling>

      <Flex justify="flex-end" mb="12">
        <Button
          isLoading={uploadingBackgroundImage}
          mt="2"
          onClick={confirmBackground}
        >
          <Trans i18nKey="common:actions.submit" />
        </Button>
      </Flex>
    </>
  );
}
