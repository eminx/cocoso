import React, { useContext, useEffect, useState } from 'react';
import { Box, Checkbox, FormLabel, NumberInput, NumberInputField } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import AutoCompleteSelect from 'react-select';
import makeAnimated from 'react-select/animated';

import { call } from '../../utils/shared';
import GenericEntryForm from '../../forms/GenericEntryForm';
import ImageUploader from '../../forms/ImageUploader';
import FormField from '../../forms/FormField';
import DatesAndTimes, { emptyDateAndTime } from '../../forms/DatesAndTimes';
import publicActivityFormFields from './publicActivityFormFields';
import { LoaderContext } from '../../listing/NewEntryHandler';
import { message } from '../../generic/message';

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

export default function PublicActivityForm({ activity, onFinalize }) {
  const [state, setState] = useState({
    capacity: activity ? activity.capacity : defaultCapacity,
    datesAndTimes: activity ? activity.datesAndTimes : [emptyDateAndTime],
    formValues: activity || emptyFormValues,
    selectedResource: activity ? { label: activity.resource, _id: activity.resourceId } : null,
    isExclusiveActivity: activity ? activity.isExclusiveActivity : true,
    isRegistrationEnabled: activity
      ? !activity.isRegistrationDisabled || activity.isRegistrationEnabled
      : true,
    resources: [],
  });
  const { loaders, setLoaders } = useContext(LoaderContext);
  const [t] = useTranslation('activities');
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  const getResources = async () => {
    try {
      const resources = await call('getResourcesDry');
      setState((prevState) => ({
        ...prevState,
        resources: resources.filter((r) => r.isBookable),
      }));
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    getResources();
  }, []);

  const isFormValid = () => {
    const { datesAndTimes } = state;
    const isConflictHard = datesAndTimes.some(
      (occurrence) => Boolean(occurrence.conflict) && occurrence.isConflictHard
    );

    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    const isTimesInValid = datesAndTimes.some(
      (dateTime) => !regex.test(dateTime.startTime) || !regex.test(dateTime.endTime)
    );

    setIsSubmitButtonDisabled(isTimesInValid || isConflictHard);
  };

  useEffect(() => {
    isFormValid();
  }, [state.datesAndTimes, state.selectedResource, state.isExclusiveActivity]);

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
    if (isSubmitButtonDisabled) {
      message.error(t('form.error'));
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
      isRegistrationEnabled: checked,
    }));
  };

  const handleCapacityChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      capacity: value,
    }));
  };

  const parseActivity = async (images) => {
    const sortedDatesAndTimes = state.datesAndTimes.sort((a, b) => {
      const dateA = new Date(`${a.startDate}T${a.startTime}:00Z`);
      const dateB = new Date(`${b.startDate}T${b.startTime}:00Z`);
      return dateA - dateB;
    });

    const cleanDatesAndTimes = sortedDatesAndTimes.map(
      ({ startTime, endTime, startDate, endDate, attendees }) => ({
        startDate,
        endDate,
        startTime,
        endTime,
        attendees: attendees || [],
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

    onFinalize(newActivity);
  };

  const handleUploadedImages = (images) => {
    setLoaders((prevState) => ({
      ...prevState,
      isSendingForm: true,
    }));

    parseActivity(images);
  };

  return (
    <GenericEntryForm
      childrenIndex={2}
      defaultValues={activity || emptyFormValues}
      formFields={publicActivityFormFields(t)}
      isSubmitButtonDisabled={isSubmitButtonDisabled}
      onSubmit={handleSubmit}
    >
      <FormField
        helperText={t('form.image.helper')}
        isRequired
        label={t('form.image.label')}
        mt="4"
        mb="8"
      >
        <ImageUploader
          preExistingImages={activity ? activity.images : []}
          ping={loaders.isUploadingImages}
          onUploadedImages={handleUploadedImages}
        />
      </FormField>

      <FormField
        helperText={t('form.exclusive.helper')}
        label={t('form.exclusive.label')}
        mt="8"
        mb="4"
      >
        <Box bg="white" borderRadius="lg" display="inline" p="2">
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
          activityId={activity?._id}
          datesAndTimes={state.datesAndTimes}
          isExclusiveActivity={state.isExclusiveActivity}
          resourceId={state.selectedResource?._id}
          onDatesAndTimesChange={handleDatesAndTimesChange}
        />
      </FormField>

      <FormField helperText={t('form.rsvp.helper')} label={t('form.rsvp.label')} mt="4" mb="10">
        <Box bg="white" borderRadius="lg" display="inline" p="2">
          <Checkbox isChecked={state.isRegistrationEnabled} size="lg" onChange={handleRsvpSwitch}>
            <FormLabel cursor="pointer" mb="0">
              {t('form.rsvp.holder')}
            </FormLabel>
          </Checkbox>
        </Box>
      </FormField>

      {(!state.isRegistrationDisabled || state.isRegistrationEnabled) && (
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
  );
}
