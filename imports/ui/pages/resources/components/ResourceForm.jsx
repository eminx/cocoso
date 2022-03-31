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

import { call, resizeImage, uploadImage } from '../../../@/shared';
import { message } from '../../../components/message';
import FormField from '../../../components/FormField';
import FileDropper from '../../../components/FileDropper';

function ResourceForm({ defaultValues, isEditMode, history }) {

  const [ resourceLabels, setResourceLabels ] = useState([]);
  const [ resourcesForCombo, setResourcesForCombo ] = useState(defaultValues?.resourcesForCombo);
  const imageUrl = defaultValues?.imageUrl;

  const [ uploadableImage, setUploadableImage ] = useState(null);
  const [ uploadableImageLocal, setUploadableImageLocal] = useState(null);
  
  const { formState, handleSubmit, getValues, register } = useForm({ defaultValues });
  const { isDirty, isSubmitting } = formState;
  const isCombo = getValues('isCombo');

  const [ t ] = useTranslation('admin');
  const [ tp ] = useTranslation('processes');
  const [ tc ] = useTranslation('common');

  useEffect(() => {
    getResourceLabels();
  }, []);

  const getResourceLabels = async () => {
    try {
      const response = await call('getResourceLabels');
      setResourceLabels(response);
    } catch (error) {
      message.error(error.reason);
    }
  };

  const handleUploadImage = async () => {
    if (uploadableImage !== null) {
      try {
        const resizedImage = await resizeImage(uploadableImage, 1200);
        const uploadedImageUrl = await uploadImage(resizedImage, 'processDocumentUpload');
        return uploadedImageUrl;
      } catch (error) {
        console.error('Error uploading:', error);
        message.error(error.reason);
      }
    }
  };

  const onSubmit = async (values) => {
    if (resourcesForCombo.length==0) values.isCombo = false; // if isCombo checked but no resource selected
    values.resourcesForCombo = resourcesForCombo.map(item => item._id);
    if (values.imageUrl!=='') values.imageUrl = await handleUploadImage()
    try {
      if (isEditMode) {
        await call('updateResource', defaultValues._id, values);
        message.success(tc('message.success.update', { domain: tc('domains.resource') }));
      } else {
        const newResource = await call('createResource', values);
        message.success(tc('message.success.create', { domain: tc('domains.resource') }));
        if(newResource) history.push('/resources/'+newResource);
      }
    } catch (error) {
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

  const setFileDropperImage = (files) => {
    if (files.length > 1) {
      message.error('Please drop only one file at a time.');
      return;
    }
    const uploadableImage = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadableImage);
    reader.addEventListener(
      'load',
      () => {
        setUploadableImage(uploadableImage);
        setUploadableImageLocal(reader.result);
      },
      false
    );
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

          <FormField
            label={tp('form.image.label')}
            helperText={(uploadableImageLocal || imageUrl) && tc('plugins.fileDropper.replace')}
          >
            <Center>
              <FileDropper
                imageUrl={imageUrl}
                setUploadableImage={setFileDropperImage}
                uploadableImageLocal={uploadableImageLocal}
              />
            </Center>
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
