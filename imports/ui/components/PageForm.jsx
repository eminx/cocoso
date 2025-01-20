import React from 'react';
import { Button, Flex, Input, VStack } from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormField from './FormField';
import ReactQuill from './Quill';
import ImageUploadUI from './ImageUploadUI';
import { DocumentUploadHelper } from './UploadHelpers';

const PageForm = ({
  defaultValues = { title: '', longDescription: '' },
  images,
  isButtonLoading = false,
  onRemoveImage,
  onSetUploadableImages,
  onSortImages,
  onSubmit,
}) => {
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const { control, handleSubmit, register } = useForm({
    defaultValues,
  });

  return (
    <div data-oid="k7563k8">
      <form onSubmit={handleSubmit((data) => onSubmit(data))} data-oid="-:rbg8r">
        <VStack spacing="6" data-oid="qj:l992">
          <FormField
            helperText={t('pages.form.title.helper')}
            isRequired
            label={t('pages.form.title.label')}
            data-oid="mlh5w-m"
          >
            <Input
              {...register('title', { required: true })}
              placeholder={t('pages.form.title.holder')}
              data-oid="ce_3q4c"
            />
          </FormField>

          <FormField
            helperText={t('pages.form.images.helper')}
            label={t('pages.form.images.label', { count: images.length })}
            data-oid="5ydhrsr"
          >
            <ImageUploadUI
              images={images}
              onRemoveImage={onRemoveImage}
              onSelectImages={onSetUploadableImages}
              onSortImages={onSortImages}
              data-oid="inl.ru-"
            />

            <DocumentUploadHelper isImage data-oid="l1zfl.r" />
          </FormField>

          <FormField
            helperText={t('pages.form.description.helper')}
            isRequired
            label={t('pages.form.description.label')}
            data-oid="t:ggem5"
          >
            <Controller
              control={control}
              name="longDescription"
              rules={{ required: true }}
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  placeholder={t('pages.form.description.holder')}
                  data-oid="y:.la74"
                />
              )}
              data-oid="q.gop_w"
            />
          </FormField>

          <Flex justify="flex-end" py="4" w="100%" data-oid="9nqc2zj">
            <Button isLoading={isButtonLoading} type="submit" data-oid=":5js.tp">
              {tc('actions.submit')}
            </Button>
          </Flex>
        </VStack>
      </form>
    </div>
  );
};

export default PageForm;
