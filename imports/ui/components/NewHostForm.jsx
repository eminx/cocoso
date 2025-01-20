import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Flex, Input, Textarea, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { hostFields } from '../utils/constants/general';
import FormField from './FormField';

function NewHostForm({ defaultValues, onSubmit }) {
  const { formState, handleSubmit, register } = useForm({
    defaultValues,
  });
  const { isDirty, isSubmitting } = formState;

  const [t] = useTranslation('hosts');
  const [tc] = useTranslation('common');

  return (
    <Box minW="300px" data-oid="mc_.tw0">
      <form onSubmit={handleSubmit((data) => onSubmit(data))} data-oid="es7xcw8">
        <VStack spacing="6" data-oid="5gugryk">
          {hostFields.map((props) => (
            <FormField key={props.name} label={t(`new.${props.name}.label`)} data-oid="xal58dn">
              {props.textArea ? (
                <Textarea
                  {...props}
                  {...register(props.name)}
                  placeholder={t(`new.${props.name}.holder`)}
                  data-oid="ys4-m4h"
                />
              ) : (
                <Input
                  {...props}
                  {...register(props.name)}
                  placeholder={t(`new.${props.name}.holder`)}
                  data-oid="crho7_6"
                />
              )}
            </FormField>
          ))}

          <Flex justify="flex-end" py="4" w="100%" data-oid="1d53za4">
            <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit" data-oid="g5n28bn">
              {tc('actions.submit')}
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
}

export default NewHostForm;
