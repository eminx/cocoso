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
import ColorPicker from '/imports/ui/pages/admin/design/ColorPicker';
import Menu from '/imports/ui/generic/Menu';
import {
  borderRadiusOptions,
  borderStyleOptions,
  borderWidthOptions,
} from './styleOptions';

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

  const handleBorderStyleChange = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      style: {
        ...prevState.style,
        elements: {
          ...prevState.style.elements,
          [key]: value,
        },
      },
    }));
  };

  const confirmBorderStyle = () => {
    updateHostStyle({ ...state.style });
  };

  const { style, uploadingBackgroundImage } = state;
  const backgroundImage = style?.body?.backgroundImage;
  const backgroundColor = style?.body?.backgroundColor;
  const borderColor = style?.elements?.borderColor;
  const borderRadius = style?.elements?.borderRadius;
  const borderStyle = style?.elements?.borderStyle;
  const borderWidth = style?.elements?.borderWidth;

  return (
    <>
      <Text fontWeight="bold" mb="4" mt="6">
        Background
      </Text>
      <Boxling mb="2" w="100%">
        <Flex justify="space-between">
          <Flex alignItems="center" flexDirection="column">
            <Text fontWeight="bold" mb="4">
              Background color
            </Text>
            <Box bg={backgroundColor} w="72px" h="24px" mb="4" />
            <GenericColorPicker
              color={backgroundColor}
              onChange={handleBackgroundColorChange}
            />
            <Button
              bg="white"
              size="xs"
              variant="ghost"
              mt="2"
              onClick={resetBackgroundColor}
            >
              Reset
            </Button>
          </Flex>

          <Center>
            <Flex alignItems="center" flexDirection="column">
              <Text fontWeight="bold" mb="4">
                Background image
              </Text>
              <ImageUploader
                isMultiple={false}
                ping={uploadingBackgroundImage}
                preExistingImages={[backgroundImage] || []}
                onUploadedImages={handleUploadedBackgroundImage}
              />
              <Button
                bg="white"
                colorScheme="red"
                my="4"
                size="xs"
                variant="ghost"
                onClick={removeBackgroundImage}
              >
                Remove
              </Button>
            </Flex>
          </Center>
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

      <Text fontWeight="bold" mb="4">
        UI Elements: Border
      </Text>

      <Boxling mb="8" w="100%">
        <Flex justify="space-around">
          <Center>
            <Flex alignItems="center" flexDirection="column">
              <Text fontWeight="bold" mb="2">
                Border Color
              </Text>
              <Box bg={borderColor} w="72px" h="24px" mb="4" />
              <GenericColorPicker
                color={borderColor}
                onChange={(selectedItem) =>
                  handleBorderStyleChange(
                    'borderColor',
                    selectedItem.hex
                  )
                }
              />
            </Flex>
          </Center>

          <Center>
            <Flex alignItems="center" flexDirection="column">
              <Text fontWeight="bold" mb="2">
                Border Radius
              </Text>
              <Menu
                buttonLabel={borderRadius}
                options={borderRadiusOptions}
                onSelect={(selectedItem) =>
                  handleBorderStyleChange(
                    'borderRadius',
                    selectedItem.value
                  )
                }
              >
                {(item) => item.label}
              </Menu>
            </Flex>
          </Center>

          <Center>
            <Flex alignItems="center" flexDirection="column">
              <Text fontWeight="bold" mb="2">
                Border Style
              </Text>
              <Menu
                buttonLabel={borderStyle}
                options={borderStyleOptions}
                onSelect={(selectedItem) =>
                  handleBorderStyleChange(
                    'borderStyle',
                    selectedItem.value
                  )
                }
              >
                {(item) => item.label}
              </Menu>
            </Flex>
          </Center>

          <Center>
            <Flex alignItems="center" flexDirection="column">
              <Text fontWeight="bold" mb="2">
                Border Width
              </Text>
              <Menu
                buttonLabel={borderWidth}
                options={borderWidthOptions}
                onSelect={(selectedItem) =>
                  handleBorderStyleChange(
                    'borderWidth',
                    selectedItem.value
                  )
                }
              >
                {(item) => item.label}
              </Menu>
            </Flex>
          </Center>
        </Flex>
      </Boxling>

      <Flex justify="flex-end" mb="12">
        <Button mt="2" onClick={confirmBorderStyle}>
          <Trans i18nKey="common:actions.submit" />
        </Button>
      </Flex>
    </>
  );
}
