import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { useAtom } from 'jotai';

import { Box, Button, Center, Flex, Checkbox, Text } from '/imports/ui/core';
import Boxling, { BoxlingColumn } from '/imports/ui/pages/admin/Boxling';
import FileDropper from '/imports/ui/forms/FileDropper';
import { currentHostAtom } from '../../../../state';
import { call, resizeImage, uploadImage } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import GenericColorPicker from '/imports/ui/generic/GenericColorPicker';
import Menu from '/imports/ui/generic/Menu';

import ColorPicker from './HuePicker';

export default function BackgroundHandler({
  uploadPing,
  onStyleChange,
  onUploadFinish,
}) {
  const [currentHost, setCurrentHost] = useAtom(currentHostAtom);
  const [state, setState] = useState({
    uploadingBgImage: false,
    uploadableBgImage: null,
    uploadableBgImageLocal: null,
  });

  const backgroundColor = currentHost?.theme?.body?.backgroundColor;
  const backgroundImage = currentHost?.theme?.body?.backgroundImage;
  const existingBackgroundImage =
    (backgroundImage !== 'none' && backgroundImage) || null;
  const backgroundRepeat =
    currentHost?.theme?.body?.backgroundRepeat === 'repeat';

  useEffect(() => {
    if (!uploadPing) {
      return;
    }
    if (state.uploadingBgImage) {
      return;
    }

    setState((prevState) => ({
      ...prevState,
      uploadingBgImage: true,
    }));
    uploadBgImage();
  }, [uploadPing]);

  const setUploadableImage = (files) => {
    if (files.length > 1) {
      message.error(<Trans i18nKey="admin:logo.message.fileDropper" />);
      return;
    }
    const uploadableImage = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadableImage);
    reader.addEventListener(
      'load',
      () => {
        setState((prevState) => ({
          ...prevState,
          uploadableBgImage: uploadableImage,
          uploadableBgImageLocal: reader.result,
        }));

        setCurrentHost((prevState) => ({
          ...prevState,
          theme: {
            ...prevState.theme,
            body: {
              ...prevState.theme.body,
              backgroundImage: reader.result,
            },
          },
        }));
      },
      false
    );
  };

  const uploadBgImage = async () => {
    if (
      !backgroundImage ||
      backgroundImage === 'none' ||
      backgroundImage.substring(0, 4) === 'http' ||
      backgroundImage.substring(0, 5) !== 'data:'
    ) {
      setState((prevState) => ({
        ...prevState,
        uploadingBgImage: false,
      }));
      onUploadFinish();
      return;
    }

    if (state.uploadableBgImage.size > 400000) {
      message.error(<Trans i18nKey="admin:messages.upload.imageTooLarge" />);
      return;
    }

    try {
      const resizedImage = await resizeImage(state.uploadableBgImage, 1200);
      const uploadedImage = await uploadImage(
        resizedImage,
        'genericEntryImageUpload'
      );
      onStyleChange('backgroundImage', uploadedImage);
      onUploadFinish(uploadedImage);
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
    }
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

  return (
    <>
      <Text fontWeight="bold">
        <Trans i18nKey="admin:design.background.color" />
      </Text>

      <Boxling mb="8" mt="4">
        <Flex align="center" direction="column" gap="1">
          <GenericColorPicker
            color={backgroundColor}
            onChange={(selectedOption) =>
              onStyleChange('backgroundColor', selectedOption?.hex)
            }
          />
          <Button
            colorScheme="red"
            size="sm"
            variant="ghost"
            onClick={() => onStyleChange('backgroundColor', '#f0ebe6')}
          >
            <Trans i18nKey="admin:design.color.revert" />
          </Button>
        </Flex>
      </Boxling>

      <Text fontWeight="bold">
        <Trans i18nKey="admin:design.background.image" />
      </Text>
      <br />
      <Text fontWeight="light" size="sm">
        <Trans i18nKey="admin:messages.upload.helper" />
      </Text>

      <Boxling mb="8" mt="4">
        <Center>
          <FileDropper
            imageUrl={existingBackgroundImage}
            height="180px"
            setUploadableImage={setUploadableImage}
            uploadableImageLocal={state.uploadableBgImageLocal}
          />
        </Center>

        <Center>
          <Button
            bg="white"
            colorScheme="red"
            mt="2"
            size="xs"
            variant="ghost"
            onClick={() => onStyleChange('backgroundImage', 'none')}
          >
            <Trans i18nKey="common:actions.remove" />
          </Button>
        </Center>

        {backgroundImage && backgroundImage !== 'none' && (
          <Center pt="8">
            <Checkbox
              checked={backgroundRepeat}
              id="background-repeat"
              onChange={(event) => {
                const checked = event.target.checked;
                onStyleChange(
                  'backgroundRepeat',
                  checked ? 'repeat' : 'no-repeat'
                );
              }}
            >
              <Trans i18nKey="admin:design.background.repeat" />
            </Checkbox>
          </Center>
        )}
      </Boxling>
    </>
  );
}
