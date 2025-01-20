import React, { useState } from 'react';
import {
  Button,
  Center,
  Flex,
  Input,
  NumberInput,
  NumberInputField,
  VStack,
} from '@chakra-ui/react';

import { Controller, useForm } from 'react-hook-form';
import { useSSR, useTranslation } from 'react-i18next';

import FileDropper from './FileDropper';
import FormField from './FormField';
import ReactQuill from './Quill';

function GroupForm({
  uploadableImageLocal,
  setUploadableImage,
  defaultValues,
  onSubmit,
  imageUrl,
  isSubmitDisabled,
  isButtonLoading,
}) {
  const [imageChanged, setImageChanged] = useState(false);

  const { control, formState, handleSubmit, register } = useForm({
    defaultValues,
  });
  const { isDirty } = formState;
  const [t] = useTranslation('groups');
  const [tc] = useTranslation('common');

  const handleSetUploadableImage = (files) => {
    setUploadableImage(files);
    setImageChanged(true);
  };

  return (
    <div data-oid="qffbj79">
      <form onSubmit={handleSubmit((data) => onSubmit(data))} data-oid="688ox4d">
        <VStack spacing="6" data-oid="g6pzwt7">
          <FormField
            helperText={t('form.title.helper')}
            label={t('form.title.label')}
            isRequired
            data-oid="s9s.v.n"
          >
            <Input
              {...register('title', { required: true })}
              placeholder={t('form.title.holder')}
              data-oid="jgrf0ud"
            />
          </FormField>

          <FormField
            helperText={t('form.subtitle.helper')}
            label={t('form.subtitle.label')}
            isRequired
            data-oid="nj8ol9m"
          >
            <Input
              {...register('readingMaterial', { required: true })}
              placeholder={t('form.subtitle.holder')}
              data-oid="x5yqn6m"
            />
          </FormField>

          <FormField
            helperText={t('form.description.helper')}
            label={t('form.description.label')}
            isRequired
            data-oid="_8htshb"
          >
            <Controller
              control={control}
              name="description"
              rules={{ required: true }}
              render={({ field }) => <ReactQuill {...field} data-oid="s77gyoa" />}
              data-oid="29rfv6t"
            />
          </FormField>

          <FormField
            helperText={t('form.capacity.helper')}
            label={t('form.capacity.label')}
            isRequired
            data-oid="bji-qgb"
          >
            <NumberInput data-oid="4s5_dfo">
              <NumberInputField {...register('capacity', { required: true })} data-oid="kl-bx9v" />
            </NumberInput>
          </FormField>

          <FormField
            helperText={
              uploadableImageLocal || imageUrl
                ? tc('plugins.fileDropper.replace')
                : t('form.image.helper')
            }
            isRequired
            label={t('form.image.label')}
            data-oid="sl4x:-a"
          >
            <Center data-oid="9zy0471">
              <FileDropper
                imageUrl={imageUrl}
                setUploadableImage={handleSetUploadableImage}
                uploadableImageLocal={uploadableImageLocal}
                data-oid="mt92y-v"
              />
            </Center>
          </FormField>

          <Flex justify="flex-end" py="4" w="100%" data-oid="110nxxl">
            <Button
              isDisabled={(!isDirty && !imageChanged) || isSubmitDisabled}
              isLoading={isButtonLoading}
              type="submit"
              data-oid="cy2spmr"
            >
              {tc('actions.submit')}
            </Button>
          </Flex>
        </VStack>
      </form>
    </div>
  );
}

export default GroupForm;
