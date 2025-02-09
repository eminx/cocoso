import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '@chakra-ui/react';
import { parse } from 'query-string';
import { useTranslation } from 'react-i18next';
import AutoCompleteSelect from 'react-select';
import makeAnimated from 'react-select/animated';

import { Alert, message } from '../../generic/message';
import { call } from '../../utils/shared';
import { StateContext } from '../../LayoutContainer';
import GenericEntryForm from '../../forms/GenericEntryForm';
import ImageUploader from '../../forms/ImageUploader';
import FormField from '../../forms/FormField';
import DatesAndTimes from '../../forms/DatesAndTimes';
import publicActivityFormFields from './publicActivityFormFields';
import { emptyDateAndTime } from '../../forms/DatesAndTimes';

const animatedComponents = makeAnimated();
const defaultCapacity = 40;
const maxAttendees = 1000;

export const emptyFormValues = {
  title: '',
  subTitle: '',
  longDescription: '',
  place: '',
  address: '',
  // capacity: defaultCapacity,
  isRegistrationEnabled: true,
  isExclusiveActivity: false,
};

export default function NewPublicActivity() {
  const [state, setState] = useState({
    datesAndTimes: [emptyDateAndTime],
    formValues: emptyFormValues,
    selectedResource: null,
    isCreating: false,
    isSendingForm: false,
    isSuccess: false,
    isUploadingImages: false,
    resources: [],
  });

  const navigate = useNavigate();
  const [t] = useTranslation('activities');
  const [tc] = useTranslation('common');

  const getResouces = async () => {
    try {
      const resources = await call('getResourcesDry');
      setState((prevState) => ({
        ...prevState,
        resources: resources.filter((r) => r.isBookable),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getResouces();
  }, []);

  const isFormValid = () => {
    const { datesAndTimes } = state;
    const isConflictHard = datesAndTimes.some(
      (occurence) => Boolean(occurence.conflict) && !occurence.isConflictOK
    );

    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    const isTimesInValid = datesAndTimes.some(
      (dateTime) => !regex.test(dateTime.startTime) || !regex.test(dateTime.endTime)
    );

    return !isTimesInValid && !isConflictHard;
  };

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
    if (!isFormValid()) {
      // message.error(t('form.error'));
      return;
    }
    setState((prevState) => ({
      ...prevState,
      formValues,
      isCreating: true,
    }));
  };

  const handleDatesAndTimesChange = (datesAndTimes) => {
    setState((prevState) => ({
      ...prevState,
      datesAndTimes,
    }));
  };

  const handleSelectResource = (selectedResource) => {
    setState((prevState) => ({
      ...prevState,
      selectedResource,
    }));
  };

  const createActivity = async (images) => {
    try {
      const newEntryId = await call('createActivity', {
        ...state.formValues,
        datesAndTimes: state.datesAndTimes,
        images,
        isPublicActivity: true,
      });
      // message.success(t('form.success'));
      navigate(`/activities/${newEntryId}`);
    } catch (error) {
      console.log(error);
      setState((prevState) => ({
        ...prevState,
        isCreating: false,
        isSendingForm: false,
      }));
    }
  };

  const handleUploadedImages = (images) => {
    setState((prevState) => ({
      ...prevState,
      isUploadingImages: false,
      isSendingForm: true,
    }));

    createActivity(images);
  };

  return (
    <>
      <Heading mb="4" size="md">
        {t('form.details.label')}
      </Heading>

      <GenericEntryForm
        childrenIndex={2}
        defaultValues={emptyFormValues}
        formFields={publicActivityFormFields(t)}
        onSubmit={handleSubmit}
      >
        <FormField
          helperText={t('form.image.helper')}
          isRequired
          label={t('form.image.label')}
          mt="4"
          mb="8"
        >
          <ImageUploader ping={state.isUploadingImages} onUploadedImages={handleUploadedImages} />
        </FormField>

        <FormField helperText={t('form.resource.helper')} label={t('form.resource.label')} my="12">
          <AutoCompleteSelect
            isClearable
            onChange={handleSelectResource}
            components={animatedComponents}
            options={state.resources}
            placeholder={t('form.resource.holder')}
            style={{ width: '100%', marginTop: '1rem' }}
            styles={{
              option: (styles, { data }) => ({
                ...styles,
                fontWeight: data.isCombo ? 'bold' : 'normal',
                'content:after': data.isCombo ? ' (combo)' : '',
              }),
            }}
            value={state.selectedResource}
            getOptionValue={(option) => option._id}
          />
        </FormField>

        <FormField
          helperText="Select the dates and time. Click + for more occurrences"
          label="Date and Time"
          mb="14"
          isRequired
        >
          <DatesAndTimes
            datesAndTimes={state.datesAndTimes}
            onDatesAndTimesChange={handleDatesAndTimesChange}
          />
        </FormField>
      </GenericEntryForm>
    </>
  );
}
