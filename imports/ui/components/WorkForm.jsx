import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Input,
  Textarea,
  Select,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';

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
          <FormField label={t('works.title.label')} isRequired>
            <Input
              {...register('title', { required: true })}
              placeholder={t('works.title.holder')}
            />
          </FormField>

          <FormField label={t('works.shortDesc.label')}>
            <Textarea {...register('shortDescription')} placeholder={t('works.shortDesc.holder')} />
          </FormField>

          <FormField label={t('works.category.label')} isRequired>
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

          <FormField label={t('works.longDesc.label')} isRequired>
            <Controller
              control={control}
              name="longDescription"
              rules={{ required: true }}
              render={({ field }) => (
                <ReactQuill {...field} placeholder={t('works.longDesc.holder')} />
              )}
            />
          </FormField>

          <FormField label={t('works.addInfo.label')}>
            <Textarea {...register('additionalInfo')} placeholder={t('works.addInfo.holder')} />
          </FormField>

          <FormField label={t('works.images.label', { count: images.length })}>
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

const thumbStyle = (backgroundImage) => ({
  backgroundImage: backgroundImage && `url('${backgroundImage}')`,
});

const SortableItem = sortableElement(({ image, onRemoveImage, index }) => (
  <Box key={image} className="sortable-thumb" style={thumbStyle(image)}>
    <IconButton
      className="sortable-thumb-icon"
      colorScheme="gray.900"
      icon={<SmallCloseIcon style={{ pointerEvents: 'none' }} />}
      size="xs"
      onClick={onRemoveImage}
      style={{ position: 'absolute', top: 4, right: 4 }}
    />
  </Box>
));

const SortableContainer = sortableContainer(({ children }) => (
  <Center w="100%">
    <Wrap py="2">{children}</Wrap>
  </Center>
));

export default WorkForm;
