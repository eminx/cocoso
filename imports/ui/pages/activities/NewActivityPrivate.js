import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { parse } from 'query-string';
import { useTranslation } from 'react-i18next';

import ActivityForm from '../../forms/ActivityFormPublic';
import Template from '../../layout/Template';
import { Alert, message } from '../../generic/message';
import {
  call,
  compareDatesWithStartDateForSort,
  checkAndSetBookingsWithConflict,
  getAllBookingsWithSelectedResource,
  parseAllBookingsWithResources,
} from '../../utils/shared';
import { StateContext } from '../../LayoutContainer';
import FormTitle from '../../forms/FormTitle';
import FormSwitch from '../../forms/FormSwitch';

const defaultCapacity = 40;
const today = new Date().toISOString().substring(0, 10);
const emptyDateAndTime = {
  startDate: today,
  endDate: today,
  startTime: '00:00',
  endTime: '23:59',
  attendees: [],
  capacity: defaultCapacity,
  isRange: false,
  conflict: null,
};

export default function NewActivityPrivate() {
  const [state, setState] = useState({
    allBookings: [],
    formValues: null,
    datesAndTimes: null,
    isCreating: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    isExclusiveActivity: true,
    newActivityId: null,
    resources: [],
    isReady: false,
  });

  const [t] = useTranslation('activities');
  const [tc] = useTranslation('common');
  const location = useLocation();
  const { search } = location;
  const { canCreateContent, currentUser } = useContext(StateContext);

  if (!currentUser || !canCreateContent) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <Alert
          message={tc('message.access.contributor', {
            domain: 'an activity',
          })}
          type="error"
        />
      </div>
    );
  }

  const { datesAndTimes, formValues, isExclusiveActivity, selectedResource } = state;

  const getData = async () => {
    try {
      const resources = await call('getResources');
      const allActivities = await call('getAllActivities');
      const allBookings = parseAllBookingsWithResources(allActivities, resources);
      setState((prevState) => ({
        ...prevState,
        allBookings,
        resources,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const { allBookings, resources } = state;

  const setInitialValuesWithQueryParams = () => {
    const params = parse(search);

    if (!params) {
      setState((prevState) => ({
        ...prevState,
        isReady: true,
      }));
      return;
    }

    const defaultBooking = {
      ...emptyDateAndTime,
      ...params,
      isRange: params?.startDate && params?.endDate && params.startDate !== params.endDate,
    };

    const initialValues = {
      ...formValues,
      resourceId: params.resource,
    };

    const newSelectedResource = resources?.find((r) => r._id === params.resource);

    setState((prevState) => ({
      ...prevState,
      formValues: initialValues,
      datesAndTimes: [defaultBooking],
      selectedResource: newSelectedResource,
      isReady: true,
    }));
  };

  useEffect(() => {
    setInitialValuesWithQueryParams();
  }, [allBookings, resources, search]);

  const validateBookings = () => {
    if (!selectedResource || !datesAndTimes || datesAndTimes.length === 0) {
      return;
    }

    const allBookingsWithSelectedResource = getAllBookingsWithSelectedResource(
      selectedResource,
      allBookings
    );

    const selectedBookingsWithConflict = checkAndSetBookingsWithConflict(
      datesAndTimes,
      allBookingsWithSelectedResource
    );

    const selectedBookingsWithConflictButNotExclusive = selectedBookingsWithConflict.map((item) => {
      const booking = { ...item };
      if (item.conflict) {
        booking.isConflictOK = !item.conflict.isExclusiveActivity && !isExclusiveActivity;
      }
      return booking;
    });

    setState((prevState) => ({
      ...prevState,
      datesAndTimes: selectedBookingsWithConflictButNotExclusive,
    }));
  };

  useEffect(() => {
    validateBookings();
  }, [selectedResource, datesAndTimes, isExclusiveActivity]);

  const successCreation = () => {
    message.success(tc('message.success.create'));
  };

  const createActivity = async () => {
    const datesAndTimesNoConflict = datesAndTimes.map((item) => ({
      startDate: item.startDate,
      endDate: item.endDate,
      startTime: item.startTime,
      endTime: item.endTime,
      isRange: item.isRange,
      capacity: item.capacity,
      attendees: [],
    }));

    const datesAndTimesNoConflictSorted = datesAndTimesNoConflict.sort(
      compareDatesWithStartDateForSort
    );

    const values = {
      ...formValues,
      datesAndTimes: datesAndTimesNoConflictSorted,
      isExclusiveActivity,
      isPublicActivity: false,
    };

    try {
      const newActivityId = await call('createActivity', values);
      setState((prevState) => ({
        ...prevState,
        isCreating: false,
        newActivityId,
        isSuccess: true,
      }));
      successCreation();
    } catch (error) {
      message.error(error.error || error.reason);
      setState((prevState) => ({
        ...prevState,
        isCreating: false,
        isError: true,
      }));
    }
  };

  const handleSubmit = (values) => {
    const { uploadableImages } = state;

    const newFormValues = {
      ...values,
      resource: selectedResource?.label,
      resourceIndex: selectedResource?.resourceIndex,
    };
    if (selectedResource) {
      formValues.resourceIndex = selectedResource.resourceIndex;
    }

    if (!uploadableImages || uploadableImages.length === 0) {
      message.error(tc('message.error.imageRequired'));
      return;
    }

    setState((prevState) => ({
      ...prevState,
      isCreating: true,
      formValues: newFormValues,
    }));
    createActivity();
  };

  const setDatesAndTimes = (newDatesAndTimes) => {
    setState((prevState) => ({
      ...prevState,
      datesAndTimes: newDatesAndTimes,
    }));
  };

  const handleExclusiveSwitch = (event) => {
    const value = event.target.checked;
    setState({
      ...state,
      isExclusiveActivity: value,
    });
  };

  const handleSelectedResource = (value) => {
    const newSelectedResource = resources.find((r) => r._id === value);
    setState({
      ...state,
      selectedResource: newSelectedResource,
    });
  };

  const isFormValid = () => {
    const isConflictHard = datesAndTimes.some(
      (occurence) => Boolean(occurence.conflict) && !occurence.isConflictOK
    );

    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    const isTimesInValid = datesAndTimes.some(
      (dateTime) => !regex.test(dateTime.startTime) || !regex.test(dateTime.endTime)
    );

    return !isTimesInValid && !isConflictHard;
  };

  const { isSuccess, isCreating, isReady, newActivityId } = state;

  if (isSuccess) {
    return <Navigate to={`/activities/${newActivityId}`} />;
  }

  if (!isReady) {
    return null;
  }

  const formValid = isFormValid();

  return (
    <Box>
      <FormTitle context="activities" isCalendar={false} isNew />
      <Template>
        <Box mb="8">
          <FormSwitch
            isChecked={state.isExclusiveActivity}
            label={t('form.switch.exclusive')}
            onChange={handleExclusiveSwitch}
          />
        </Box>

        <ActivityForm
          datesAndTimes={datesAndTimes}
          defaultValues={formValues}
          isButtonDisabled={!formValid || isCreating}
          isSubmitting={isCreating}
          resources={resources}
          onSubmit={handleSubmit}
          setDatesAndTimes={setDatesAndTimes}
          setSelectedResource={handleSelectedResource}
        />
      </Template>
    </Box>
  );
}
