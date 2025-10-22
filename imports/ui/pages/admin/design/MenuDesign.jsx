import React, { useContext, useState } from 'react';
import { Trans } from 'react-i18next';
import { useAtom } from 'jotai';

import { Box, Button, Center, Flex, Text } from '/imports/ui/core';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/ui/utils/shared';
import { currentHostAtom } from '/imports/ui/LayoutContainer';
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
  const [currentHost, setCurrentHost] = useAtom(currentHostAtom);
  const [state, setState] = useState({
    theme: currentHost?.theme || {
      menu: defaultMenuStyle,
    },
    updating: false,
  });

  const updateHostTheme = async () => {
    const newTheme = {
      ...state.theme,
    };

    setState((prevState) => ({
      ...prevState,
      updating: true,
    }));

    try {
      await call('updateHostTheme', newTheme);
      setCurrentHost(await call('getCurrentHost'));
      message.success(<Trans i18nKey="admin:design.message.success" />);
    } catch (error) {
      message.error(
        error.error || error.reason || (
          <Trans i18nKey="admin:design.message.error" />
        )
      );
    } finally {
      setState((prevState) => ({
        ...prevState,
        updating: false,
      }));
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

  const fontStyle = theme?.menu?.fontStyle || defaultMenuStyle.fontStyle;
  const textTransform =
    theme?.menu?.textTransform || defaultMenuStyle.textTransform;

  const menuStyle = theme?.menu || defaultMenuStyle;

  const {
    backgroundColor,
    borderColor,
    borderRadius,
    borderStyle,
    borderWidth,
    color,
  } = menuStyle;

  const borderRadiusLabel =
    borderRadiusOptions.find((option) => option.value === borderRadius)
      ?.label || borderRadius;
  const borderWidthLabel =
    borderWidthOptions.find((option) => option.value === borderWidth)?.label ||
    borderWidth;

  return (
    <>
      <Box pt="4">
        <Text fontWeight="bold">Demo</Text>
      </Box>

      <Box mb="8" mt="4" w="100%">
        <Flex
          css={{
            alignItems: 'center',
            backgroundColor,
            color,
            fontStyle,
            justifyContent: 'center',
            padding: '0.5rem',
            textTransform,
            ...menuStyle,
          }}
        >
          {demoMenuItems?.map((item) => (
            <Box key={item.name} as="span" px="2">
              <Text
                css={{
                  borderBottom: '1px solid transparent',
                  color: menuStyle.color,
                  '&:hover': {
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

      <Box>
        <Text fontWeight="bold">
          <Trans i18nKey="admin:design.color.colors" />
        </Text>
      </Box>

      <Boxling mb="8" mt="4" w="100%">
        <Flex justify="space-around">
          <Center>
            <BoxlingColumn
              title={<Trans i18nKey="admin:design.background.color" />}
            >
              <GenericColorPicker
                color={backgroundColor}
                onChange={(selectedOption) =>
                  handleStyleChange('backgroundColor', selectedOption.hex)
                }
              />

              <Button
                size="xs"
                variant="ghost"
                onClick={() => handleStyleChange('backgroundColor', '#faf7f5')}
              >
                <Trans i18nKey="common:actions.reset" />
              </Button>
            </BoxlingColumn>
          </Center>

          <Center>
            <BoxlingColumn title={<Trans i18nKey="admin:design.color.text" />}>
              <GenericColorPicker
                color={color}
                onChange={(selectedOption) =>
                  handleStyleChange('color', selectedOption.hex)
                }
              />

              <Button
                size="xs"
                variant="ghost"
                onClick={() =>
                  handleStyleChange('color', defaultMenuStyle.color)
                }
              >
                <Trans i18nKey="common:actions.reset" />
              </Button>
            </BoxlingColumn>
          </Center>
        </Flex>
      </Boxling>

      <Box py="4">
        <Text fontWeight="bold">
          <Trans i18nKey="admin:design.text.title" />
        </Text>
      </Box>
      <Boxling mb="8" w="100%">
        <Flex justify="space-around">
          <Center>
            <BoxlingColumn
              title={<Trans i18nKey="admin:design.text.fontStyle" />}
            >
              <Menu
                buttonLabel={
                  <Trans
                    i18nKey={`admin:design.text.fontStyleOptions.${fontStyle}`}
                  />
                }
                options={fontStyleOptions}
                onSelect={(selectedOption) =>
                  handleStyleChange('fontStyle', selectedOption.value)
                }
              >
                {(item) => (
                  <Trans
                    i18nKey={`admin:design.text.fontStyleOptions.${item.value}`}
                  />
                )}
              </Menu>
            </BoxlingColumn>
          </Center>

          <Center>
            <BoxlingColumn
              title={<Trans i18nKey="admin:design.text.textTransform" />}
            >
              <Menu
                buttonLabel={
                  <Trans
                    i18nKey={`admin:design.text.textTransformOptions.${textTransform}`}
                  />
                }
                options={textTransformOptions}
                onSelect={(selectedOption) =>
                  handleStyleChange('textTransform', selectedOption.value)
                }
              >
                {(item) => (
                  <Trans
                    i18nKey={`admin:design.text.textTransformOptions.${item.value}`}
                  />
                )}
              </Menu>
            </BoxlingColumn>
          </Center>
        </Flex>
      </Boxling>

      <Box py="4">
        <Text fontWeight="bold">
          <Trans i18nKey="admin:design.border.title" />
        </Text>
      </Box>
      <Boxling mb="8" w="100%">
        <Flex justify="space-around">
          <Center>
            <BoxlingColumn
              title={<Trans i18nKey="admin:design.border.color" />}
            >
              <GenericColorPicker
                color={borderColor}
                onChange={(selectedOption) =>
                  handleStyleChange('borderColor', selectedOption.hex)
                }
              />
            </BoxlingColumn>
          </Center>

          <Center>
            <BoxlingColumn
              title={<Trans i18nKey="admin:design.border.radius" />}
            >
              <Menu
                buttonLabel={
                  <Trans
                    i18nKey={`admin:design.border.radiusOptions.${borderRadiusLabel}`}
                  />
                }
                options={borderRadiusOptions}
                onSelect={(selectedOption) =>
                  handleStyleChange('borderRadius', selectedOption.value)
                }
              >
                {(item) => (
                  <Trans
                    i18nKey={`admin:design.border.radiusOptions.${item.label}`}
                  />
                )}
              </Menu>
            </BoxlingColumn>
          </Center>

          <Center>
            <BoxlingColumn
              title={<Trans i18nKey="admin:design.border.style" />}
            >
              <Menu
                buttonLabel={
                  <Trans
                    i18nKey={`admin:design.border.styleOptions.${borderStyle}`}
                  />
                }
                options={borderStyleOptions}
                onSelect={(selectedOption) =>
                  handleStyleChange('borderStyle', selectedOption.value)
                }
              >
                {(item) => (
                  <Trans
                    i18nKey={`admin:design.border.styleOptions.${item.value}`}
                  />
                )}
              </Menu>
            </BoxlingColumn>
          </Center>

          <Center>
            <BoxlingColumn
              title={<Trans i18nKey="admin:design.border.width" />}
            >
              <Menu
                buttonLabel={
                  <Trans
                    i18nKey={`admin:design.border.widthOptions.${borderWidthLabel}`}
                  />
                }
                options={borderWidthOptions}
                onSelect={(selectedOption) =>
                  handleStyleChange('borderWidth', selectedOption.value)
                }
              >
                {(item) => (
                  <Trans
                    i18nKey={`admin:design.border.widthOptions.${item.label}`}
                  />
                )}
              </Menu>
            </BoxlingColumn>
          </Center>
        </Flex>
      </Boxling>

      <Flex justify="flex-end" mb="12">
        <Button loading={state.updating} mt="2" onClick={updateHostTheme}>
          <Trans i18nKey="common:actions.submit" />
        </Button>
      </Flex>
    </>
  );
}
