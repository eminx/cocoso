import React, { useContext, useState, useEffect } from 'react';
import { Trans } from 'react-i18next';

import { Box, Button, Center, Flex, Text } from '/imports/ui/core';
import { RadioGroup, Radio } from '/imports/ui/core';
import Menu from '/imports/ui/generic/Menu';
import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import Boxling, { BoxlingColumn } from '/imports/ui/pages/admin/Boxling';
import {
  borderRadiusOptions,
  themeOptions,
  getCustomTheme,
  getGrayTheme,
} from '/imports/ui/pages/admin/design/styleOptions';

import HuePicker from './HuePicker';
import BackgroundHandler from './BackgroundHandler';
import Loader from '../../../core/Loader';

export default function ThemeHandler() {
  const { currentHost, getCurrentHost, setCurrentHost } =
    useContext(StateContext);

  const [state, setState] = useState({
    uploadingBackgroundImage: false,
    updating: false,
  });

  const currentTheme = currentHost?.theme;

  const currentBorderRadius = borderRadiusOptions?.find(
    (option) => option?.value === currentTheme?.body?.borderRadius
  );

  const handleThemeChange = (selectedValue) => {
    const newTheme =
      selectedValue === 'custom'
        ? getCustomTheme(currentTheme)
        : selectedValue === 'gray'
        ? getGrayTheme(currentTheme)
        : null;

    if (!newTheme) {
      message.error(<Trans i18nKey="admin:design.message.error" />);
      return;
    }

    setCurrentHost((prevState) => ({
      ...prevState,
      theme: newTheme,
    }));
  };

  const handleStyleChange = (key, value) => {
    if (currentHost?.theme?.body?.[key] === value) {
      return;
    }
    setCurrentHost((prevState) => ({
      ...prevState,
      theme: {
        ...prevState?.theme,
        body: {
          ...prevState?.theme?.body,
          [key]: value,
        },
      },
    }));
  };

  const updateHostTheme = async () => {
    if (!currentHost?.theme) {
      return;
    }

    const newTheme = {
      ...currentHost.theme,
    };

    console.log('updatehost trigger back');

    try {
      await call('updateHostTheme', newTheme);
      await getCurrentHost();
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
        uploadingBackgroundImage: false,
      }));
    }
  };

  const confirmUpdate = () => {
    setState((prevState) => ({
      ...prevState,
      uploadingBackgroundImage: true,
      updating: true,
    }));
  };

  const handleHueChange = (hue) => {
    setState((prevState) => ({
      ...prevState,
      hasChanges: true,
    }));
  };

  if (!currentHost) {
    return <Loader />;
  }

  return (
    <>
      <Box py="4">
        <Text size="lg" css={{ fontWeight: '300' }}>
          <Trans i18nKey="admin:design.color.description" />
        </Text>
      </Box>

      <Box mb="12">
        <RadioGroup
          value={currentTheme?.variant}
          onChange={(selectedValue) => handleThemeChange(selectedValue)}
        >
          {themeOptions.map((option) => (
            <Radio key={option.value} value={option.value}>
              <Trans i18nKey={`admin:design.theme.options.${option.value}`} />
            </Radio>
          ))}
        </RadioGroup>
      </Box>

      <Text fontWeight="bold" mb="4">
        <Trans i18nKey="admin:design.theme.demo" />
      </Text>

      <Boxling mb="8" mt="4">
        <Flex align="center" justify="center">
          <Button size="lg">
            <Trans i18nKey="admin:design.theme.button" />
          </Button>
          <Button variant="outline">
            <Trans i18nKey="admin:design.theme.button" />
          </Button>
          <Button variant="ghost">
            <Trans i18nKey="admin:design.theme.button" />
          </Button>
        </Flex>
      </Boxling>

      {currentTheme?.variant === 'custom' && (
        <>
          <Text fontWeight="bold">
            <Trans i18nKey="admin:design.theme.color" />
          </Text>
          <Boxling mb="8" mt="4">
            <HuePicker onChange={handleHueChange} />
          </Boxling>
        </>
      )}

      <Text fontWeight="bold" mb="4">
        <Trans i18nKey="admin:design.border.title" />
      </Text>

      <Boxling mb="8" mt="4">
        <Center>
          <BoxlingColumn title={<Trans i18nKey="admin:design.border.radius" />}>
            <Menu
              buttonLabel={
                <Trans
                  i18nKey={`admin:design.border.radiusOptions.${currentBorderRadius?.label}`}
                />
              }
              options={borderRadiusOptions}
              onSelect={(selectedOption) =>
                handleStyleChange('borderRadius', selectedOption?.value)
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
      </Boxling>

      {currentTheme?.variant === 'custom' && (
        <BackgroundHandler
          uploadPing={state.uploadingBackgroundImage}
          onStyleChange={handleStyleChange}
          onUploadFinish={updateHostTheme}
        />
      )}

      <Flex justify="flex-end" mb="12">
        <Button
          // disabled={!state.hasChanges}
          loading={state.updating}
          onClick={confirmUpdate}
        >
          <Trans i18nKey="common:actions.submit" />
        </Button>
      </Flex>

      <Box bg="red.100" p="4" my="8">
        <Text mb="2">
          <Trans i18nKey="admin:design.color.alert1" />
        </Text>{' '}
        <Text>
          <Trans i18nKey="admin:design.color.alert2" />
        </Text>
      </Box>
    </>
  );
}
