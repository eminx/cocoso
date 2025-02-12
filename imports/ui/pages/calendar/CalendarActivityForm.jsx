import React, { useEffect, useState } from 'react';
import { Box, Checkbox, FormLabel, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import AutoCompleteSelect from 'react-select';
import makeAnimated from 'react-select/animated';

import { call } from '../../utils/shared';
import GenericEntryForm from '../../forms/GenericEntryForm';
import FormField from '../../forms/FormField';
import DatesAndTimes, { emptyDateAndTime } from '../../forms/DatesAndTimes';
import calendarActivityFormFields from './calendarActivityFormFields';

const animatedComponents = makeAnimated();

export const emptyFormValues = {
  longDescription: '',
  title: '',
};

export default function CalendarActivityForm({ activity, onFinalize }) {
  const [state, setState] = useState({
    datesAndTimes: activity
      ? activity.datesAndTimes?.map((d) => ({
          ...d,
          isRange: d?.startDate !== d?.endDate,
        }))
      : [emptyDateAndTime],
    formValues: activity || emptyFormValues,
    selectedResource: activity ? { label: activity.resource, value: activity.resourceId } : null,
    isCreating: false,
    isExclusiveActivity: activity ? activity.isExclusiveActivity : true,
    isSendingForm: false,
    isSuccess: false,
    resources: [],
  });

  const [t] = useTranslation('activities');

  const getResources = async () => {
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
    getResources();
  }, []);

  useEffect(() => {
    if (activity) {
      setState((prevState) => ({
        ...prevState,
        formValues: {
          ...prevState.formValues,
          ...activity,
        },
        datesAndTimes: activity.datesAndTimes?.map((d) => ({
          ...d,
          isRange: d?.startDate !== d?.endDate,
        })),
        selectedResource: {
          label: activity.resource,
          _id: activity.resourceId,
        },
      }));
    }
  }, [activity]);

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

  const parseActivity = async () => {
    const cleanDatesAndTimes = state.datesAndTimes.map(
      ({ startTime, endTime, startDate, endDate }) => ({
        startDate,
        endDate,
        startTime,
        endTime,
      })
    );

    const newActivity = {
      ...state.formValues,
      datesAndTimes: cleanDatesAndTimes,
      isPublicActivity: false,
      isExclusiveActivity: state.isExclusiveActivity,
    };

    const { selectedResource } = state;

    if (selectedResource) {
      newActivity.resourceId = selectedResource._id;
      newActivity.resource = selectedResource.label;
    }

    onFinalize(newActivity);
  };

  useEffect(() => {
    if (!state.isCreating) {
      return;
    }
    parseActivity();
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
      isSendingForm: true,
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

  return (
    <>
      <Heading mb="4" size="md">
        {t('form.details.label')}
      </Heading>

      <GenericEntryForm
        childrenIndex={1}
        defaultValues={activity || emptyFormValues}
        formFields={calendarActivityFormFields(t)}
        onSubmit={handleSubmit}
      >
        <FormField helperText={t('form.exclusive.helper')} label={t('form.exclusive.label')} my="4">
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
      </GenericEntryForm>
    </>
  );
}
