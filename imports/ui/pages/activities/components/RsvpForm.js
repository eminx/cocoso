import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  NumberInput,
} from '/imports/ui/core';

import FormField from '../../../forms/FormField';

export default function RsvpForm({
  isUpdateMode = false,
  defaultValues,
  onSubmit,
  onDelete,
}) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { handleSubmit, register, formState } = useForm({
    defaultValues,
  });
  const { isDirty, isSubmitting } = formState;
  const [t] = useTranslation('activities');

  const fields = [
    {
      name: 'firstName',
      label: t('public.register.form.name.first'),
    },
    {
      name: 'lastName',
      label: t('public.register.form.name.last'),
    },
    {
      name: 'email',
      label: t('public.register.form.email'),
    },
  ];

  return (
    <Box mb="8">
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <Flex direction="column" gap="0">
          {fields.map((field) => (
            <FormField key={field.name} label={field.label} required>
              <Input {...register(field.name, { required: true })} />
            </FormField>
          ))}
          <FormField label={t('public.register.form.people.number')} required>
            <NumberInput {...register('numberOfPeople', { required: true })} />
          </FormField>
          <Flex justify="flex-end" pt="2" w="100%">
            <Button
              disabled={isUpdateMode && !isDirty}
              loading={isSubmitting}
              type="submit"
              variant="outline"
            >
              {isUpdateMode
                ? t('public.register.form.actions.update')
                : t('public.register.form.actions.create')}
            </Button>
          </Flex>
          {isUpdateMode && (
            <Center p="2">
              <Button
                colorScheme="red"
                loading={deleteLoading}
                size="sm"
                variant="ghost"
                onClick={() => {
                  setDeleteLoading(true);
                  onDelete();
                }}
              >
                {t('public.register.form.actions.remove')}
              </Button>
            </Center>
          )}
        </Flex>
      </form>
    </Box>
  );
}
