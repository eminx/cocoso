import React, { useContext, useEffect, useState } from 'react';
import { Box, Checkbox, FormLabel, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import AutoCompleteSelect from 'react-select';
import makeAnimated from 'react-select/animated';

import { call } from '../../utils/shared';
import GenericEntryForm from '../../forms/GenericEntryForm';
import ImageUploader from '../../forms/ImageUploader';
import FormField from '../../forms/FormField';
import resourceFormFields from './resourceFormFields';
import { message } from '../../generic/message';
import { LoaderContext } from '../../listing/NewEntryHandler';

export const emptyFormValues = {
  label: '',
  description: '',
  isBookable: true,
};

const animatedComponents = makeAnimated();

export default function ResourceForm({ resource, onFinalize }) {
  const [state, setState] = useState({
    formValues: resource || emptyFormValues,
    isCombo: resource ? resource.isCombo : false,
    resourcesForCombo: resource ? resource.resourcesForCombo : [],
    resources: [],
  });
  const { loaders, setLoaders } = useContext(LoaderContext);
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
  }, []);

  useEffect(() => {
    if (!loaders.isCreating) {
      return;
    }
    setLoaders((prevState) => ({
      ...prevState,
      isUploadingImages: true,
    }));
  }, [loaders?.isCreating]);

  const handleSubmit = (formValues) => {
    setState((prevState) => ({
      ...prevState,
      formValues,
    }));
    setLoaders((prevState) => ({
      ...prevState,
      isCreating: true,
    }));
  };

  const parseResource = async (images) => {
    const newResource = {
      ...state.formValues,
      images,
      isCombo: state.isCombo,
      resourcesForCombo: state.resourcesForCombo,
    };
    onFinalize(newResource);
  };

  const handleUploadedImages = (images) => {
    setLoaders((prevState) => ({
      ...prevState,
      isSendingForm: true,
    }));

    parseResource(images);
  };

  const handleAutoCompleteSelectChange = (newValue) => {
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
    <GenericEntryForm
      childrenIndex={1}
      defaultValues={resource || emptyFormValues}
      formFields={resourceFormFields(t)}
      onSubmit={handleSubmit}
    >
      <FormField helperText={t('form.image.helper')} label={t('form.image.label')} mb="12">
        <ImageUploader
          ping={loaders?.isUploadingImages}
          preExistingImages={resource ? resource.images : []}
          onUploadedImages={handleUploadedImages}
        />
      </FormField>

      <FormField
        helperText={t('form.combo.switch.helper')}
        label={t('form.combo.switch.label')}
        mt="6"
        mb="12"
      >
        <Box bg="white" borderRadius="lg" display="inline" p="2">
          <Checkbox
            isChecked={state.isCombo}
            size="lg"
            onChange={(e) => setState((prevState) => ({ ...prevState, isCombo: e.target.checked }))}
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
  );
}
