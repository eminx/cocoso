import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import moment from 'moment';
moment.locale(i18n.language);

import { useForm } from 'react-hook-form';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  HStack,
  Textarea,
  Switch,
  FormControl,
  FormLabel,
  Code,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Input,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';

import { call } from '../../../@/shared';
import NiceList from '../../../components/NiceList';
import { message } from '../../../components/message';
import DatePicker from '../../../components/DatePicker';
import { StateContext } from '../../../LayoutContainer';

const today = new Date().toISOString().substring(0, 10);

export default function BookingsField({ domain }) {
  const { role, canCreateContent } = useContext(StateContext);
  const isAdmin = role === 'admin' ? true : false;

  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState({
    startDate: today,
    endDate: today,
    startTime: '',
    endTime: '',
  });
  const [multipledays, setMultipledays] = useState(false);
  const [occurences, setOccurences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { formState, handleSubmit, register } = useForm();
  const { isDirty, isSubmitting } = formState;

  const [t] = useTranslation('resources');
  const [tc] = useTranslation('common');

  const getBookings = async () => {
    try {
      const response = await call('getResourceBookingsForUser', domain?._id);
      setBookings(
        response.map((booking) => ({
          ...booking,
          actions: [
            {
              content: tc('labels.remove'),
              handleClick: () => removeBooking(booking._id),
            },
          ],
        }))
      );
      setIsLoading(false);
    } catch (error) {
      message.error(error.reason);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    getAllOccurences();
  }, []);

  const getAllOccurences = async () => {
    setIsLoading(true);
    try {
      const response = await call('getAllOccurences');
      setOccurences([...response]);
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
    setNewBooking({ ...newBooking });
    validateBookings(newBooking, domain);
  };

  const validateBookings = (selectedOccurence, selectedResource) => {
    const allOccurencesWithSelectedResource = occurences.filter((occurence) => {
      if (selectedResource.isCombo) {
        return selectedResource.resourcesForCombo.some((resourceForCombo) => {
          return resourceForCombo._id === occurence.resourceId;
        });
      }
      return selectedResource._id === occurence.resourceId;
    });

    const occurenceWithConflict = allOccurencesWithSelectedResource.find(
      (occurence) => {
        const selectedStart = `${selectedOccurence.startDate} ${selectedOccurence.startTime}`;
        const selectedEnd = `${selectedOccurence.endDate} ${selectedOccurence.endTime}`;
        const existingStart = `${occurence.startDate} ${occurence.startTime}`;
        const existingEnd = `${occurence.endDate} ${occurence.endTime}`;
        const dateTimeFormat = 'YYYY-MM-DD HH:mm';
        return (
          moment(selectedStart, dateTimeFormat).isBetween(
            existingStart,
            existingEnd
          ) ||
          moment(selectedEnd, dateTimeFormat).isBetween(
            existingStart,
            existingEnd
          )
        );
      }
    );

    if (occurenceWithConflict) {
      if (selectedOccurence?.conflict) delete selectedOccurence.conflict;
      setNewBooking({
        ...selectedOccurence,
        conflict: {
          ...occurenceWithConflict,
        },
      });
    } else {
      delete selectedOccurence.conflict;
      setNewBooking(selectedOccurence);
    }
  };

  const onSubmit = async (values) => {
    !multipledays
      ? (values = { ...newBooking, endDate: newBooking.startDate, ...values })
      : (values = { ...newBooking, ...values });

    activityValues = {
      title: values.title,
      longDescription: values.description,
      resource: domain.label,
      resourceId: domain._id,
      resourceIndex: domain.resourceIndex,
      datesAndTimes: [
        {
          startDate: values.startDate,
          startTime: values.startTime,
          endDate: values.endDate,
          endTime: values.endTime,
        },
      ],
      isPublicActivity: false,
      isRegistrationDisabled: true,
    };

    try {
      call('createActivity', activityValues);
      message.success(
        tc('message.success.create', {
          domain: `${tc('domains.your')} ${tc(
            'domains.activity'
          ).toLowerCase()}`,
        })
      );
    } catch (error) {
      message.error(error.reason);
    }
  };

  return (
    <Box mt="5">
      <Heading mb="4" size="sm">
        {t('booking.labels.field')}
      </Heading>

      <Box bg="white">
        <Accordion defaultIndex={[1]} allowMultiple allowToggle>
          <AccordionItem>
            {({ isExpanded }) => (
              <>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      {t('booking.labels.form')}
                    </Box>
                    {isExpanded ? (
                      <MinusIcon fontSize="12px" />
                    ) : (
                      <AddIcon fontSize="12px" />
                    )}
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {canCreateContent && (
                    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                      <FormControl display="flex" alignItems="center" mb="2">
                        <Switch
                          id="book-multiple-days"
                          size="sm"
                          onChange={() => setMultipledays(!multipledays)}
                        />
                        <FormLabel
                          htmlFor="book-multiple-days"
                          fontSize="sm"
                          mb="0"
                          ml="2"
                        >
                          {t('booking.multiple')}
                        </FormLabel>
                      </FormControl>

                      <Box
                        p={newBooking.conflict ? '2' : '0'}
                        mb="4"
                        border={newBooking.conflict ? '1px solid red' : 'none'}
                      >
                        <HStack spacing="2" mb="4">
                          <DatePicker
                            noTime
                            placeholder={t('booking.date.start')}
                            onChange={(date) =>
                              handleDateAndTimeChange(date, 'startDate')
                            }
                          />
                          {multipledays && (
                            <DatePicker
                              noTime
                              placeholder={t('booking.date.start')}
                              onChange={(date) =>
                                handleDateAndTimeChange(date, 'endDate')
                              }
                            />
                          )}
                        </HStack>
                        <HStack spacing="2">
                          <DatePicker
                            onlyTime
                            placeholder={t('booking.time.start')}
                            onChange={(time) =>
                              handleDateAndTimeChange(time, 'startTime')
                            }
                          />
                          <DatePicker
                            onlyTime
                            placeholder={t('booking.time.end')}
                            onChange={(time) =>
                              handleDateAndTimeChange(time, 'endTime')
                            }
                          />
                        </HStack>
                        {newBooking.conflict && (
                          <Box mt="4">
                            <Text
                              fontSize="sm"
                              textAlign="center"
                              fontWeight="bold"
                            >
                              {t('booking.conflict')}
                            </Text>
                            <Code
                              colorScheme="red"
                              mx="auto"
                              display="block"
                              width="fit-content"
                              mt="4"
                            >
                              {newBooking.conflict.startDate ===
                              newBooking.conflict.endDate
                                ? newBooking.conflict.startDate
                                : newBooking.conflict.startDate +
                                  '-' +
                                  newBooking.conflict.endDate}
                              {', '}
                              {newBooking.conflict.startTime +
                                ' – ' +
                                newBooking.conflict.endTime}
                            </Code>
                          </Box>
                        )}
                      </Box>

                      <Input
                        {...register('title')}
                        placeholder={t('booking.title')}
                        size="sm"
                        mb="4"
                      />

                      <Textarea
                        {...register('description')}
                        placeholder={t('booking.description')}
                        size="sm"
                        mb="4"
                      />

                      <Flex justify="flex-end">
                        <Button
                          colorScheme="green"
                          isDisabled={!isDirty || newBooking.conflict}
                          isLoading={isSubmitting}
                          size="sm"
                          type="submit"
                        >
                          {t('booking.submit')}
                        </Button>
                      </Flex>
                    </form>
                  )}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
      </Box>

      {!isLoading && (
        <Box bg="white" mt="2">
          {bookings && bookings.length > 0 ? (
            <NiceList actionsDisabled={!isAdmin} list={bookings}>
              {(booking) => (
                <Box>
                  <Text fontSize="sm">
                    {`From ${moment(booking.startDate).format('ddd, D MMM')} ${
                      booking.startTime
                    } 
                    to ${
                      booking.startDate === booking.endDate
                        ? ''
                        : moment(booking.endDate).format('ddd, D MMM')
                    } ${booking.endTime} `}
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
      )}
    </Box>
  );
}
