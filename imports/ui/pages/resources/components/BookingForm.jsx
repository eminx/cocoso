import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Flex, Heading, HStack, Textarea } from '@chakra-ui/react';

import DatePicker from '../../../components/DatePicker';

export default function BookingForm() {
  const [ t ] = useTranslation('processes');
  const handleDateAndTimeChange = (dateOrTime, entity) => {
    const { newMeeting } = this.state;
    const newerMeeting = { ...newMeeting };
    newerMeeting[entity] = dateOrTime;

    this.setState({
      newMeeting: newerMeeting,
      isFormValid: this.isFormValid(),
    });
  };

  addBooking = () => {};

  return (
    <Box mt="1.75rem">
      <Heading mb="2" size="sm">
        Bookings
      </Heading>
      <Box p="4" bg="white">
        <Box mb="4">
          <DatePicker noTime onChange={(date) => handleDateAndTimeChange(date, 'startDate')} />
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
          placeholder="Note, usage, purpose, etc..."
          size="sm"
          mb="4"
        />

        <Flex justify="flex-end">
          <Button
            colorScheme="green"
            // disabled={buttonDisabled}
            size="sm"
            onClick={() => addBooking()}
          >
            Book
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};