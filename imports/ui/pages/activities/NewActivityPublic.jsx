import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '@chakra-ui/react';
import { parse } from 'query-string';
import { useTranslation } from 'react-i18next';

import { Alert, message } from '../../generic/message';
import { call } from '../../utils/shared';
import { StateContext } from '../../LayoutContainer';
import GenericEntryForm from '../../forms/GenericEntryForm';
import ImageUploader from '../../forms/ImageUploader';
import FormField from '../../forms/FormField';
import DatesAndTimes from '../../forms/DatesAndTimes';
import publicActivityFormFields from './publicActivityFormFields';
import { emptyDateAndTime } from '../../forms/DatesAndTimes';

const defaultCapacity = 40;

const resourceOptions = [
  {
    label: 'Studio',
    value: '621063945278965636723456',
  },
  {
    label: 'Office',
    value: '621063923132132131223456',
  },
];

const emptyFormValues = {
  title: '',
  subTitle: '',
  longDescription: '',
  resources: [],
  place: '',
  address: '',
  capacity: defaultCapacity,
  isPublicActivity: true,
  isRegistrationDisabled: false,
};

export default function NewActivityPublic() {
  const [state, setState] = useState({
    datesAndTimes: [],
    formValues: emptyFormValues,
    isCreating: false,
    isError: true,
    isReady: false,
    isCheckingForm: false,
    isSendingForm: false,
    isSuccess: false,
    isUploadingImages: false,
    resources: [],
  });

  const navigate = useNavigate();
  const [t] = useTranslation('activities');
  const [tc] = useTranslation('common');
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

  const getData = async () => {
    try {
      const resources = await call('getResources');
      setState((prevState) => ({
        ...prevState,
        resources,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
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
    if (state.isCheckingForm) {
      if (!isFormValid()) {
        message.error(t('form.error'));
        return;
      }
      setState((prevState) => ({
        ...prevState,
        isCheckingForm: false,
        isUploadingImages: true,
      }));
    }
  }, [state.isCheckingForm]);

  const handleSubmit = (formValues) => {
    if (!isFormValid()) {
      // message.error(t('form.error'));
      return;
    }
    setState((prevState) => ({
      ...prevState,
      formValues,
      isCreating: true,
      isCheckingForm: true,
    }));
  };

  const returnDatesAndTimes = (datesAndTimes) => {
    console.log('datesAndTimes', datesAndTimes);
    setState((prevState) => ({
      ...prevState,
      datesAndTimes,
    }));
  };

  const createActivity = async (images) => {
    const { datesAndTimes } = state;
    if (!datesAndTimes || !datesAndTimes.length) {
      return;
    }

    console.log('creating');

    try {
      const newEntryId = await call('createActivity', {
        ...state.formValues,
        datesAndTimes,
        images,
      });
      console.log('created', newEntryId);
      // message.success(t('form.success'));
      navigate(`/activities/${newEntryId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const returnUploadedImages = (images) => {
    setState((prevState) => ({
      ...prevState,
      isUploadingImages: false,
      isSendingForm: true,
    }));

    console.log('images', images);

    createActivity(images);
  };

  // if (!resources || !resources.length) {
  //   return null;
  // }

  return (
    <>
      <Heading mb="4" size="md">
        {t('form.details.label')}
      </Heading>

      <GenericEntryForm
        childrenIndex={2}
        formFields={publicActivityFormFields(resourceOptions, t)}
        onSubmit={handleSubmit}
      >
        <FormField helperText="Select the images for this entry" label="Images">
          <ImageUploader
            ping={state.isUploadingImages}
            returnUploadedImages={returnUploadedImages}
          />
        </FormField>

        <FormField
          helperText="Select the dates and time. Click + for more occurrences"
          label="Date and Time"
        >
          <DatesAndTimes ping={state.isCreating} returnDatesAndTimes={returnDatesAndTimes} />
        </FormField>
      </GenericEntryForm>
    </>
  );
}
