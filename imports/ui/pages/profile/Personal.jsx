import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Flex, Input, VStack } from '@chakra-ui/react';
import ReactQuill from 'react-quill';

import FormField from '../../components/FormField';
import { editorFormats, editorModules } from '../../@/constants/quillConfig';

const Personal = ({ defaultValues, onSubmit }) => {
  const { control, formState, handleSubmit, register } = useForm({
    defaultValues,
  });
  const { isDirty, isSubmitting } = formState;

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        defaultValues={defaultValues}
      >
        <VStack spacing="6">
          <FormField label="First name">
            <Input {...register('firstName')} placeholder="" />
          </FormField>

          <FormField label="Last name">
            <Input {...register('lastName')} placeholder="" />
          </FormField>

          <FormField label="Bio">
            <Controller
              control={control}
              name="bio"
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  formats={editorFormats}
                  modules={editorModules}
                />
              )}
            />
          </FormField>

          <FormField label="Contact Info">
            <Controller
              control={control}
              name="contactInfo"
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  formats={editorFormats}
                  modules={editorModules}
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

export default Personal;
