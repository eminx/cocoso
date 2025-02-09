import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Checkbox, FormLabel, Heading, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import AutoCompleteSelect from 'react-select';
import makeAnimated from 'react-select/animated';

import { call } from '../../utils/shared';
import GenericEntryForm from '../../forms/GenericEntryForm';
import ImageUploader from '../../forms/ImageUploader';
import FormField from '../../forms/FormField';
import workFormFields from './workFormFields';
import { StateContext } from '../../LayoutContainer';

export const emptyFormValues = {
  additionalInfo: '',
  categoryId: '',
  contactInfo: '',
  longDescription: '',
  shortDescription: '',
  showAvatar: true,
  title: '',
};

const animatedComponents = makeAnimated();

export default function NewWork() {
  const [state, setState] = useState({
    formValues: emptyFormValues,
    isCreating: false,
    isSendingForm: false,
    isSuccess: false,
    isUploadingImages: false,
    categories: [],
  });

  const navigate = useNavigate();
  const [t] = useTranslation('members');
  const [tc] = useTranslation('common');
  const { currentUser } = useContext(StateContext);

  const getCategories = async () => {
    try {
      const categories = await call('getCategories');
      setState((prevState) => ({
        ...prevState,
        categories,
      }));
    } catch (error) {
      message.error(error.reason);
    }
  };

  getCategories(() => {
    getWorks();
    // setWorksForCombo(defaultValues && defaultValues.isCombo && defaultValues.worksForCombo);
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
      formValues,
      isCreating: true,
    }));
  };

  const createWork = async (images) => {
    const selectedCategory = state.selectedCategory;
    try {
      const newEntryId = await call(
        'createWork',
        {
          ...state.formValues,
          category: {
            categoryId: selectedCategory._id,
            color: selectedCategory.color,
            label: selectedCategory.label,
          },
          images,
        },
        'work'
      );
      // message.success(t('form.success'));
      navigate(`/@${currentUser.username}/works/${newEntryId}`);
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

    createWork(images);
  };

  const handleAutoCompleteSelectChange = (newValue, actionMeta) => {
    setState((prevState) => ({
      ...prevState,
      selectedCategory: newValue,
    }));
  };

  return (
    <>
      <Heading mb="4" size="md">
        {/* {t('form.details.label')} */}
        Enter the details
      </Heading>

      <GenericEntryForm
        childrenIndex={1}
        defaultValues={emptyFormValues}
        formFields={workFormFields(t, tc)}
        onSubmit={handleSubmit}
      >
        <FormField helperText={t('works.image.helper')} label={t('works.image.label')} my="4">
          <ImageUploader
            isMultiple={false}
            ping={state.isUploadingImages}
            onUploadedImages={handleUploadedImages}
          />
        </FormField>

        <FormField
          helperText={t('works.category.helper')}
          label={t('works.category.label')}
          mt="10"
          mb="12"
          isRequired
        >
          <AutoCompleteSelect
            // isMulti
            // closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={state.selectedCategory}
            options={state.categories}
            placeholder={t('works.category.holder')}
            style={{ width: '100%', marginTop: '1rem' }}
            getOptionValue={(option) => option._id}
            onChange={handleAutoCompleteSelectChange}
          />
        </FormField>
      </GenericEntryForm>
    </>
  );
}
