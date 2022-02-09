import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Flex, Input, VStack } from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import { useTranslation } from 'react-i18next';

import FormField from '../../components/FormField';
import { editorFormats, editorModules } from '../../@/constants/quillConfig';

const Personal = ({ defaultValues, onSubmit }) => {
  const { control, formState, handleSubmit, register } = useForm({
    defaultValues,
  });
  const { isDirty, isSubmitting } = formState;

  const [ t ]= useTranslation('members');
  const [ tc ]= useTranslation('common');

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        defaultValues={defaultValues}
      >
        <VStack spacing="6">
          <FormField label={t('profile.form.firstname.label')}>
            <Input {...register('firstName')} placeholder="" />
          </FormField>

          <FormField label={t('profile.form.lastname.label')}>
            <Input {...register('lastName')} placeholder="" />
          </FormField>

          <FormField label={t('profile.form.bio.label')}>
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

          <FormField label={t('profile.form.contact.label')}>
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
              {tc('actions.submit')}
            </Button>
          </Flex>
        </VStack>
      </form>
    </div>
  );
};

export default Personal;
