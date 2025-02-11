import React, { useEffect, useState } from 'react';
import { Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import GenericEntryForm from '../../forms/GenericEntryForm';
import ImageUploader from '../../forms/ImageUploader';
import FormField from '../../forms/FormField';
import groupFormFields from './groupFormFields';

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
    isCreating: false,
    isSendingForm: false,
    isSuccess: false,
    isUploadingImages: false,
  });

  const [t] = useTranslation('groups');

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

  const parseGroup = (imageUrl) => {
    const newGroup = {
      ...state.formValues,
      imageUrl,
    };

    onFinalize(newGroup);
  };

  const handleUploadedImages = (images) => {
    setState((prevState) => ({
      ...prevState,
      isUploadingImages: false,
      isSendingForm: true,
    }));

    parseGroup(images?.length && images[0]);
  };

  return (
    <>
      <Heading mb="4" size="md">
        {/* {t('form.details.label')} */}
        Enter the details
      </Heading>

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
            ping={state.isUploadingImages}
            preExistingImages={group ? [group.imageUrl] : []}
            onUploadedImages={handleUploadedImages}
          />
        </FormField>
      </GenericEntryForm>
    </>
  );
}
