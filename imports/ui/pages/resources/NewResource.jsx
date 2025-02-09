import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Checkbox, Flex, FormLabel, Heading, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import AutoCompleteSelect from 'react-select';
import makeAnimated from 'react-select/animated';

import { call } from '../../utils/shared';
import GenericEntryForm from '../../forms/GenericEntryForm';
import ImageUploader from '../../forms/ImageUploader';
import FormField from '../../forms/FormField';
import resourceFormFields from './resourceFormFields';

export const emptyFormValues = {
  label: '',
  description: '',
  isBookable: true,
};

const animatedComponents = makeAnimated();

export default function NewResource() {
  const [state, setState] = useState({
    formValues: emptyFormValues,
    isCombo: false,
    resourcesForCombo: [],
    isCreating: false,
    isSendingForm: false,
    isSuccess: false,
    isUploadingImages: false,
    resources: [],
  });

  const navigate = useNavigate();
  const [t] = useTranslation('resources');
  const [tc] = useTranslation('common');

  const getResources = async () => {
    try {
      const resources = await call('getResourcesDry');
      setState((prevState) => ({
        ...prevState,
        resources,
      }));
    } catch (error) {
      message.error(error.reason);
    }
  };

  useEffect(() => {
    getResources();
    // setResourcesForCombo(defaultValues && defaultValues.isCombo && defaultValues.resourcesForCombo);
  }, []);

  useEffect(() => {
    if (!state.isCreating) {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      isUploadingImages: true,
    }));
  }, [state.isCreating]);

  const handleSubmit = (formValues) => {
    setState((prevState) => ({
      ...prevState,
      formValues: {
        ...formValues,
        capacity: Number(formValues.capacity),
      },
      isCreating: true,
    }));
  };

  const createResource = async (images) => {
    try {
      const newEntryId = await call('createResource', {
        ...state.formValues,
        images,
        isCombo: state.isCombo,
        resourcesForCombo: state.resourcesForCombo,
      });
      // message.success(t('form.success'));
      navigate(`/resources/${newEntryId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadedImages = (images) => {
    setState((prevState) => ({
      ...prevState,
      isUploadingImages: false,
      isSendingForm: true,
    }));

    createResource(images);
  };

  const handleAutoCompleteSelectChange = (newValue, actionMeta) => {
    setState((prevState) => ({
      ...prevState,
      resourcesForCombo: newValue,
    }));
  };

  const autoCompleteOptions = state.resources
    ?.filter((r) => !r.isCombo)
    .map((r) => ({
      _id: r._id,
      label: r.label,
    }));

  return (
    <>
      <Heading mb="4" size="md">
        {/* {t('form.details.label')} */}
        Enter the details
      </Heading>

      <GenericEntryForm
        childrenIndex={1}
        defaultValues={emptyFormValues}
        formFields={resourceFormFields(t)}
        onSubmit={handleSubmit}
      >
        <FormField helperText={t('form.image.helper')} label={t('form.image.label')} mb="12">
          <ImageUploader
            isMultiple={false}
            ping={state.isUploadingImages}
            onUploadedImages={handleUploadedImages}
          />
        </FormField>

        <FormField
          helperText={t('form.combo.switch.helper')}
          label={t('form.combo.switch.label')}
          mt="6"
          mb="12"
        >
          <Box display="inline" bg="white" borderRadius="lg" p="1" pl="2">
            <Checkbox
              isChecked={state.isCombo}
              size="lg"
              onChange={(e) =>
                setState((prevState) => ({ ...prevState, isCombo: e.target.checked }))
              }
            >
              <FormLabel style={{ cursor: 'pointer' }} mb="0">
                {tc('labels.select')}
              </FormLabel>
            </Checkbox>
          </Box>
          {state.isCombo && (
            <Box w="100%" pt="2">
              <Text fontSize="sm" mb="2">
                {t('form.combo.select.helper')}
              </Text>
              <AutoCompleteSelect
                isMulti
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={state.resourcesForCombo}
                options={autoCompleteOptions}
                placeholder={t('form.combo.select.holder')}
                style={{ width: '100%', marginTop: '1rem' }}
                getOptionValue={(option) => option._id}
                onChange={handleAutoCompleteSelectChange}
              />
            </Box>
          )}
        </FormField>
      </GenericEntryForm>
    </>
  );
}
