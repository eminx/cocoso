import React, { useContext, useState } from 'react';
import { Trans } from 'react-i18next';

import { Box, Button, Center, Flex, Text } from '/imports/ui/core';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/ui/utils/shared';
import { StateContext } from '/imports/ui/LayoutContainer';
import Boxling from '/imports/ui/pages/admin/Boxling';
import GenericColorPicker from '/imports/ui/generic/GenericColorPicker';
import Menu from '/imports/ui/generic/Menu';
import { BoxlingColumn } from '/imports/ui/pages/admin/Boxling';
import {
  borderRadiusOptions,
  borderStyleOptions,
  borderWidthOptions,
  fontStyleOptions,
  textTransformOptions,
} from './styleOptions';

const demoMenuItems = [
  {
    name: 'Home',
  },
  {
    name: 'Program',
  },
  {
    name: 'Calendar',
  },
];

export default function MenuDesign() {
  const { currentHost, getCurrentHost } = useContext(StateContext);
  const [state, setState] = useState({
    style: currentHost?.style || {
      menu: {
        backgroundColor: '#faf7f5',
        color: '#58504b',
        fontStyle: 'normal',
        fontWeight: 'normal',
        textTransform: 'none',
      },
    },
  });

  const handleTextColorChange = (color) => {
    setState((prevState) => ({
      ...prevState,
      style: {
        ...prevState.style,
        menu: {
          ...prevState.style.menu,
          color: color.hex,
        },
      },
    }));
  };

  const handleSelectFontStyle = (item) => {
    setState((prevState) => ({
      ...prevState,
      style: {
        ...prevState.style,
        menu: {
          ...prevState.style.menu,
          fontStyle: item.value,
        },
      },
    }));
  };

  const resetTextColor = () => {
    setState((prevState) => ({
      ...prevState,
      style: {
        ...prevState.style,
        menu: {
          ...prevState.style.menu,
          color: 'gray.600',
        },
      },
    }));
  };

  const updateHostStyle = async () => {
    const newStyle = {
      ...state.style,
    };

    try {
      await call('updateHostStyle', newStyle);
      await getCurrentHost();
      message.success('Background saved');
    } catch (error) {
      message.error(error.error || error.reason);
    }
  };

  const handleStyleChange = (key, value) => {
    console.log('key', key);
    setState((prevState) => ({
      ...prevState,
      style: {
        ...prevState.style,
        menu: {
          ...prevState.style.menu,
          [key]: value,
        },
      },
    }));
  };

  const { style } = state;

  const fontStyle = fontStyleOptions.find(
    (option) => option.value === style?.menu?.fontStyle
  )?.label;
  const textTransform = textTransformOptions.find(
    (option) => option.value === style?.menu?.textTransform
  )?.label;

  const menuStyle = {
    backgroundColor: style?.menu?.backgroundColor || 'gray.50',
    borderColor: style?.menu?.borderColor || 'gray.300',
    borderRadius: style?.menu?.borderRadius || '6px',
    borderStyle: style?.menu?.borderStyle || 'solid',
    borderWidth: style?.menu?.borderWidth || '1px',
    color: style?.menu?.color || 'gray.600',
    fontStyle: style?.menu?.fontStyle || 'normal',
    textTransform: style?.menu?.textTransform || 'none',
  };

  const {
    backgroundColor,
    borderColor,
    borderRadius,
    borderStyle,
    borderWidth,
    color,
  } = menuStyle;

  return (
    <>
      <Text fontWeight="bold" mb="4" mt="6">
        Demo
      </Text>
      <Box mb="8" w="100%">
        <Flex
          css={{
            alignItems: 'center',
            backgroundColor,
            color,
            fontStyle,
            justifyContent: 'center',
            padding: '0.5rem',
            ...menuStyle,
          }}
          textTransform={textTransform}
        >
          {demoMenuItems?.map((item) => (
            <Box key={item.name} as="span" px="2">
              <Text
                css={{
                  borderBottom: '1px solid transparent',
                  ':hover': {
                    borderBottom: '1px solid',
                    cursor: 'pointer',
                  },
                }}
              >
                {item.name}
              </Text>
            </Box>
          ))}
        </Flex>
      </Box>

      <Text fontWeight="bold" mb="4">
        Colors
      </Text>
      <Boxling mb="8" w="100%">
        <Flex justify="space-around">
          <Center>
            <BoxlingColumn title="Background color">
              <GenericColorPicker
                color={backgroundColor}
                onChange={(selectedItem) =>
                  handleStyleChange('backgroundColor', selectedItem.hex)
                }
              />

              <Button
                bg="white"
                size="xs"
                variant="ghost"
                onClick={() =>
                  handleStyleChange('backgroundColor', '#faf7f5')
                }
              >
                Reset
              </Button>
            </BoxlingColumn>
          </Center>

          <Center>
            <BoxlingColumn title="Text color">
              <GenericColorPicker
                color={color}
                onChange={(selectedItem) =>
                  handleStyleChange('color', selectedItem.hex)
                }
              />

              <Button
                bg="white"
                size="xs"
                variant="ghost"
                onClick={() => handleStyleChange('color', 'gray.600')}
              >
                Reset
              </Button>
            </BoxlingColumn>
          </Center>
        </Flex>
      </Boxling>

      <Text fontWeight="bold" mb="4">
        Text
      </Text>
      <Boxling mb="8" w="100%">
        <Flex justify="space-around">
          <Center>
            <BoxlingColumn title="Font Style">
              <Menu
                buttonLabel={fontStyle}
                options={fontStyleOptions}
                onSelect={(selectedItem) =>
                  handleStyleChange('fontStyle', selectedItem.value)
                }
              >
                {(item) => item.label}
              </Menu>
            </BoxlingColumn>
          </Center>

          <Center>
            <BoxlingColumn title="Text Transform">
              <Menu
                buttonLabel={textTransform}
                options={textTransformOptions}
                onSelect={(selectedItem) =>
                  handleStyleChange('textTransform', selectedItem.value)
                }
              >
                {(item) => item.label}
              </Menu>
            </BoxlingColumn>
          </Center>
        </Flex>
      </Boxling>

      <Text fontWeight="bold" mb="4">
        Border
      </Text>
      <Boxling mb="8" w="100%">
        <Flex justify="space-around">
          <Center>
            <BoxlingColumn title="Border Color">
              <GenericColorPicker
                color={borderColor}
                onChange={(selectedItem) =>
                  handleStyleChange('borderColor', selectedItem.hex)
                }
              />
            </BoxlingColumn>
          </Center>

          <Center>
            <BoxlingColumn title="Border Radius">
              <Menu
                buttonLabel={borderRadius}
                options={borderRadiusOptions}
                onSelect={(selectedItem) =>
                  handleStyleChange('borderRadius', selectedItem.value)
                }
              >
                {(item) => item.label}
              </Menu>
            </BoxlingColumn>
          </Center>

          <Center>
            <BoxlingColumn title="Border Style">
              <Menu
                buttonLabel={borderStyle}
                options={borderStyleOptions}
                onSelect={(selectedItem) =>
                  handleStyleChange('borderStyle', selectedItem.value)
                }
              >
                {(item) => item.label}
              </Menu>
            </BoxlingColumn>
          </Center>

          <Center>
            <BoxlingColumn title="Border Width">
              <Menu
                buttonLabel={borderWidth}
                options={borderWidthOptions}
                onSelect={(selectedItem) =>
                  handleStyleChange('borderWidth', selectedItem.value)
                }
              >
                {(item) => item.label}
              </Menu>
            </BoxlingColumn>
          </Center>
        </Flex>
      </Boxling>

      <Flex justify="flex-end" mb="12">
        <Button mt="2" onClick={updateHostStyle}>
          <Trans i18nKey="common:actions.submit" />
        </Button>
      </Flex>
    </>
  );
}
