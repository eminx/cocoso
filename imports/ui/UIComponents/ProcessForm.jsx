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

import { editorFormats, editorModules } from '../constants/quillConfig';
import FileDropper from '../UIComponents/FileDropper';
import FormField from '../UIComponents/FormField';

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
  console.log(isSubmitting);
  return (
    <div>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <VStack spacing="6">
          <FormField
            label="Image"
            helperText={
              (uploadableImageLocal || imageUrl) &&
              'If you want to replace it with another one, click on the image to reopen the file picker'
            }
          >
            <Center>
              <FileDropper
                uploadableImageLocal={uploadableImageLocal}
                imageUrl={imageUrl}
                setUploadableImage={setUploadableImage}
              />
            </Center>
          </FormField>

          <FormField label="Title">
            <Input
              {...register('title')}
              placeholder="Understanding Benjamin"
            />
          </FormField>

          <FormField label="Subtitle">
            <Input
              {...register('readingMaterial')}
              placeholder="Through Illuminations"
            />
          </FormField>

          <FormField label="Description">
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

          <FormField label="Capacity">
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
              Confirm
            </Button>
          </Flex>
        </VStack>
      </form>
    </div>
  );
};

export default ProcessForm;
