import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Heading, VStack } from '@chakra-ui/react';
import { parse } from 'query-string';
import { arrayMoveImmutable } from 'array-move';
import { useTranslation } from 'react-i18next';

import ActivityFormPublic from '../../forms/ActivityFormPublic';
import { Alert, message } from '../../generic/message';
import FormSwitch from '../../forms/FormSwitch';
import {
  call,
  compareDatesWithStartDateForSort,
  checkAndSetBookingsWithConflict,
  getAllBookingsWithSelectedResource,
  parseAllBookingsWithResources,
  resizeImage,
  uploadImage,
} from '../../utils/shared';
import { StateContext } from '../../LayoutContainer';

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

export default function NewActivityPublic() {
  const [state, setState] = useState({
    allBookings: [],
    formValues: null,
    datesAndTimes: null,
    isCreating: false,
    isError: false,
    resources: [],
    uploadableImages: [],
    uploadableImagesLocal: [],
    isExclusiveActivity: true,
    isRegistrationEnabled: false,
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

  const { isExclusiveActivity, selectedResource } = state;

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

  const validateBookings = () => {
    const { datesAndTimes } = state;
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
  }, [selectedResource?.resourceId, state.datesAndTimes, isExclusiveActivity]);

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

  const uploadImages = async (newFormValues) => {
    const { uploadableImages } = state;
    setState((prevState) => ({
      ...prevState,
      isCreating: true,
    }));

    try {
      const imagesReadyToSave = await Promise.all(
        uploadableImages.map(async (uploadableImage) => {
          const resizedImage = await resizeImage(uploadableImage, 1200);
          const uploadedImage = await uploadImage(resizedImage, 'activityImageUpload');
          return uploadedImage;
        })
      );
      createActivity(imagesReadyToSave, newFormValues);
    } catch (error) {
      console.log('Error uploading:', error);
      message.error(error.reason);
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

    if (!uploadableImages || uploadableImages.length === 0) {
      message.error(tc('message.error.imageRequired'));
      return;
    }

    setState((prevState) => ({
      ...prevState,
      isCreating: true,
      formValues: newFormValues,
    }));
    uploadImages(newFormValues);
  };

  const handleExclusiveSwitch = (event) => {
    const value = event.target.checked;
    setState((prevState) => ({
      ...prevState,
      isExclusiveActivity: value,
    }));
  };

  const handleRegistrationSwitch = (event) => {
    const value = event.target.checked;
    setState((prevState) => ({
      ...prevState,
      isRegistrationEnabled: value,
    }));
  };

  const setDatesAndTimes = (newDatesAndTimes) => {
    setState((prevState) => ({
      ...prevState,
      datesAndTimes: newDatesAndTimes,
    }));
  };

  const handleSelectedResource = (value) => {
    const newSelectedResource = resources.find((r) => r._id === value);
    setState((prevState) => ({
      ...prevState,
      selectedResource: newSelectedResource,
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

  const setUploadableImages = (files) => {
    files.forEach((uploadableImage) => {
      const reader = new FileReader();
      reader.readAsDataURL(uploadableImage);
      reader.addEventListener(
        'load',
        () => {
          setState((prevState) => ({
            ...prevState,
            uploadableImages: [...prevState.uploadableImages, uploadableImage],
            uploadableImagesLocal: [...prevState.uploadableImagesLocal, reader.result],
          }));
        },
        false
      );
    });
  };

  const handleRemoveImage = (imageIndex) => {
    setState((prevState) => ({
      ...prevState,
      uploadableImages: prevState.uploadableImages.filter((image, index) => imageIndex !== index),
      uploadableImagesLocal: prevState.uploadableImagesLocal.filter(
        (image, index) => imageIndex !== index
      ),
    }));
  };

  const handleSortImages = (oldIndex, newIndex) => {
    if (oldIndex === newIndex) {
      return;
    }

    setState((prevState) => ({
      ...prevState,
      uploadableImages: arrayMoveImmutable(prevState.uploadableImages, oldIndex, newIndex),
      uploadableImagesLocal: arrayMoveImmutable(
        prevState.uploadableImagesLocal,
        oldIndex,
        newIndex
      ),
    }));
  };

  const { isCreating, isReady } = state;

  if (!isReady) {
    return null;
  }

  const formValid = isFormValid();

  return (
    <Box>
      <Heading mb="4" size="md">
        {t('form.details.label')}
      </Heading>

      <Box mb="8">
        <VStack spacing="2">
          <FormSwitch
            isChecked={state.isExclusiveActivity}
            label={t('form.switch.exclusive')}
            onChange={handleExclusiveSwitch}
          />

          <FormSwitch
            isChecked={state.isRegistrationEnabled}
            label={t('form.switch.rsvp')}
            onChange={handleRegistrationSwitch}
          />
        </VStack>
      </Box>

      <ActivityFormPublic
        datesAndTimes={state.datesAndTimes}
        defaultValues={state.formValues}
        images={state.uploadableImagesLocal}
        isButtonDisabled={!formValid || isCreating}
        isSubmitting={isCreating}
        resources={resources}
        onRemoveImage={handleRemoveImage}
        onSortImages={handleSortImages}
        onSubmit={handleSubmit}
        setDatesAndTimes={setDatesAndTimes}
        setUploadableImages={setUploadableImages}
        setSelectedResource={handleSelectedResource}
      />
    </Box>
  );
}
