import React from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import FileDropper from '../UIComponents/FileDropper';
import NiceSlider from '../UIComponents/NiceSlider';
import { editorFormats, editorModules } from '../constants/quillConfig';

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

  return (
    <div>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <VStack spacing="6">
          <FormField label="Title">
            <Input
              {...register('title')}
              placeholder="Mango Juice in Bottles..."
            />
          </FormField>

          <FormField label="Short description">
            <Textarea
              {...register('shortDescription')}
              placeholder="Sweet, Natural & Refreshing"
            />
          </FormField>

          <FormField label="Category">
            <Select {...register('category')} placeholder="Choose option">
              {categories.map((cat) => (
                <option
                  key={cat.label}
                  selected={
                    cat.label.toLowerCase() ===
                    defaultValues.category.toLowerCase()
                  }
                  value={cat._id}
                >
                  {cat.label.toUpperCase()}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Description">
            <Controller
              control={control}
              name="longDescription"
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  formats={editorFormats}
                  modules={editorModules}
                  placeholder="My Mango juice is handpicked from the trees and..."
                />
              )}
            />
          </FormField>

          <FormField label="Additional info">
            <Textarea
              {...register('additionalInfo')}
              placeholder="A bottle costs..."
            />
          </FormField>

          <FormField label={`Images (${images.length})`}>
            <Box>
              {images && <NiceSlider images={images} />}

              {images && images.length > 0 ? (
                <SortableContainer
                  onSortEnd={onSortImages}
                  axis="xy"
                  helperClass="sortableHelper"
                >
                  {images.map((image, index) => (
                    <SortableItem
                      key={image}
                      index={index}
                      image={image}
                      onRemoveImage={() => onRemoveImage(index)}
                    />
                  ))}
                  <Center w="100%">
                    <FileDropper setUploadableImage={setUploadableImages} />
                  </Center>
                </SortableContainer>
              ) : (
                <Center>
                  <FileDropper setUploadableImage={setUploadableImages} />
                </Center>
              )}
            </Box>
          </FormField>

          <Flex justify="flex-end" py="4" w="100%">
            <Button
              isDisabled={!isDirty}
              isLoading={isSubmitting}
              type="submit"
            >
              Confirm
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
