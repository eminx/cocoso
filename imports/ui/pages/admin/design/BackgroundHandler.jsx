import React, { useContext } from 'react';
import { Trans } from 'react-i18next';

import { Box, Button, Center, Checkbox, VStack, Text } from '/imports/ui/core';
import Boxling, { BoxlingColumn } from '/imports/ui/pages/admin/Boxling';
import ImageUploader from '/imports/ui/forms/ImageUploader';
import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import GenericColorPicker from '/imports/ui/generic/GenericColorPicker';
import ColorPicker from './HuePicker';
import Menu from '/imports/ui/generic/Menu';

export default function BackgroundHandler({
  uploadingBackgroundImage,
  handleStyleChange,
  onBackgroundImageChange,
  onUploadedBackgroundImage,
}) {
  const { currentHost } = useContext(StateContext);

  const backgroundColor = currentHost?.theme?.body?.backgroundColor;
  const backgroundImage = currentHost?.theme?.body?.backgroundImage;
  const backgroundRepeat =
    currentHost?.theme?.body?.backgroundRepeat === 'repeat';

  return (
    <>
      <Text fontWeight="bold">
        <Trans i18nKey="admin:design.background.color" />
      </Text>

      <Boxling mb="8" mt="4">
        <VStack align="center" gap="1">
          <GenericColorPicker
            color={backgroundColor}
            onChange={(selectedOption) =>
              handleStyleChange('backgroundColor', selectedOption?.hex)
            }
          />
          <Button
            colorScheme="red"
            size="sm"
            variant="ghost"
            onClick={() => handleStyleChange('backgroundColor', '#f0ebe6')}
          >
            <Trans i18nKey="admin:design.color.revert" />
          </Button>
        </VStack>
      </Boxling>

      <Text fontWeight="bold">
        <Trans i18nKey="admin:design.background.image" />
      </Text>

      <Boxling mb="8" mt="4">
        <ImageUploader
          isMultiple={false}
          ping={uploadingBackgroundImage}
          preExistingImages={[backgroundImage]}
          onSelectImages={onBackgroundImageChange}
          onUploadedImages={onUploadedBackgroundImage}
        />
        <Center>
          <Button
            bg="white"
            colorScheme="red"
            mt="2"
            size="xs"
            variant="ghost"
            onClick={() => handleStyleChange('backgroundImage', 'none')}
          >
            <Trans i18nKey="common:actions.remove" />
          </Button>
        </Center>

        {backgroundImage && backgroundImage !== 'none' && (
          <Center pt="8">
            <Checkbox
              checked={backgroundRepeat}
              onChange={(event) => {
                const checked = event.target.checked;
                handleStyleChange(
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
