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

const defaultMenuStyle = {
  backgroundColor: '#faf7f5',
  color: '#58504b',
  fontStyle: 'normal',
  fontWeight: 'normal',
  textTransform: 'none',
};

export default function MenuDesign() {
  const { currentHost, getCurrentHost } = useContext(StateContext);
  const [state, setState] = useState({
    theme: currentHost?.theme || {
      menu: defaultMenuStyle,
    },
  });

  const updateHostTheme = async () => {
    const newTheme = {
      ...state.theme,
    };

    try {
      await call('updateHostTheme', newTheme);
      await getCurrentHost();
      message.success('Menu saved');
    } catch (error) {
      message.error(error.error || error.reason);
    }
  };

  const handleStyleChange = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      theme: {
        ...prevState.theme,
        menu: {
          ...prevState.theme.menu,
          [key]: value,
        },
      },
    }));
  };

  const { theme } = state;

  const fontStyle = fontStyleOptions.find(
    (option) => option.value === theme?.menu?.fontStyle
  )?.label;
  const textTransform = textTransformOptions.find(
    (option) => option.value === theme?.menu?.textTransform
  )?.label;

  const menuStyle = {
    backgroundColor:
      theme?.menu?.backgroundColor || defaultMenuStyle.backgroundColor,
    borderColor:
      theme?.menu?.borderColor || defaultMenuStyle.borderColor,
    borderRadius:
      theme?.menu?.borderRadius || defaultMenuStyle.borderRadius,
    borderStyle:
      theme?.menu?.borderStyle || defaultMenuStyle.borderStyle,
    borderWidth:
      theme?.menu?.borderWidth || defaultMenuStyle.borderWidth,
    color: theme?.menu?.color || defaultMenuStyle.color,
    fontStyle: theme?.menu?.fontStyle || defaultMenuStyle.fontStyle,
    textTransform:
      theme?.menu?.textTransform || defaultMenuStyle.textTransform,
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
                onChange={(selectedOption) =>
                  handleStyleChange(
                    'backgroundColor',
                    selectedOption.hex
                  )
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
                onChange={(selectedOption) =>
                  handleStyleChange('color', selectedOption.hex)
                }
              />

              <Button
                bg="white"
                size="xs"
                variant="ghost"
                onClick={() =>
                  handleStyleChange('color', defaultMenuStyle.color)
                }
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
                onSelect={(selectedOption) =>
                  handleStyleChange('fontStyle', selectedOption.value)
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
                onSelect={(selectedOption) =>
                  handleStyleChange(
                    'textTransform',
                    selectedOption.value
                  )
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
                onChange={(selectedOption) =>
                  handleStyleChange('borderColor', selectedOption.hex)
                }
              />
            </BoxlingColumn>
          </Center>

          <Center>
            <BoxlingColumn title="Border Radius">
              <Menu
                buttonLabel={borderRadius}
                options={borderRadiusOptions}
                onSelect={(selectedOption) =>
                  handleStyleChange(
                    'borderRadius',
                    selectedOption.value
                  )
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
                onSelect={(selectedOption) =>
                  handleStyleChange('borderStyle', selectedOption.value)
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
                onSelect={(selectedOption) =>
                  handleStyleChange('borderWidth', selectedOption.value)
                }
              >
                {(item) => item.label}
              </Menu>
            </BoxlingColumn>
          </Center>
        </Flex>
      </Boxling>

      <Flex justify="flex-end" mb="12">
        <Button mt="2" onClick={updateHostTheme}>
          <Trans i18nKey="common:actions.submit" />
        </Button>
      </Flex>
    </>
  );
}
