import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import GenericEntryForm from '../../forms/GenericEntryForm';
import ImageUploader from '../../forms/ImageUploader';
import FormField from '../../forms/FormField';
import groupFormFields from './groupFormFields';
import { LoaderContext } from '../../listing/NewEntryHandler';

export const emptyFormValues = {
  isPrivate: false,
  title: '',
  readingMaterial: '',
  description: '',
  capacity: 40,
};

export default function GroupForm({ group, onFinalize }) {
  const [state, setState] = useState({
    formValues: group || emptyFormValues,
  });
  const { loaders, setLoaders } = useContext(LoaderContext);
  const [t] = useTranslation('groups');

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
      formValues: {
        ...formValues,
        capacity: Number(formValues.capacity),
      },
    }));
    setLoaders((prevState) => ({
      ...prevState,
      isCreating: true,
    }));
  };

  const parseGroup = (imageUrl) => {
    const newGroup = {
      ...state.formValues,
      imageUrl,
    };

    onFinalize(newGroup);
  };

  const handleUploadedImages = (images) => {
    setLoaders((prevState) => ({
      ...prevState,
      isSendingForm: true,
    }));

    parseGroup(images?.length && images[0]);
  };

  return (
    <GenericEntryForm
      childrenIndex={3}
      defaultValues={group || emptyFormValues}
      formFields={groupFormFields(t)}
      onSubmit={handleSubmit}
    >
      <FormField
        helperText={t('form.image.helper')}
        isRequired
        label={t('form.image.label')}
        mt="4"
        mb="12"
      >
        <ImageUploader
          isMultiple={false}
          ping={loaders?.isUploadingImages}
          preExistingImages={group ? [group.imageUrl] : []}
          onUploadedImages={handleUploadedImages}
        />
      </FormField>
    </GenericEntryForm>
  );
}
