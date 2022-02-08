import React from 'react';
import {
  Button,
  Center,
  Flex,
  Input,
  NumberInput,
  NumberInputField,
  VStack,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { editorFormats, editorModules } from '../@/constants/quillConfig';
import FileDropper from '../components/FileDropper';
import FormField from '../components/FormField';

const ProcessForm = ({
  uploadableImageLocal,
  setUploadableImage,
  defaultValues,
  onSubmit,
  imageUrl,
}) => {
  const { control, formState, handleSubmit, register } = useForm({
    defaultValues,
  });
  const { isDirty, isSubmitting } = formState;
  const [ t ] = useTranslation('processes');
  const [ tc ] = useTranslation('common');

  return (
    <div>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <VStack spacing="6">
          <FormField
            label={t('form.image.label')}
            helperText={(uploadableImageLocal || imageUrl) && tc('plugins.fileDropper.replace')}
          >
            <Center>
              <FileDropper
                imageUrl={imageUrl}
                setUploadableImage={setUploadableImage}
                uploadableImageLocal={uploadableImageLocal}
              />
            </Center>
          </FormField>

          <FormField label={t('form.title.label')}>
            <Input
              {...register('title')}
              placeholder={t('form.title.holder')}
            />
          </FormField>

          <FormField label={t('form.subtitle.label')}>
            <Input
              {...register('readingMaterial')}
              placeholder={t('form.subtitle.holder')}
            />
          </FormField>

          <FormField label={t('form.desc.label')}>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  formats={editorFormats}
                  modules={editorModules}
                />
              )}
            />
          </FormField>

          <FormField label={t('form.capacity.label')}>
            <NumberInput>
              <NumberInputField {...register('capacity')} />
            </NumberInput>
          </FormField>

          <Flex justify="flex-end" py="4" w="100%">
            <Button
              isDisabled={!isDirty}
              isLoading={isSubmitting}
              type="submit"
            >
              {tc('actions.submit')}
            </Button>
          </Flex>
        </VStack>
      </form>
    </div>
  );
};

export default ProcessForm;
