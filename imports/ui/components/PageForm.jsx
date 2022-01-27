import React from 'react';
import { Button, Flex, Input, VStack } from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { editorFormats, editorModules } from '../@/constants/quillConfig';
import FormField from '../components/FormField';

const PageForm = ({ defaultValues, onSubmit }) => {
  const [t] = useTranslation('pages');
  const [tCommon] = useTranslation('common');
  const tAction = (key) => tCommon(`actions.${key}`);

  const { control, formState, handleSubmit, register } = useForm({
    defaultValues,
  });
  const { isDirty, isSubmitting } = formState;

  return (
    <div>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <VStack spacing="6">
          <FormField label={t('form.title.label')}>
            <Input
              {...register('title', { required: true })}
              placeholder={t('form.title.placeholder')}
            />
          </FormField>

          <FormField label={t('form.desc.label')}>
            <Controller
              control={control}
              name="longDescription"
              rules={{ required: true }}
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  formats={editorFormats}
                  modules={editorModules}
                  placeholder={t('form.desc.placeholder')}
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
              {tAction('submit')}
            </Button>
          </Flex>
        </VStack>
      </form>
    </div>
  );
};

export default PageForm;
