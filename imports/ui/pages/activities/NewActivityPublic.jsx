import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heading } from '@chakra-ui/react';
import { parse } from 'query-string';
import { useTranslation } from 'react-i18next';

import { Alert, message } from '../../generic/message';
import {
  call,
  compareDatesWithStartDateForSort,
  parseAllBookingsWithResources,
} from '../../utils/shared';
import { StateContext } from '../../LayoutContainer';
import GenericEntryForm from '../../forms/GenericEntryForm';
import ImageUploader from '../../forms/ImageUploadUI';
import FormField from '../../forms/FormField';

const defaultCapacity = 40;

const today = new Date().toISOString().substring(0, 10);

const emptyDateAndTime = {
  startDate: today,
  endDate: today,
  startTime: '08:00',
  endTime: '10:00',
  attendees: [],
  capacity: defaultCapacity,
  isRange: false,
  conflict: null,
};

const publicActivityFormFields = [
  {
    label: 'Title',
    type: 'input',
    helper: 'enter title',
    value: 'title',
    placeholder: 'title...',
  },
  {
    label: 'Subtitle',
    type: 'input',
    helper: 'enter title',
    value: 'subTitle',
    placeholder: 'sub title...',
  },
  'pass',
  {
    label: 'Resource',
    type: 'select',
    helper: 'select a resource',
    value: 'resourceId',
    placeholder: 'resource...',
    options: [
      {
        label: 'Studio',
        value: '621063945278965636723456',
      },
      {
        label: 'Office',
        value: '621063923132132131223456',
      },
    ],
  },
  {
    label: 'Description',
    type: 'quill',
    helper: 'Enter description',
    value: 'longDescription',
    placeholder: 'long long text',
  },
  {
    label: 'People can rsvp',
    type: 'checkbox',
    helper: 'Check if people can register to event',
    value: 'isRegistrationDisabled',
  },
  {
    label: 'Location',
    type: 'textarea',
    helper: 'Enter location',
    value: 'location',
    placeholder: 'location...',
  },
  {
    label: 'Address',
    type: 'textarea',
    helper: 'Enter address',
    value: 'address',
    placeholder: 'address...',
  },
];

export default function NewActivityPublic() {
  const [state, setState] = useState({
    allBookings: [],
    uploadingImages: false,
    selectedResource: null,
    isError: false,
    resources: [],
    isReady: false,
  });

  const navigate = useNavigate();
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

  const { selectedResource } = state;

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
      ...state.formValues,
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
  }, [allBookings.length, resources.length, search]);

  const createActivity = async (imagesReadyToSave, newFormValues) => {
    const datesAndTimesNoConflict = state.datesAndTimes.map((item) => ({
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
      ...newFormValues,
      datesAndTimes: datesAndTimesNoConflictSorted,
      isExclusiveActivity: state.isExclusiveActivity,
      isPublicActivity: true,
      isRegistrationEnabled: state.isRegistrationEnabled,
      images: imagesReadyToSave,
    };

    try {
      const newActivityId = await call('createActivity', values);
      setState((prevState) => ({
        ...prevState,
        isCreating: false,
      }));
      message.success(tc('message.success.create'));
      navigate(`/activities/${newActivityId}`);
    } catch (error) {
      message.error(error.error || error.reason);
      console.log(error);
      setState((prevState) => ({
        ...prevState,
        isCreating: false,
        isError: true,
      }));
    }
  };

  const handleSubmit = (values) => {
    console.log('values', values);
    setState((prevState) => ({
      ...prevState,
      uploadingImages: true,
    }));
  };

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

  const { isCreating, isReady } = state;

  if (!isReady) {
    return null;
  }

  const formValid = isFormValid();

  return (
    <>
      <Heading mb="4" size="md">
        {t('form.details.label')}
      </Heading>

      <GenericEntryForm
        childrenIndex={2}
        formFields={publicActivityFormFields}
        onSubmit={handleSubmit}
      >
        <FormField helperText="Select the images for this entry" label="Images">
          <ImageUploader
            startUpload={state.uploadingImages}
            returnUploadedImages={(images) => console.log(images)}
          />
        </FormField>
      </GenericEntryForm>
    </>
  );
}
