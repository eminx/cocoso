import React from 'react';
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

import { editorFormats, editorModules } from '../@/constants/quillConfig';
import DatesAndTimes from './DatesAndTimes';
import FileDropper from './FileDropper';
import FormField from '../components/FormField';

const defaultCapacity = 40;
const today = new Date().toISOString().substring(0, 10);

let emptyDateAndTime = {
  startDate: today,
  endDate: today,
  startTime: '',
  endTime: '',
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
}) {
  const { control, formState, handleSubmit, register } = useForm({
    defaultValues,
  });
  const { isDirty, isSubmitting } = formState;

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
          item['endDate'] = date;
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
            Resource
          </Heading>
          <FormField>
            <Select
              {...register('resource', { required: true })}
              placeholder="Select resource to book"
              variant="filled"
              value={defaultValues.resourceId}
            >
              {resources.map((option, index) => {
                return (
                  <option key={option._id} value={option._id}>
                    {option.isCombo
                      ? option.label +
                        ': [' +
                        option.resourcesForCombo.map((res, i) => res.label) +
                        ']'
                      : option.label}
                  </option>
                );
              })}
            </Select>
          </FormField>
        </Box>

        <Box mb="8">
          <Heading mb="4" size="md">
            Occurences*
          </Heading>

          <Box mb="4">
            {datesAndTimes.map((recurrence, index) => (
              <DatesAndTimes
                key={index}
                isPublicActivity={isPublicActivity}
                recurrence={recurrence}
                removeRecurrence={() => removeRecurrence(index)}
                isNotDeletable={index === 0}
                handleCapacityChange={(value) =>
                  handleCapacityChange(value, index)
                }
                handleStartDateChange={(date) =>
                  handleDateChange(date, index, 'startDate')
                }
                handleEndDateChange={(date) =>
                  handleDateChange(date, index, 'endDate')
                }
                handleStartTimeChange={(time) =>
                  handleDateChange(time, index, 'startTime')
                }
                handleEndTimeChange={(time) =>
                  handleDateChange(time, index, 'endTime')
                }
                handleRangeSwitch={(event) => handleRangeSwitch(event, index)}
              />
            ))}
            <Center p="6" border="1px solid #ccc">
              <IconButton
                size="lg"
                onClick={addRecurrence}
                icon={<AddIcon />}
              />
            </Center>
          </Box>
        </Box>

        <Box mb="8">
          <Heading mb="4" size="md">
            Details
          </Heading>

          <VStack spacing="6">
            <FormField
              label="Title"
              helperText="This is typicaly title of your event"
            >
              <Input
                {...register('title', { required: true })}
                placeholder="Give it a title"
              />
            </FormField>

            {isPublicActivity && (
              <FormField
                label="Subtitle"
                helperText="i.e. artist, or some subtitle..."
              >
                <Input
                  {...register('subTitle', { required: true })}
                  placeholder="give it a subtitle (artist name etc.)"
                />
              </FormField>
            )}

            <FormField label="Description">
              <Controller
                control={control}
                name="longDescription"
                render={({ field }) => (
                  <ReactQuill
                    {...field}
                    formats={editorFormats}
                    modules={editorModules}
                  />
                )}
              />
            </FormField>

            {isPublicActivity && (
              <FormField label="Place">
                <Input {...register('place')} placeholder="Artistosphere" />
              </FormField>
            )}

            {isPublicActivity && (
              <FormField label="Address">
                <Textarea
                  {...register('address')}
                  placeholder="17th Street, Berlin..."
                />
              </FormField>
            )}

            {isPublicActivity && (
              <FormField
                label="Image"
                helperText={
                  (uploadableImageLocal || imageUrl) &&
                  'If you want to replace it with another one, click on the image to reopen the file picker'
                }
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
          <Button isLoading={isSubmitting} type="submit">
            Confirm
          </Button>
        </Flex>
      </form>
    </div>
  );
}

export default ActivityForm;
