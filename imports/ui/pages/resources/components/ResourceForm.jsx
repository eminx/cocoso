import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
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

import { call } from '../../../@/shared';
import { message } from '../../../components/message';
import FormField from '../../../components/FormField';

function ResourceForm({ defaultValues, isEditMode, history }) {
  const [ resourceLabels, setResourceLabels ] = useState([]);
  // const [ isLoading, setIsLoading ] = useState(true);
  const [ resourcesForCombo, setResourcesForCombo ] = useState(defaultValues?.resourcesForCombo);
  
  const { formState, handleSubmit, getValues, register } = useForm({ defaultValues });
  const { isDirty, isSubmitting } = formState;
  const isCombo = getValues('isCombo');

  const [ t ] = useTranslation('admin');
  const [ tc ] = useTranslation('common');

  useEffect(() => {
    getResourceLabels();
  }, []);

  const getResourceLabels = async () => {
    try {
      const response = await call('getResourceLabels');
      setResourceLabels(response);
      // setIsLoading(false);
    } catch (error) {
      message.error(error.reason);
      // setIsLoading(false);
    }
  };

  // const checkResourceNameExists = () => {
  //   if (isEditMode) return false;
  //   return resources.some(
  //     (resource) => resource.label.toLowerCase() === defaultValues.label.toLowerCase()
  //   );
  // } 
  const onSubmit = async (values) => {
    // console.log(checkResourceNameExists())
    // if (!values.label || values.label.length < 3) {
    //   message.error(tc('message.valid.min', { field: 'resource name', min: '3' }));
    //   return;
    // }
    // if (checkResourceNameExists()) {
    //   message.error(tc('message.exists', { domain: tc('domains.resource').toLowerCase(), property: tc('domains.props.name') }));
    //   return;
    // }
    try 
    {
      if (isEditMode) 
      {
        await call('updateResource', values.id, values);
        message.success(tc('message.success.update', { domain: tc('domains.resource') }));
      } 
      else 
      {
        const newResource = await call('createResource', { ...values, resourcesForCombo });
        // console.log(newResource);
        message.success(tc('message.success.create', { domain: tc('domains.resource') }));
        if(newResource) history.push('/resources/'+newResource);
      }
    } 
    catch (error) 
    {
      console.log(error);
      message.error(error.reason || error.error);
    }
  };
  
  const handleAddResourceForCombo = ({ target }) => {
    const { value } = target;
    const selectedResource = resourceLabels.find((r) => r._id === value);
    setResourcesForCombo([...resourcesForCombo, selectedResource]);
  };

  const handleRemoveResourceForCombo = (res) => {
    const newResourcesForCombo = resourcesForCombo.filter(
      (resource) => res.label !== resource.label
    );
    setResourcesForCombo(newResourcesForCombo);
  };

  const suggestions = () => {
    return resourceLabels.filter((res, index) => {
      return (
        !res.isCombo && !resourcesForCombo.some((r) => r.label === res.label)
      );
    });
  };

  return (
    <Box>
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
                            onClick={() => handleRemoveResourceForCombo(res)}
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
                  onChange={handleAddResourceForCombo}
                >
                  {suggestions().map((resource) => (
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
