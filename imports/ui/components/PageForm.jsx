import React from 'react';
import { Button, Flex, Input, VStack } from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormField from './FormField';
import ReactQuill from './Quill';

const PageForm = ({ defaultValues, onSubmit }) => {
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const { control, formState, handleSubmit, register } = useForm({
    defaultValues,
  });
  const { isDirty, isSubmitting } = formState;

  return (
    <div>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <VStack spacing="6">
          <FormField label={t('pages.form.title.label')}>
            <Input
              {...register('title', { required: true })}
              placeholder={t('pages.form.title.holder')}
            />
          </FormField>

          <FormField label={t('pages.form.desc.label')}>
            <Controller
              control={control}
              name="longDescription"
              rules={{ required: true }}
              render={({ field }) => (
                <ReactQuill {...field} placeholder={t('pages.form.desc.holder')} />
              )}
            />
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
};

export default PageForm;
