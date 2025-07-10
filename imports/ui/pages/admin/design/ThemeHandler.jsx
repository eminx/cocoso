import React, { useContext, useState, useEffect } from 'react';
import { Trans } from 'react-i18next';

import { Box, Button, Center, Flex, Text } from '/imports/ui/core';
import { RadioGroup, Radio } from '/imports/ui/forms/RadioButtons';
import Menu from '/imports/ui/generic/Menu';
import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import Boxling, {
  BoxlingColumn,
} from '/imports/ui/pages/admin/Boxling';
import {
  borderRadiusOptions,
  themeOptions,
} from '/imports/ui/pages/admin/design/styleOptions';

import HuePicker from './HuePicker';
import BackgroundHandler from './BackgroundHandler';
import Loader from '/imports/ui/generic/Loader';

export default function ThemeHandler() {
  const { currentHost, getCurrentHost, setCurrentHost } =
    useContext(StateContext);

  const [state, setState] = useState({
    hasChanges: false,
    hasBackgroundImageChange: false,
    uploadingBackgroundImage: false,
    uploadedBackgroundImage: false,
    updating: false,
  });

  const currentTheme = currentHost?.theme?.body;

  const currentBorderRadius = borderRadiusOptions?.find(
    (option) => option?.value === currentTheme?.borderRadius
  );

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
    setState((prevState) => ({
      ...prevState,
      hasChanges: true,
    }));
  };

  const handleBackgroundImageChange = (images) => {
    if (!images || images.length === 0) {
      return;
    }

    const selectedImage = images?.[0]?.src;
    if (!selectedImage) {
      return;
    }

    if (selectedImage === currentHost?.theme?.body?.backgroundImage) {
      return;
    }

    setCurrentHost((prevState) => ({
      ...prevState,
      theme: {
        ...prevState.theme,
        body: {
          ...prevState.theme.body,
          backgroundImage: selectedImage,
        },
      },
    }));

    setState((prevState) => ({
      ...prevState,
      hasChanges: true,
      hasBackgroundImageChange: true,
    }));
  };

  const handleUploadedBackgroundImage = (images) => {
    if (!images?.[0]) {
      return;
    }

    setCurrentHost((prevState) => ({
      ...prevState,
      theme: {
        ...prevState.theme,
        body: {
          ...prevState.theme.body,
          backgroundImage: images[0],
        },
      },
    }));
    setState((prevState) => ({
      ...prevState,
      uploadedBackgroundImage: true,
    }));
  };

  const updateHostTheme = async () => {
    if (!currentHost?.theme) {
      return;
    }

    const newTheme = {
      ...currentHost.theme,
    };

    try {
      setState((prevState) => ({
        ...prevState,
        updating: true,
      }));
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
        hasChanges: false,
        updating: false,
        hasBackgroundImageChange: false,
        uploadingBackgroundImage: false,
        uploadedBackgroundImage: false,
      }));
    }
  };

  useEffect(() => {
    if (
      state.uploadedBackgroundImage &&
      currentHost?.theme?.body?.backgroundImage
    ) {
      updateHostTheme();
    }
  }, [state.uploadedBackgroundImage]);

  const confirmUpdate = () => {
    if (!state.hasChanges) {
      return;
    }

    if (state.hasBackgroundImageChange) {
      setState((prevState) => ({
        ...prevState,
        uploadingBackgroundImage: true,
      }));
      return;
    }

    updateHostTheme();
  };

  const handleHueChange = (hue) => {
    setState((prevState) => ({
      ...prevState,
      hasChanges: true,
    }));
  };

  if (!currentHost) {
    return (
      <Box>
        <Center>
          <Loader />
        </Center>
      </Box>
    );
  }

  return (
    <>
      <Text my="8" size="lg" css={{ fontWeight: '300' }}>
        <Trans i18nKey="admin:design.color.description" />
      </Text>

      <Box mb="8">
        <RadioGroup
          value={currentTheme?.variant}
          onChange={(selectedValue) =>
            handleStyleChange('variant', selectedValue)
          }
        >
          {themeOptions.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </RadioGroup>
      </Box>

      <Text fontWeight="bold" mb="4">
        <Trans i18nKey="admin:design.theme.demo" />
      </Text>

      <Boxling mb="8">
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
          <Text fontWeight="bold" mb="4">
            <Trans i18nKey="admin:design.theme.color" />
          </Text>
          <Boxling mb="8">
            <HuePicker onChange={handleHueChange} />
          </Boxling>
        </>
      )}

      <Text fontWeight="bold" mb="4">
        <Trans i18nKey="admin:design.border.title" />
      </Text>

      <Boxling mb="8">
        <Flex justify="center">
          <BoxlingColumn
            title={<Trans i18nKey="admin:design.border.radius" />}
          >
            <Menu
              buttonLabel={currentBorderRadius?.label}
              options={borderRadiusOptions}
              onSelect={(selectedOption) =>
                handleStyleChange('borderRadius', selectedOption?.value)
              }
            >
              {(item) => item.label}
            </Menu>
          </BoxlingColumn>
        </Flex>
      </Boxling>

      {currentTheme?.variant === 'custom' && (
        <BackgroundHandler
          uploadingBackgroundImage={state.uploadingBackgroundImage}
          handleStyleChange={handleStyleChange}
          onBackgroundImageChange={handleBackgroundImageChange}
          onUploadedBackgroundImage={handleUploadedBackgroundImage}
        />
      )}

      <Flex justify="flex-end" mb="12">
        <Button
          disabled={!state.hasChanges}
          isLoading={state.updating}
          onClick={confirmUpdate}
        >
          <Trans i18nKey="common:actions.submit" />
        </Button>
      </Flex>

      <Box bg="red.50" borderRadius="lg" fontWeight="bold" p="4" my="8">
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
