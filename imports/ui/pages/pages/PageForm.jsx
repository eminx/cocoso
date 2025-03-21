import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import GenericEntryForm from '../../forms/GenericEntryForm';
import ImageUploader from '../../forms/ImageUploader';
import FormField from '../../forms/FormField';
import pageFormFields from './pageFormFields';
import { LoaderContext } from '../../listing/NewEntryHandler';

export const emptyFormValues = {
  longDescription: '',
  title: '',
};

export default function PageForm({ page, onFinalize }) {
  const [state, setState] = useState({
    formValues: page || emptyFormValues,
  });
  const { loaders, setLoaders } = useContext(LoaderContext);
  const [t] = useTranslation('admin');

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

  const parsePage = async (images) => {
    const newPage = {
      ...state.formValues,
      images,
    };
    onFinalize(newPage);
  };

  const handleUploadedImages = (images) => {
    setLoaders((prevState) => ({
      ...prevState,
      isSendingForm: true,
    }));

    parsePage(images);
  };

  return (
    <GenericEntryForm
      childrenIndex={1}
      defaultValues={page || emptyFormValues}
      formFields={pageFormFields(t)}
      onSubmit={handleSubmit}
    >
      <FormField
        helperText={t('pages.form.images.helper')}
        label={t('pages.form.images.label')}
        my="4"
      >
        <ImageUploader
          ping={loaders?.isUploadingImages}
          preExistingImages={page ? page.images : []}
          onUploadedImages={handleUploadedImages}
        />
      </FormField>
    </GenericEntryForm>
  );
}
