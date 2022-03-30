import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Heading, Text, Button, HStack, Textarea } from '@chakra-ui/react';
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
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isAdmin ] = useState(true);

  const { formState, handleSubmit, register } = useForm();
  const { isDirty, isSubmitting } = formState;

  useEffect(() => {
    getBookings();
    // !isLoading ? console.log("bookings: ", bookings) : console.log('isLoading')
  }, []);

  const bookingListActions = [{
    content: tc('labels.remove'),
    // handleClick: () => removeBooking(booking._id),
  }];

  const getBookings = async () => {
    try {
      const response = await call('getBookings', domainId);
      setBookings(
        response.map(booking =>  ({ ...booking, actions: bookingListActions })));
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
              keySelector="booking"
              list={bookings} 
              px="2" 
              py="4"
            >
              {(booking) => (
                <Text size="xs">
                  {`At ${moment(booking.startDate).format('ddd, D MMM')} 
                    from ${booking.startTime} 
                    to ${booking.endTime} 
                    for \n'${booking.description}'`}
                </Text>
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