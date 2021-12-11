import React from 'react';
import { Box, Button, Input, Stack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import FormField from '../../UIComponents/FormField';

function SettingsForm({ initialValues, onSubmit }) {
  const { handleSubmit, register, formState } = useForm({
    defaultValues: initialValues,
  });
  const { isDirty } = formState;

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))} className="form">
      <Stack spacing={2}>
        <FormField label="Name" name="name" />
        <FormField label="Email" name="email" type="email" />
        <FormField label="Address">
          <Input {...register('address')} />
        </FormField>
        <FormField label="City">
          <Input {...register('city')} />
        </FormField>
        <FormField label="Country">
          <Input {...register('country')} />
        </FormField>
        <Box>
          <Button isDisabled={!isDirty} type="submit">
            Confirm
          </Button>
        </Box>
      </Stack>
    </form>
  );
}

export default SettingsForm;
