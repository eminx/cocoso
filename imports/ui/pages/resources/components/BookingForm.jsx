import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Button, Flex, Heading, HStack, Textarea } from '@chakra-ui/react';

import DatePicker from '../../../components/DatePicker';
import { message } from '../../../components/message';

export default function BookingForm({ domainId }) {
  const [ newBooking, setNewBooking ] = useState({});
  const { formState, handleSubmit, register } = useForm();
  const { isDirty, isSubmitting } = formState;
  const [ t ] = useTranslation('processes');

  const handleDateAndTimeChange = (value, key) => {
    newBooking[key] = value;
    setNewBooking({...newBooking});
  };

  const onSubmit = async (values) => {
    values = { ...newBooking, endDate: newBooking.startDate, ...values }
    Meteor.call(
      'createBooking',
      domainId,
      values,
      (error, respond) => {
        if (error) {
          console.log('error', error);
          message.error(error.error);
        } else {
          message.success(t('meeting.success.add'));
        }
      }
    );
  };

  return (
    <Box mt="1.75rem">
      <Heading mb="2" size="sm">
        Bookings
      </Heading>
      <Box px="2" py="4" bg="white">
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <Box mb="4">
            <DatePicker 
              noTime 
              onChange={(date) => handleDateAndTimeChange(date, 'startDate')} 
            />
          </Box>
          <HStack spacing="2" mb="4">
            <DatePicker
              onlyTime
              placeholder={t('meeting.form.time.start')}
              onChange={(time) => handleDateAndTimeChange(time, 'startTime')}
            />
            <DatePicker
              onlyTime
              placeholder={t('meeting.form.time.end')}
              onChange={(time) => handleDateAndTimeChange(time, 'endTime')}
            />
          </HStack>

          <Textarea
            {...register('description')}
            placeholder="Note, usage, purpose, etc..."
            size="sm"
            mb="4"
          />

          <Flex justify="flex-end">
            <Button
              colorScheme="green"
              isDisabled={!isDirty}
              isLoading={isSubmitting}
              size="sm"
              type="submit"
            >
              Book
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
};