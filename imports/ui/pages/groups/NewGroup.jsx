import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { call } from '../../utils/shared';
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

export default function NewGroup() {
  const [state, setState] = useState({
    formValues: emptyFormValues,
    isCreating: false,
    isSendingForm: false,
    isSuccess: false,
    isUploadingImages: false,
  });

  const navigate = useNavigate();
  const [t] = useTranslation('groups');
  const [tc] = useTranslation('common');

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

  const createGroup = async (images) => {
    try {
      const newEntryId = await call('createGroup', {
        ...state.formValues,
        imageUrl: images && images[0],
      });
      // message.success(t('form.success'));
      navigate(`/groups/${newEntryId}`);
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

    createGroup(images);
  };

  return (
    <>
      <Heading mb="4" size="md">
        {/* {t('form.details.label')} */}
        Enter the details
      </Heading>

      <GenericEntryForm
        childrenIndex={3}
        defaultValues={emptyFormValues}
        formFields={groupFormFields(t)}
        onSubmit={handleSubmit}
      >
        <FormField helperText={t('form.image.helper')} label={t('form.image.label')}>
          <ImageUploader
            isMultiple={false}
            ping={state.isUploadingImages}
            onUploadedImages={handleUploadedImages}
          />
        </FormField>
      </GenericEntryForm>
    </>
  );
}
