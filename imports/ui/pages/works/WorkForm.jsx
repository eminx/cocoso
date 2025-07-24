import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AutoCompleteSelect from 'react-select';
import makeAnimated from 'react-select/animated';

import { call } from '../../utils/shared';
import GenericEntryForm from '../../forms/GenericEntryForm';
import ImageUploader from '../../forms/ImageUploader';
import FormField from '../../forms/FormField';
import workFormFields from './workFormFields';
import { LoaderContext } from '../../listing/NewEntryHandler';
import { message } from '../../generic/message';

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

export default function WorkForm({ work, onFinalize }) {
  const [state, setState] = useState({
    categories: [],
    formValues: work || emptyFormValues,
    selectedCategory: work
      ? {
          label: work.category?.label,
          _id: work.category?.categoryId,
        }
      : null,
  });
  const { loaders, setLoaders } = useContext(LoaderContext);
  const [t] = useTranslation('members');
  const [tc] = useTranslation('common');

  const getCategories = async () => {
    try {
      const categories = await call('getCategories');
      setState((prevState) => ({
        ...prevState,
        categories,
      }));
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (!loaders || !loaders.isCreating) {
      return;
    }
    setLoaders((prevState) => ({
      ...prevState,
      isUploadingImages: true,
    }));
  }, [loaders?.isCreating]);

  const handleSubmit = (formValues) => {
    if (!state.selectedCategory) {
      message.error(t('message.categorymissing'));
      return;
    }
    setState((prevState) => ({
      ...prevState,
      formValues,
    }));
    setLoaders((prevState) => ({
      ...prevState,
      isCreating: true,
    }));
  };

  const parseWork = async (images) => {
    const selectedCategory = state.selectedCategory;
    const newWork = {
      ...state.formValues,
      category: {
        categoryId: selectedCategory._id,
        label: selectedCategory.label,
      },
      images,
    };
    onFinalize(newWork);
  };

  const handleUploadedImages = (images) => {
    setLoaders((prevState) => ({
      ...prevState,
      isSendingForm: true,
    }));

    parseWork(images);
  };

  const handleAutoCompleteSelectChange = (newValue) => {
    setState((prevState) => ({
      ...prevState,
      selectedCategory: newValue,
    }));
  };

  return (
    <GenericEntryForm
      childrenIndex={1}
      defaultValues={work || emptyFormValues}
      formFields={workFormFields(t, tc)}
      onSubmit={handleSubmit}
    >
      <FormField
        helperText={t('works.image.helper')}
        label={t('works.image.label')}
        my="4"
      >
        <ImageUploader
          ping={loaders?.isUploadingImages}
          preExistingImages={work ? work.images : []}
          onUploadedImages={handleUploadedImages}
        />
      </FormField>

      <FormField
        helperText={t('works.category.helper')}
        label={t('works.category.label')}
        mt="10"
        mb="12"
        required
      >
        <AutoCompleteSelect
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
  );
}
