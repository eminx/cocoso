import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Heading, Text, Button, HStack, Textarea, Switch, FormControl, FormLabel } from '@chakra-ui/react';
import moment from 'moment';

import { call } from '../../../@/shared';
import NiceList from '../../../components/NiceList';
import { message } from '../../../components/message';
import DatePicker from '../../../components/DatePicker';

export default function BookingsField({ domainId }) {
  const [ t ] = useTranslation('processes');
  const [ tc ] = useTranslation('common');
  
  const [ bookings, setBookings] = useState([]);
  const [ newBooking, setNewBooking ] = useState({});
  const [ multipledays, setMultipledays ] = useState(false);

  const [ isLoading, setIsLoading ] = useState(true);
  const [ isAdmin ] = useState(true);

  const { formState, handleSubmit, register } = useForm();
  const { isDirty, isSubmitting } = formState;

  useEffect(() => {
    getBookings();
    // !isLoading ? console.log("bookings: ", bookings) : console.log('isLoading')
  }, []);

  const getBookings = async () => {
    try {
      const response = await call('getBookings', domainId);
      setBookings(
        response.map(booking =>  ({ ...booking, actions: [{
          content: tc('labels.remove'),
          // handleClick: () => removeBooking(booking._id),
        }] 
      })));
      setIsLoading(false);
    } catch (error) {
      message.error(error.reason);
      setIsLoading(false);
    }
  };

  const handleDateAndTimeChange = (value, key) => {
    newBooking[key] = value;
    setNewBooking({...newBooking});
  };

  const onSubmit = async (values) => {
    multipledays === false
      ? values = { ...newBooking, endDate: newBooking.startDate, ...values }
      : values = { ...newBooking, ...values }
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
          setBookings([ ...bookings, respond ]);
        }
      }
    );
  };

  return (
    <Box mt="1.75rem">
      <Heading mb="2" size="sm">
        Bookings
      </Heading>

      {isAdmin &&       
        <Box px="2" py="4" bg="white">
          <form onSubmit={handleSubmit((data) => onSubmit(data))}>
            <FormControl display='flex' alignItems='center' mb="2">
              <Switch id='book-multiple-days' size="sm" onChange={() => setMultipledays(!multipledays) } />
              <FormLabel htmlFor='book-multiple-days' fontSize="sm" mb='0' ml="2">
                Book for multiple days
              </FormLabel>
            </FormControl>
            <HStack spacing="2" mb="4">
              <DatePicker 
                noTime 
                placeholder="Start date"
                onChange={(date) => handleDateAndTimeChange(date, 'startDate')} 
              />
              {multipledays && 
              <DatePicker 
                noTime 
                placeholder="Finish date"
                onChange={(date) => handleDateAndTimeChange(date, 'endDate')} 
              />}
            </HStack>
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
      }

      {!isLoading && 
        <Box
          bg="white"
          borderTop="1px"
          borderColor="gray.200"
        >
          {bookings && bookings.length > 0 ? (
            <NiceList
              actionsDisabled={!isAdmin}
              list={bookings} 
              px="2" 
              py="4"
            >
              {(booking) => (
                <Box>
                  <Text fontSize="md">
                    {`From ${moment(booking.startDate).format('ddd, D MMM')} ${booking.startTime} 
                    to ${booking.startDate === booking.endDate ? '' : moment(booking.endDate).format('ddd, D MMM')} ${booking.endTime} `}
                  </Text>
                  <Text fontSize="xs">
                    {booking.description}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    booked by {booking.bookedBy}
                  </Text>
                </Box>
              )}
            </NiceList>
          ) : (
            <Text size="small" pad="2" p="4" margin={{ bottom: 'small' }}>
              <em>No bookings yet</em>
            </Text>
          )}
        </Box>
      }
    </Box>
  );
};