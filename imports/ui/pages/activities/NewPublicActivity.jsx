import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Checkbox, FormLabel, Heading, NumberInput, NumberInputField } from '@chakra-ui/react';
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
  address: '',
  longDescription: '',
  place: '',
  subTitle: '',
  title: '',
};

export default function NewPublicActivity() {
  const [state, setState] = useState({
    capacity: defaultCapacity,
    datesAndTimes: [emptyDateAndTime],
    formValues: emptyFormValues,
    selectedResource: null,
    isCreating: false,
    isExclusiveActivity: true,
    isRegistrationDisabled: false,
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
      datesAndTimes: [emptyDateAndTime],
    }));
  };

  const handleExclusiveSwitch = (e) => {
    setState((prevState) => ({
      ...prevState,
      isExclusiveActivity: e.target.checked,
    }));
  };

  const handleRsvpSwitch = (e) => {
    const checked = e.target.checked;
    setState((prevState) => ({
      ...prevState,
      isRegistrationDisabled: !checked,
    }));
  };

  const handleCapacityChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      capacity: value,
    }));
  };

  const createActivity = async (images) => {
    const cleanDatesAndTimes = state.datesAndTimes.map(
      ({ startTime, endTime, startDate, endDate }) => ({
        startDate,
        endDate,
        startTime,
        endTime,
        attendees: [],
      })
    );

    const newActivity = {
      ...state.formValues,
      capacity: state.capacity,
      datesAndTimes: cleanDatesAndTimes,
      images,
      isPublicActivity: true,
      isRegistrationEnabled: state.isRegistrationEnabled,
      isExclusiveActivity: state.isExclusiveActivity,
    };

    const { selectedResource } = state;

    if (selectedResource) {
      newActivity.resourceId = selectedResource._id;
      newActivity.resource = selectedResource.label;
    }

    try {
      const newEntryId = await call('createActivity', newActivity);
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

        <FormField
          helperText={t('form.exclusive.helper')}
          label={t('form.exclusive.label')}
          mt="8"
          mb="4"
        >
          <Box display="inline" bg="white" borderRadius="lg" p="1" pl="2">
            <Checkbox
              isChecked={state.isExclusiveActivity}
              size="lg"
              onChange={handleExclusiveSwitch}
            >
              <FormLabel style={{ cursor: 'pointer' }} mb="0">
                {t('form.exclusive.holder')}
              </FormLabel>
            </Checkbox>
          </Box>
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
          helperText={t('form.occurrences.helper')}
          label={t('form.occurrences.label')}
          mb="14"
          isRequired
        >
          <DatesAndTimes
            datesAndTimes={state.datesAndTimes}
            isExclusiveActivity={state.isExclusiveActivity}
            resourceId={state.selectedResource?._id}
            onDatesAndTimesChange={handleDatesAndTimesChange}
          />
        </FormField>

        <FormField helperText={t('form.rsvp.helper')} label={t('form.rsvp.label')} mt="4" mb="10">
          <Box display="inline" bg="white" borderRadius="lg" p="1" pl="2">
            <Checkbox
              isChecked={!state.isRegistrationDisabled}
              size="lg"
              onChange={handleRsvpSwitch}
            >
              <FormLabel style={{ cursor: 'pointer' }} mb="0">
                {t('form.rsvp.holder')}
              </FormLabel>
            </Checkbox>
          </Box>
        </FormField>

        {!state.isRegistrationDisabled && (
          <FormField
            helperText={t('form.capacity.helper')}
            label={t('form.capacity.label')}
            mt="4"
            mb="12"
          >
            <NumberInput
              min={1}
              max={maxAttendees}
              value={state.capacity}
              onChange={handleCapacityChange}
            >
              <NumberInputField placeholder={t('form.capacity.label')} />
            </NumberInput>
          </FormField>
        )}
      </GenericEntryForm>
    </>
  );
}
