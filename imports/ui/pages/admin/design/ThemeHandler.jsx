import React, { useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { useAtom } from 'jotai';

import {
  Box,
  Button,
  Center,
  Flex,
  Loader,
  RadioGroup,
  Radio,
  Text,
} from '/imports/ui/core';
import Menu from '/imports/ui/generic/Menu';
import { currentHostAtom } from '../../../../state';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import Boxling, { BoxlingColumn } from '/imports/ui/pages/admin/Boxling';
import {
  borderRadiusOptions,
  themeOptions,
  getCustomTheme,
  getGrayTheme,
} from '/imports/ui/pages/admin/design/styleOptions';
import { updateHostSettings } from '/imports/actions';

import HuePicker from './HuePicker';
import BackgroundHandler from './BackgroundHandler';
import FontSelector from './FontSelector';

export default function ThemeHandler() {
  const [currentHost, setCurrentHost] = useAtom(currentHostAtom);

  const [state, setState] = useState({
    updating: false,
    uploadingBackgroundImage: false,
    hasChanges: false,
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
      theme: { ...newTheme },
    }));
  };

  const handleStyleChange = (key, value) => {
    setCurrentHost((prevState) => {
      const newTheme = {
        ...prevState?.theme,
        body: {
          ...prevState?.theme?.body,
          [key]: value,
        },
      };

      return {
        ...prevState,
        theme: { ...newTheme },
      };
    });
  };

  const updateHostTheme = async (uploadedImage = null) => {
    if (!currentHost?.theme) {
      return;
    }

    const newTheme = {
      ...currentHost.theme,
      body: {
        ...currentHost.theme.body,
        backgroundImage: uploadedImage,
      },
    };
    try {
      await call('updateHostTheme', newTheme);
      setCurrentHost(await call('getCurrentHost'));
      message.success(<Trans i18nKey="common:message.success.update" />);
    } catch (error) {
      message.error(error.error || error.reason);
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
      updating: true,
      uploadingBackgroundImage: true,
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

      <Boxling mb="12">
        <RadioGroup
          options={themeOptions}
          value={currentTheme?.variant}
          onChange={handleThemeChange}
        />
      </Boxling>

      <Text fontWeight="bold" mb="4">
        <Trans i18nKey="admin:design.theme.demo" />
      </Text>

      <Box mb="8" mt="4">
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
      </Box>

      <FontSelector
        currentTheme={currentTheme}
        handleStyleChange={handleStyleChange}
        selectedFont={currentTheme.body.fontFamily}
      />

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

      {/* {currentTheme?.variant === 'custom' && ( */}
      <BackgroundHandler
        uploadPing={state.uploadingBackgroundImage}
        onStyleChange={handleStyleChange}
        onUploadFinish={updateHostTheme}
      />
      {/* )} */}

      <Flex justify="flex-end" mb="12">
        <Button loading={state.updating} onClick={confirmUpdate}>
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
