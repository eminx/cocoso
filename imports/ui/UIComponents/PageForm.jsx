import React from 'react';
import { Button, Flex, Input, VStack } from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import { Controller, useForm } from 'react-hook-form';

import { editorFormats, editorModules } from '../constants/quillConfig';
import FormField from '../UIComponents/FormField';

const PageForm = ({ defaultValues, onSubmit }) => {
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
              {...register('title', { required: true })}
              placeholder="Contributing"
            />
          </FormField>

          <FormField label="Description">
            <Controller
              control={control}
              name="longDescription"
              rules={{ required: true }}
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  formats={editorFormats}
                  modules={editorModules}
                  placeholder="Contibuting guidelines are..."
                />
              )}
            />
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

export default PageForm;
