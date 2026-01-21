import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AutoCompleteSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import { useAtom } from 'jotai';

import { Box, Checkbox } from '/imports/ui/core';
import { call } from '/imports/api/_utils/shared';
import GenericEntryForm from '/imports/ui/forms/GenericEntryForm';
import FormField from '/imports/ui/forms/FormField';
import DatesAndTimes, {
  emptyDateAndTime,
} from '/imports/ui/forms/DatesAndTimes';
import { loaderAtom } from '/imports/ui/utils/loaderHandler';
import type { SelectedResource, DateAndTime } from '/imports/ui/types';

import calendarActivityFormFields from './calendarActivityFormFields';

const animatedComponents = makeAnimated();

interface CalendarActivityFormValues {
  title: string;
  longDescription: string;
}

interface CalendarActivity extends CalendarActivityFormValues {
  _id?: string;
  datesAndTimes: DateAndTime[];
  resource?: string;
  resourceId?: string;
  isExclusiveActivity?: boolean;
}

interface CalendarActivityFormProps {
  activity?: CalendarActivity;
  onFinalize: (activity: CalendarActivity) => void;
}

export const emptyFormValues: CalendarActivityFormValues = {
  longDescription: '',
  title: '',
};

export default function CalendarActivityForm({ activity, onFinalize }: CalendarActivityFormProps) {
  const [state, setState] = useState<{
    datesAndTimes: DateAndTime[];
    formValues: CalendarActivityFormValues;
    selectedResource: SelectedResource | null;
    isExclusiveActivity: boolean;
    resources: SelectedResource[];
  }>({
    datesAndTimes: activity ? activity.datesAndTimes : [emptyDateAndTime],
    formValues: activity || emptyFormValues,
    selectedResource: activity
      ? { label: activity.resource || '', _id: activity.resourceId || '', value: activity.resourceId }
      : null,
    isExclusiveActivity: activity ? activity.isExclusiveActivity || true : true,
    resources: [],
  });
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  const [loaders, setLoaders] = useAtom(loaderAtom);
  const [t] = useTranslation('activities');

  const getResources = async () => {
    try {
      const resources = await call('getResourcesDry');
      setState((prevState) => ({
        ...prevState,
        resources: resources.filter((r: SelectedResource) => r.isBookable),
      }));
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getResources();
  }, []);

  useEffect(() => {
    if (!activity) {
      return;
    }
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
  }, [activity]);

  const isFormValid = () => {
    const { datesAndTimes } = state;
    const isConflictHard = datesAndTimes.some(
      (occurrence) => Boolean(occurrence.conflict) && occurrence.isConflictHard
    );

    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    const isTimesInValid = datesAndTimes.some(
      (dateTime) =>
        !regex.test(dateTime.startTime) || !regex.test(dateTime.endTime)
    );

    setIsSubmitButtonDisabled(isTimesInValid || isConflictHard);
  };

  useEffect(() => {
    isFormValid();
  }, [state.datesAndTimes, state.selectedResource, state.isExclusiveActivity]);

  const parseActivity = async () => {
    const sortedDatesAndTimes = state.datesAndTimes.sort((a, b) => {
      const dateA = new Date(`${a.startDate}T${a.startTime}:00Z`);
      const dateB = new Date(`${b.startDate}T${b.startTime}:00Z`);
      return dateA - dateB;
    });

    const cleanDatesAndTimes = sortedDatesAndTimes.map(
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
    if (!loaders?.isCreating) {
      return;
    }
    parseActivity();
  }, [loaders?.isCreating]);

  const handleSubmit = (formValues: CalendarActivityFormValues) => {
    setState((prevState) => ({
      ...prevState,
      formValues,
    }));
    setLoaders((prevState) => ({
      ...prevState,
      isCreating: true,
      isSendingForm: true,
    }));
  };

  const handleDatesAndTimesChange = (datesAndTimes: DateAndTime[]) => {
    setState((prevState) => ({
      ...prevState,
      datesAndTimes,
    }));
  };

  const handleSelectResource = (selectedResource: SelectedResource | null) => {
    setState((prevState) => ({
      ...prevState,
      selectedResource,
    }));
  };

  const handleExclusiveSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      isExclusiveActivity: e.target.checked,
    }));
  };

  return (
    <GenericEntryForm
      childrenIndex={1}
      defaultValues={activity || emptyFormValues}
      formFields={calendarActivityFormFields(t)}
      isSubmitButtonDisabled={isSubmitButtonDisabled}
      onSubmit={handleSubmit}
    >
      <FormField
        helper={t('form.exclusive.helper')}
        label={t('form.exclusive.label')}
        my="4"
      >
        <Box bg="white" borderRadius="lg" display="inline" p="2">
          <Checkbox
            checked={state.isExclusiveActivity}
            id="is-exclusive-activity"
            size="lg"
            onChange={handleExclusiveSwitch}
          >
            {t('form.exclusive.holder')}
          </Checkbox>
        </Box>
      </FormField>

      <FormField
        helper={t('form.resource.helper')}
        label={t('form.resource.label')}
        my="12"
      >
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
        helper={t('form.occurrences.helper')}
        label={t('form.occurrences.label')}
        mb="14"
        required
      >
        <DatesAndTimes
          activityId={activity?._id}
          datesAndTimes={state.datesAndTimes}
          isExclusiveActivity={state.isExclusiveActivity}
          resourceId={state.selectedResource?._id}
          onDatesAndTimesChange={handleDatesAndTimesChange}
        />
      </FormField>
    </GenericEntryForm>
  );
}
