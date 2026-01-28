import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';

import GenericEntryForm from '/imports/ui/forms/GenericEntryForm';
import ImageUploader from '/imports/ui/forms/ImageUploader';
import FormField from '/imports/ui/forms/FormField';
import { loaderAtom } from '/imports/ui/utils/loaderHandler';

import pageFormFields from './pageFormFields';

interface PageFormValues {
  longDescription: string;
  title: string;
}

interface PageData extends PageFormValues {
  images?: string[];
  order?: number;
}

interface PageFormProps {
  page?: PageData;
  onFinalize: (page: PageData) => void;
}

export const emptyFormValues: PageFormValues = {
  longDescription: '',
  title: '',
};

export default function PageForm({ page, onFinalize }: PageFormProps) {
  const [state, setState] = useState({
    formValues: page || emptyFormValues,
  });
  const [loaders, setLoaders] = useAtom(loaderAtom);
  const [t] = useTranslation('admin');

  useEffect(() => {
    if (!loaders?.isCreating) {
      return;
    }
    setLoaders((prevState) => ({
      ...prevState,
      isUploadingImages: true,
    }));
  }, [loaders?.isCreating]);

  const handleSubmit = (formValues: PageFormValues) => {
    setState((prevState) => ({
      ...prevState,
      formValues,
    }));
    setLoaders((prevState) => ({
      ...prevState,
      isCreating: true,
    }));
  };

  const parsePage = async (images: string[]) => {
    const newPage: PageData = {
      ...state.formValues,
      images,
    };
    onFinalize(newPage);
  };

  const handleUploadedImages = (images: string[]) => {
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
        helper={t('pages.form.images.helper')}
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
