import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Input,
  Select,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import DatesAndTimes from './DatesAndTimes';
import FileDropper from './FileDropper';
import FormField from './FormField';
import ReactQuill from './Quill';
import { localeSort } from '../utils/shared';

const defaultCapacity = 40;
const today = new Date().toISOString().substring(0, 10);

const emptyDateAndTime = {
  startDate: today,
  endDate: today,
  startTime: '00:00',
  endTime: '23:59',
  attendees: [],
  capacity: defaultCapacity,
};

function ActivityForm({
  datesAndTimes,
  defaultValues,
  imageUrl,
  isPublicActivity,
  resources,
  onSubmit,
  setDatesAndTimes,
  uploadableImageLocal,
  setUploadableImage,
  setSelectedResource,
  isButtonDisabled,
}) {
  useEffect(() => {
    setSelectedResource(getValues('resourceId'));
  }, [defaultValues]);

  const { control, formState, handleSubmit, getValues, register } = useForm({
    defaultValues,
  });

  const [tc] = useTranslation('common');
  const [t] = useTranslation('activities');

  const addRecurrence = () => {
    const newDatesAndTimes = [...datesAndTimes, { ...emptyDateAndTime }];

    setDatesAndTimes(newDatesAndTimes);
  };

  const removeRecurrence = (index) => {
    const newDatesAndTimes = datesAndTimes.filter((item, i) => {
      console.log(index, i);
      return i !== index;
    });

    setDatesAndTimes(newDatesAndTimes);
  };

  const handleDateChange = (date, recurrenceIndex, entity) => {
    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (index === recurrenceIndex) {
        item[entity] = date;
        if (entity === 'startDate' && !item.isRange) {
          item.endDate = date;
        }
      }
      return item;
    });

    setDatesAndTimes(newDatesAndTimes);
  };

  const handleCapacityChange = (value, recurrenceIndex) => {
    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (recurrenceIndex === index) {
        item.capacity = Number(value);
      }
      return item;
    });

    setDatesAndTimes(newDatesAndTimes);
  };

  const handleRangeSwitch = (event, recurrenceIndex) => {
    const value = event.target.checked;
    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (recurrenceIndex === index) {
        item.isRange = value;
        if (!value) {
          item.endDate = item.startDate;
        }
      }
      return item;
    });

    setDatesAndTimes(newDatesAndTimes);
  };

  return (
    <div>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <Box mb="8">
          <FormField label={<b>{t('form.resource.label')}</b>} isRequired>
            <Select
              {...register('resourceId', { required: true })}
              placeholder={t('form.resource.holder')}
              variant="filled"
              onChange={(e) => setSelectedResource(e.target.value)}
            >
              {resources
                .sort(localeSort)
                .filter((r) => r.isBookable)
                .map((option, index) => (
                  <option
                    key={option._id}
                    selected={option._id === defaultValues.resourceId}
                    value={option._id}
                  >
                    {option.isCombo
                      ? `${option.label}: [${option.resourcesForCombo.map((res, i) => res.label)}]`
                      : option.label}
                  </option>
                ))}
            </Select>
          </FormField>
        </Box>

        <Box mb="8">
          <FormField label={<b>{t('form.occurences.label')}</b>} isRequired />

          <Box mb="4">
            {datesAndTimes.map((recurrence, index) => {
              const id =
                recurrence.startDate +
                recurrence.endDate +
                recurrence.startTime +
                recurrence.endTime +
                index;
              return (
                <DatesAndTimes
                  key={id}
                  id={id}
                  isPublicActivity={isPublicActivity}
                  recurrence={recurrence}
                  removeRecurrence={() => removeRecurrence(index)}
                  isDeletable={datesAndTimes.length > 1}
                  handleCapacityChange={(value) => handleCapacityChange(value, index)}
                  handleStartDateChange={(date) => handleDateChange(date, index, 'startDate')}
                  handleEndDateChange={(date) => handleDateChange(date, index, 'endDate')}
                  handleStartTimeChange={(time) => handleDateChange(time, index, 'startTime')}
                  handleEndTimeChange={(time) => handleDateChange(time, index, 'endTime')}
                  handleRangeSwitch={(event) => handleRangeSwitch(event, index)}
                />
              );
            })}
            <Center p="6" border="1px solid #ccc">
              <IconButton size="lg" onClick={addRecurrence} icon={<AddIcon />} />
            </Center>
          </Box>
        </Box>

        <Box mb="8">
          <Heading mb="4" size="md">
            {t('form.details.label')}
          </Heading>

          <VStack spacing="6">
            <FormField label={t('form.title.label')} helperText={t('form.title.helper')} isRequired>
              <Input
                {...register('title', { required: true })}
                placeholder={t('form.title.holder')}
              />
            </FormField>

            {isPublicActivity && (
              <FormField
                label={t('form.subtitle.label')}
                helperText={t('form.subtitle.helper')}
                isRequired
              >
                <Input
                  {...register('subTitle', { required: true })}
                  placeholder={t('form.subtitle.holder')}
                />
              </FormField>
            )}

            <FormField label={t('form.desc.label')} isRequired={isPublicActivity}>
              <Controller
                control={control}
                name="longDescription"
                render={({ field }) => <ReactQuill {...field} />}
              />
            </FormField>

            {isPublicActivity && (
              <FormField label={t('form.place.label')}>
                <Input {...register('place')} placeholder={t('form.place.holder')} />
              </FormField>
            )}

            {isPublicActivity && (
              <FormField label={t('form.address.label')}>
                <Textarea {...register('address')} placeholder={t('form.address.holder')} />
              </FormField>
            )}

            {isPublicActivity && (
              <FormField
                label={t('form.image.label')}
                helperText={(uploadableImageLocal || imageUrl) && tc('plugins.fileDropper.replace')}
                isRequired
              >
                <Center>
                  <FileDropper
                    uploadableImageLocal={uploadableImageLocal}
                    imageUrl={imageUrl}
                    setUploadableImage={setUploadableImage}
                  />
                </Center>
              </FormField>
            )}
          </VStack>
        </Box>

        <Flex justify="flex-end" py="4" w="100%">
          <Button isLoading={isButtonDisabled} type="submit">
            {tc('actions.submit')}
          </Button>
        </Flex>
      </form>
    </div>
  );
}

export default ActivityForm;
