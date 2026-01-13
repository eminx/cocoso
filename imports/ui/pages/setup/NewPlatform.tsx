import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Flex, Input } from '/imports/ui/core';

import FormField from '../../forms/FormField';

export interface PlatformFormValues {
  name: string;
  email: string;
  portalHost: string;
}

export interface NewPlatformProps {
  onSubmit: (data: PlatformFormValues) => void;
}

export default function NewPlatform({ onSubmit }: NewPlatformProps) {
  const currentUser = Meteor.user();
  const host = window.location.host;
  const email = currentUser?.emails[0]?.address;

  const defaultValues: Partial<PlatformFormValues> = {
    name: '',
    email,
    portalHost: host,
  };

  const { formState, handleSubmit, register } = useForm<PlatformFormValues>({
    defaultValues,
  });
  const { isSubmitting } = formState;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" gap="6">
          <FormField key="name" label="Name" required>
            <Input {...register('name')} />
          </FormField>

          <FormField key="email" label="Email address" required>
            <Input {...register('email')} defaultValue={email} />
          </FormField>

          <FormField key="portalHost" label="Portal Host (Main url)" required>
            <Input {...register('portalHost')} value={host} isDisabled />
          </FormField>

          <Flex justify="flex-end" py="4" w="100%">
            <Button isLoading={isSubmitting} type="submit">
              Confirm
            </Button>
          </Flex>
        </Flex>
      </form>
    </>
  );
}
