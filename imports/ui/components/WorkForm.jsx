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
import ReactQuill from 'react-quill';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';

import FormField from './FormField';
import FileDropper from '../components/FileDropper';
import NiceSlider from '../components/NiceSlider';
import { editorFormats, editorModules } from '../utils/constants/quillConfig';

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
                  {cat.label.toUpperCase()}
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
                <ReactQuill
                  {...field}
                  formats={editorFormats}
                  modules={editorModules}
                  placeholder={t('works.longDesc.holder')}
                />
              )}
            />
            </FormField>

          <FormField label={t('works.addInfo.label')}>
            <Textarea {...register('additionalInfo')} placeholder={t('works.addInfo.holder')} />
            </FormField>

          <FormField label={t('works.images.label', { count: images.length })}>
            <Box>
              {images && <NiceSlider images={images} />}

              {images && images.length > 0 ? (
                <SortableContainer onSortEnd={onSortImages} axis="xy" helperClass="sortableHelper">
                  {images.map((image, index) => (
                    <SortableItem
                      key={image}
                      index={index}
                      image={image}
                      onRemoveImage={() => onRemoveImage(index)}
                    />
                  ))}
                  <Center w="100%">
                    <FileDropper setUploadableImage={setUploadableImages} isMultiple />
                    </Center>
                  </SortableContainer>
              ) : (
                <Center>
                  <FileDropper setUploadableImage={setUploadableImages} isMultiple />
                  </Center>
              )}
              </Box>
            </FormField>

          <Flex justify="flex-end" py="4" w="100%">
            <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit">
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

const SortableItem = sortableElement(({ image, onRemoveImage, index }) => {
  return (
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
  );
});

const SortableContainer = sortableContainer(({ children }) => {
  return (
    <Center w="100%">
      <Wrap py="2">{children}</Wrap>
      </Center>
  );
});

export default WorkForm;
