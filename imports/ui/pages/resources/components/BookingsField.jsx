import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import moment from 'moment';
moment.locale(i18n.language);

import { useForm } from 'react-hook-form';
import { Box, Flex, Heading, Text, Button, HStack, Textarea, 
  Switch, FormControl, FormLabel, 
  Accordion, AccordionItem, AccordionButton, AccordionPanel, Input, } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';

import { call } from '../../../@/shared';
import NiceList from '../../../components/NiceList';
import { message } from '../../../components/message';
import DatePicker from '../../../components/DatePicker';
import { StateContext } from '../../../LayoutContainer';


export default function BookingsField({ domain }) {
  const { role, canCreateContent } = useContext(StateContext);
  const isAdmin = role === 'admin' ? true : false;

  const [ bookings, setBookings] = useState([]);
  const [ newBooking, setNewBooking ] = useState({});
  const [ multipledays, setMultipledays ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);

  const { formState, handleSubmit, register } = useForm();
  const { isDirty, isSubmitting } = formState;

  const [ t ] = useTranslation('processes');
  const [ tc ] = useTranslation('common');
  

  const getBookings = async () => {
    try {
      const response = await call('getResourceBookings', domain?._id);
      setBookings(
        response.map(booking =>  ({ ...booking, actions: [{
          content: tc('labels.remove'),
          handleClick: () => removeBooking(booking._id),
        }] 
      })));
      setIsLoading(false);
    } catch (error) {
      message.error(error.reason);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    getBookings();
  }, [bookings]);
  
  const removeBooking = async (bookingId) => {
    if (!isAdmin) {
      message.error(tc('message.access.deny'));
      return;
    }
    try {
      await call('deleteActivity', bookingId);
    } catch (error) {
      message.error(error.reason);
    }
  };
    
  const handleDateAndTimeChange = (value, key) => {
    newBooking[key] = value;
    setNewBooking({...newBooking});
  };

  const onSubmit = async (values) => {
    multipledays === false
      ? values = { ...newBooking, endDate: newBooking.startDate, ...values }
      : values = { ...newBooking, ...values };

    activityValues = {
      title: values.title,
      subTitle: '',
      longDescription: values.description,
      resource: {
        label: domain.label,
        _id: domain._id,
        resourceIndex: domain.resourceIndex,
      },
      place: '',
      practicalInfo: '',
      internalInfo: '',
      address: '',
      capacity: 0,
      datesAndTimes: [{
        startDate: values.startDate,
        startTime: values.startTime,
        endDate: values.endDate,
        endTime: values.endTime,
        capacity: 0,
      }],
      isPublicActivity: false,
      isRegistrationDisabled: true,
    };

    Meteor.call('createActivity', activityValues, '', (error, result) => {
      if (error) {
        console.log('error', error);
        message.error(error.reason);
      }
    });

  };

  return (
    <Box mt="5">
      <Heading mb="4" size="sm">
        Bookings
      </Heading>

      <Box bg="white">
        <Accordion defaultIndex={[1]} allowMultiple allowToggle>
          <AccordionItem>
            {({ isExpanded }) => (
              <>
                <h2>
                  <AccordionButton>
                    <Box flex='1' textAlign='left'>
                      Add a Booking
                    </Box>
                    {isExpanded ? (
                      <MinusIcon fontSize='12px' />
                    ) : (
                      <AddIcon fontSize='12px' />
                    )}
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {canCreateContent &&       
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

                      <Input
                        {...register('title')}
                        placeholder="Give a name"
                        size="sm"
                        mb="4"
                      />

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
                  }
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
      </Box>

      {!isLoading && 
        <Box
          bg="white" mt="2"
        >
          {bookings && bookings.length > 0 ? (
            <NiceList
              actionsDisabled={!isAdmin}
              list={bookings} 
            >
              {(booking) => (
                <Box>
                  <Text fontSize="sm">
                    {`From ${moment(booking.startDate).format('ddd, D MMM')} ${booking.startTime} 
                    to ${booking.startDate === booking.endDate ? '' : moment(booking.endDate).format('ddd, D MMM')} ${booking.endTime} `}
                  </Text>
                  <Text fontSize="xs" fontStyle="italic" fontWeight="medium">
                    booked by {booking.bookedBy}
                  </Text>
                  <Text fontSize="xs">
                    {booking.description}
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