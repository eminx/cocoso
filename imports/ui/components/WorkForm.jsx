import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Center,
  Flex,
  FormLabel,
  Input,
  Textarea,
  Select,
  Switch,
  VStack,
} from '@chakra-ui/react';

import FormField from './FormField';
import NiceSlider from './NiceSlider';
import ReactQuill from './Quill';
import ImageUploadUI from './ImageUploadUI';

function WorkForm({
  categories,
  defaultValues,
  images,
  onRemoveImage,
  onSortImages,
  onSubmit,
  setUploadableImages,
}) {
  const { control, formState, handleSubmit, register } = useForm({
    defaultValues,
  });
  const { isDirty, isSubmitting } = formState;

  const [t] = useTranslation('members');
  const [tc] = useTranslation('common');

  return (
    <div>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <VStack spacing="6">
          <FormField helperText={t('works.title.helper')} label={t('works.title.label')} isRequired>
            <Input
              {...register('title', { required: true })}
              placeholder={t('works.title.holder')}
            />
          </FormField>

          <FormField
            helperText={t('works.shortDescription.helper')}
            label={t('works.shortDescription.label')}
          >
            <Textarea
              {...register('shortDescription')}
              placeholder={t('works.shortDescription.holder')}
            />
          </FormField>

          <FormField
            helperText={t('works.category.helper')}
            label={t('works.category.label')}
            isRequired
          >
            <Select
              {...register('categoryId', { required: true })}
              placeholder={t('works.category.holder')}
            >
              {categories.map((cat) => (
                <option
                  key={cat._id}
                  selected={cat._id === defaultValues.categoryId}
                  value={cat._id}
                >
                  {cat?.label?.toUpperCase()}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            helperText={t('works.longDescription.helper')}
            label={t('works.longDescription.label')}
            isRequired
          >
            <Controller
              control={control}
              name="longDescription"
              rules={{ required: true }}
              render={({ field }) => (
                <ReactQuill {...field} placeholder={t('works.longDescription.holder')} />
              )}
            />
          </FormField>

          <FormField helperText={t('works.extra.helper')} label={t('works.extra.label')}>
            <Textarea {...register('additionalInfo')} placeholder={t('works.extra.holder')} />
          </FormField>

          <FormField
            helperText={t('works.images.helper')}
            label={t('works.images.label', { count: images.length })}
          >
            {images && (
              <Center>
                <NiceSlider width="300px" images={images} />
              </Center>
            )}
            <ImageUploadUI
              images={images}
              onRemoveImage={onRemoveImage}
              onSelectImages={setUploadableImages}
              onSortImages={onSortImages}
            />
          </FormField>

          <FormField helperText="Check to show your profile image along with viewing this entry">
            <Flex align="center">
              <Switch id="avatar" mb="2" {...register('showAvatar')} />
              <FormLabel htmlFor="avatar">Show Avatar</FormLabel>
            </Flex>
          </FormField>

          <Flex justify="flex-end" py="4" w="100%">
            <Button isLoading={isSubmitting} type="submit">
              {tc('actions.submit')}
            </Button>
          </Flex>
        </VStack>
      </form>
    </div>
  );
}

export default WorkForm;
