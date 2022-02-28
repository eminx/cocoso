import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Switch,
  Tag,
  TagLabel,
  TagCloseButton,
  Text,
  Textarea,
  VStack,
  Wrap,
} from '@chakra-ui/react';

import FormField from '/imports/ui/components/FormField';
// import Tag from './Tag';

function ResourceForm({
  defaultValues,
  isEditMode,
  resourcesForCombo,
  suggestions,
  onAddResourceForCombo,
  onRemoveResourceForCombo,
  onSubmit,
}) {
  const { formState, handleSubmit, getValues, register } = useForm({
    defaultValues,
  });
  const { isDirty, isSubmitting } = formState;
  const [ t ] = useTranslation('admin');
  const [ tc ] = useTranslation('common');

  const isCombo = getValues('isCombo');
  return (
    <Box>
      {/* <Heading mb="8">{`${isEditMode ? 'Edit' : 'New'} Resource`}</Heading> */}

      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <VStack spacing="6">
          <FormControl display="flex" alignItems="center">
            <Switch
              {...register('isCombo')}
              isDisabled={isEditMode}
              id="is-combo-switch"
            />
            <FormLabel htmlFor="is-combo-switch" mb="0" ml="4">
              {t('resources.form.combo.switch.label')}
            </FormLabel>
          </FormControl>
          {isCombo && (
            <Box bg="gray.100" p="4">
              <Text fontSize="sm">
                {t('resources.form.combo.select.helper')}
              </Text>
              <Center mt="4">
                <Wrap>
                  {resourcesForCombo
                    ? resourcesForCombo.map((res) => (
                        <Tag colorScheme="green" key={res._id}>
                          <TagLabel fontWeight="bold">
                            {res.label.toUpperCase()}
                          </TagLabel>
                          <TagCloseButton
                            onClick={() => onRemoveResourceForCombo(res)}
                          />
                        </Tag>
                      ))
                    : []}
                </Wrap>
              </Center>
              <Center>
                <Select
                  bg="white"
                  m="4"
                  placeholder={t('resources.form.combo.select.holder')}
                  onChange={onAddResourceForCombo}
                >
                  {suggestions.map((resource) => (
                    <option key={resource.label} value={resource._id}>
                      {resource.label}
                    </option>
                  ))}
                </Select>
              </Center>
            </Box>
          )}

          <FormField label={t('resources.form.name.label')}>
            <Input
              {...register('label')}
              placeholder={t('resources.form.name.holder')}
              size="sm"
            />
          </FormField>

          <FormField label={t('resources.form.desc.label')}>
            <Textarea
              {...register('description')}
              placeholder={t('resources.form.desc.holder')}
              size="sm"
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
    </Box>
  );
}

export default ResourceForm;
