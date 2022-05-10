import React, { useEffect } from 'react';
import ReactQuill from 'react-quill';
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

import { editorFormats, editorModules } from '../utils/constants/quillConfig';
import DatesAndTimes from './DatesAndTimes';
import FileDropper from './FileDropper';
import FormField from '../components/FormField';
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
  const { control, formState, handleSubmit, getValues, register } = useForm({
    defaultValues,
  });
  const { isSubmitting } = formState;

  useEffect(() => {
    setSelectedResource(getValues('resourceId'));
  }, [defaultValues]);

  const [tc] = useTranslation('common');
  const [t] = useTranslation('activities');

  const addRecurrence = () => {
    const newDatesAndTimes = [...datesAndTimes, { ...emptyDateAndTime }];

    setDatesAndTimes(newDatesAndTimes);
  };

  const removeRecurrence = (index) => {
    const newDatesAndTimes = [...datesAndTimes];
    newDatesAndTimes.splice(index, 1);

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
          <Heading mb="4" size="md">
            {t('form.resource.label')}
          </Heading>
          <FormField>
            <Select
              {...register('resourceId', { required: true })}
              placeholder={t('form.resource.holder')}
              variant="filled"
              onChange={(e) => setSelectedResource(e.target.value)}
            >
              {resources.sort(localeSort).map((option) => (
                <option
                  key={option._id}
                  selected={option._id === defaultValues.resourceId}
                  value={option._id}
                >
                  {option.isCombo
                    ? `${option.label}: [${option.resourcesForCombo.map((res) => res.label)}]`
                    : option.label}
                </option>
              ))}
            </Select>
          </FormField>
        </Box>

        <Box mb="8">
          <Heading mb="4" size="md">
            {t('form.occurences.label')}
          </Heading>

          <Box mb="4">
            {datesAndTimes.map((recurrence, index) => (
              <DatesAndTimes
                key={index}
                isPublicActivity={isPublicActivity}
                recurrence={recurrence}
                removeRecurrence={() => removeRecurrence(index)}
                isNotDeletable={index === 0}
                handleCapacityChange={(value) => handleCapacityChange(value, index)}
                handleStartDateChange={(date) => handleDateChange(date, index, 'startDate')}
                handleEndDateChange={(date) => handleDateChange(date, index, 'endDate')}
                handleStartTimeChange={(time) => handleDateChange(time, index, 'startTime')}
                handleEndTimeChange={(time) => handleDateChange(time, index, 'endTime')}
                handleRangeSwitch={(event) => handleRangeSwitch(event, index)}
              />
            ))}
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
            <FormField label={t('form.title.label')} helperText={t('form.title.helper')}>
              <Input
                {...register('title', { required: true })}
                placeholder={t('form.title.holder')}
              />
            </FormField>

            {isPublicActivity && (
              <FormField label={t('form.subtitle.label')} helperText={t('form.subtitle.helper')}>
                <Input
                  {...register('subTitle', { required: true })}
                  placeholder={t('form.subtitle.holder')}
                />
              </FormField>
            )}

            <FormField label={t('form.desc.label')}>
              <Controller
                control={control}
                name="longDescription"
                render={({ field }) => (
                  <ReactQuill {...field} formats={editorFormats} modules={editorModules} />
                )}
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
          <Button isLoading={isSubmitting} isDisabled={isButtonDisabled} type="submit">
            {tc('actions.submit')}
          </Button>
        </Flex>
      </form>
    </div>
  );
}

export default ActivityForm;
