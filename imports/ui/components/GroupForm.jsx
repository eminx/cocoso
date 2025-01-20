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
import { useTranslation } from 'react-i18next';

import FileDropper from './FileDropper';
import FormField from './FormField';
import ReactQuill from './Quill';
import { DocumentUploadHelper } from './UploadHelpers';

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
    <div data-oid="_i9-kb7">
      <form onSubmit={handleSubmit((data) => onSubmit(data))} data-oid="5.c_ysx">
        <VStack spacing="6" data-oid="u7y-5m.">
          <FormField
            helperText={t('form.title.helper')}
            label={t('form.title.label')}
            isRequired
            data-oid="41qi2sk"
          >
            <Input
              {...register('title', { required: true })}
              placeholder={t('form.title.holder')}
              data-oid="qefn6nv"
            />
          </FormField>

          <FormField
            helperText={t('form.subtitle.helper')}
            label={t('form.subtitle.label')}
            isRequired
            data-oid="pygjz08"
          >
            <Input
              {...register('readingMaterial', { required: true })}
              placeholder={t('form.subtitle.holder')}
              data-oid="jkupk5c"
            />
          </FormField>

          <FormField
            helperText={t('form.description.helper')}
            label={t('form.description.label')}
            isRequired
            data-oid="dnfpg2q"
          >
            <Controller
              control={control}
              name="description"
              rules={{ required: true }}
              render={({ field }) => <ReactQuill {...field} data-oid="yy5glka" />}
              data-oid="36vdj1m"
            />
          </FormField>

          <FormField
            helperText={t('form.capacity.helper')}
            label={t('form.capacity.label')}
            isRequired
            data-oid="7o7fjah"
          >
            <NumberInput data-oid="c3hu22s">
              <NumberInputField {...register('capacity', { required: true })} data-oid="_5azq-q" />
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
            data-oid="69vu9m3"
          >
            <Center data-oid="-pt8h:i">
              <FileDropper
                imageUrl={imageUrl}
                setUploadableImage={handleSetUploadableImage}
                uploadableImageLocal={uploadableImageLocal}
                data-oid="_q-g5p1"
              />
            </Center>
            <DocumentUploadHelper isImage data-oid="j6.gafu" />
          </FormField>

          <Flex justify="flex-end" py="4" w="100%" data-oid="brp_0bf">
            <Button
              isDisabled={(!isDirty && !imageChanged) || isSubmitDisabled}
              isLoading={isButtonLoading}
              type="submit"
              data-oid="k9fdgca"
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
