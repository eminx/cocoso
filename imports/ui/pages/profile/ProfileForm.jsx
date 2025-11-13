import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, Flex, Input } from '/imports/ui/core';

import FormField from '../../forms/FormField';
import Quill from '../../forms/Quill';

function ProfileForm({ defaultValues, onSubmit }) {
  const { control, formState, handleSubmit, register } = useForm({
    defaultValues,
  });
  const { isDirty, isSubmitting } = formState;

  const [t] = useTranslation('members');
  const [tc] = useTranslation('common');

  return (
    <div>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <Flex direction="column" gap="6">
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
              render={({ field }) => <Quill {...field} />}
            />
          </FormField>

          <FormField label={t('profile.form.contact.label')}>
            <Controller
              control={control}
              name="contactInfo"
              render={({ field }) => <Quill {...field} />}
            />
          </FormField>

          <Flex justify="flex-end" py="4" w="100%">
            <Button disabled={!isDirty} loading={isSubmitting} type="submit">
              {tc('actions.submit')}
            </Button>
          </Flex>
        </Flex>
      </form>
    </div>
  );
}

export default ProfileForm;
