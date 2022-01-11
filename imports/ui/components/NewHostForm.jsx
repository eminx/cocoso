import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Flex, Input, Textarea, VStack } from '@chakra-ui/react';
import { hostFields } from '../constants/general';
import FormField from './FormField';

function NewHostForm({ defaultValues, onSubmit }) {
  const { formState, handleSubmit, register } = useForm({
    defaultValues,
  });
  const { isDirty, isSubmitting } = formState;

  return (
    <div>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <VStack spacing="6">
          {hostFields.map((props) => (
            <FormField key={props.name} label={props.label}>
              {props.textArea ? (
                <Textarea {...props} {...register(props.name)} />
              ) : (
                <Input {...props} {...register(props.name)} />
              )}
            </FormField>
          ))}

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
}

export default NewHostForm;
