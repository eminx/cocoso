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

import { editorFormats, editorModules } from '../constants/quillConfig';
import DatesAndTimes from './DatesAndTimes';
import FileDropper from './FileDropper';
import FormField from '../UIComponents/FormField';

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

  const renderDateTime = () => {
    return (
      <div style={{ marginBottom: 12 }}>
        {datesAndTimes.map((recurrence, index) => (
          <DatesAndTimes
            key={index}
            isPublicActivity={isPublicActivity}
            recurrence={recurrence}
            removeRecurrence={() => removeRecurrence(index)}
            isNotDeletable={index === 0}
            handleCapacityChange={(value) => handleCapacityChange(value, index)}
            handleDateChange={(date, isEndDate) =>
              handleDateChange(date, isEndDate, index)
            }
            handleStartTimeChange={(time) =>
              handleTimeChange(time, index, 'startTime')
            }
            handleFinishTimeChange={(time) =>
              handleTimeChange(time, index, 'endTime')
            }
            handleRangeSwitch={(event) => handleRangeSwitch(event, index)}
            noAnimate={index === 0}
          />
        ))}
        <Center p="6">
          <IconButton size="lg" onClick={addRecurrence} icon={<AddIcon />} />
        </Center>
      </div>
    );
  };

  const handleTimeChange = (time, recurrenceIndex, startOrFinishTime) => {
    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (index === recurrenceIndex) {
        item[startOrFinishTime] = time;
      }
      return item;
    });

    setDatesAndTimes(newDatesAndTimes);
  };

  const handleDateChange = (isoDate, isEndDate, recurrenceIndex) => {
    const date = isoDate.substring(0, 10);
    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (recurrenceIndex === index) {
        const recurrence = datesAndTimes[recurrenceIndex];
        if (recurrence.isRange) {
          if (isEndDate) {
            item.endDate = date;
          } else {
            item.startDate = date;
          }
        } else {
          item.startDate = date;
          item.endDate = date;
        }
      }
      return item;
    });

    setDatesAndTimes(newDatesAndTimes);
  };

  const handleCapacityChange = (event, recurrenceIndex) => {
    const value = Number(event.target.value);
    if (typeof value !== 'number') {
      return;
    }
    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (recurrenceIndex === index) {
        item.capacity = value;
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
            >
              {resources.map((option, index) => (
                <option
                  key={option._id}
                  selected={option.label === defaultValues.resource}
                  value={option._id}
                >
                  {option.isCombo
                    ? option.label +
                      ': [' +
                      option.resourcesForCombo.map((res, i) => res.label) +
                      ']'
                    : option.label}
                </option>
              ))}
            </Select>
          </FormField>
        </Box>

        <Box mb="8">
          <Heading mb="4" size="md">
            Occurences*
          </Heading>
          {renderDateTime()}
        </Box>

        <Box mb="8">
          <Heading mb="4" size="md">
            Details
          </Heading>

          <VStack spacing="6">
            <FormField
              label="Title"
              helperText="This is typicaly title of your event"
              // validate={(fieldValue, formValue) => console.log(fieldValue)}
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
          <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit">
            Confirm
          </Button>
        </Flex>
      </form>
    </div>
  );
}

export default ActivityForm;
