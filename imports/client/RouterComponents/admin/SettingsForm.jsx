import React from 'react';
import { Button, Flex, Input, Stack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import FormField from '../../UIComponents/FormField';

function SettingsForm({ initialValues, onSubmit }) {
  const { handleSubmit, register, formState } = useForm({
    defaultValues: initialValues,
  });

  const { isDirty, isSubmitting } = formState;

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <Stack spacing="4">
        <FormField label="Name">
          <Input {...register('name')} />
        </FormField>
        <FormField label="Email">
          <Input type="email" {...register('email')} />
        </FormField>
        <FormField label="Address">
          <Input {...register('address')} />
        </FormField>
        <FormField label="City">
          <Input {...register('city')} />
        </FormField>
        <FormField label="Country">
          <Input {...register('country')} />
        </FormField>
        <Flex justify="flex-end" my="4">
          <Button isDisabled={!isDirty || isSubmitting} type="submit">
            Confirm
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}

export default SettingsForm;
