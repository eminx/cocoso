import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';

import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Modal,
  Text,
} from '/imports/ui/core';
import {
  canCreateContentAtom,
  currentHostAtom,
  currentUserAtom,
} from '/imports/state';
import FancyDate from '/imports/ui/entry/FancyDate';
import { call, getComboResourcesWithColor } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import FormField from '/imports/ui/forms/FormField';

// import { ActivityContext } from '../Activity';
import RsvpForm from './RsvpForm';
import RsvpList from './CsvList';

const yesterday = dayjs(new Date()).add(-1, 'days');

const getAttendeeCount = (attendees) => {
  let count = 0;
  attendees.forEach((att) => {
    count += att.numberOfPeople;
  });
  return count;
};

export default function RsvpContent({
  activity,
  occurrence,
  occurrenceIndex,
  onCloseModal,
}) {
  const currentHost = useAtomValue(currentHostAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const [state, setState] = useState({
    isRsvpCancelModalOn: false,
    rsvpCancelModalInfo: null,
    selectedOccurrence: null,
  });
  const [capacityGotFullByYou] = useState(false);
  const [t] = useTranslation('activities');
  const getActivityById = () => console.log('getActivityById');

  const { isRsvpCancelModalOn, rsvpCancelModalInfo, selectedOccurrence } =
    state;

  if (!activity || !occurrence || !occurrence.attendees) {
    return null;
  }

  const { capacity } = activity;

  const getTotalNumber = () => {
    let counter = 0;
    occurrence.attendees.forEach((attendee) => {
      counter += Number(attendee.numberOfPeople);
    });
    return counter;
  };

  const resetRsvpModal = () => {
    setState({
      ...state,
      isRsvpCancelModalOn: false,
      rsvpCancelModalInfo: null,
    });
    onCloseModal();
  };

  const openCancelRsvpModal = () => {
    setState({
      ...state,
      isRsvpCancelModalOn: true,
      rsvpCancelModalInfo: {
        occurrenceIndex,
        email: currentUser ? currentUser.emails[0].address : '',
        lastName:
          currentUser && currentUser.lastName ? currentUser.lastName : '',
      },
    });
  };

  const handleRsvpSubmit = async (values) => {
    let isAlreadyRegistered = false;
    occurrence.attendees?.forEach((attendee) => {
      if (!attendee) {
        return;
      }
      if (
        attendee?.lastName?.trim().toLowerCase() ===
          values?.lastName?.trim()?.toLowerCase() &&
        attendee?.email?.trim().toLowerCase() ===
          values?.email?.trim()?.toLowerCase()
      ) {
        isAlreadyRegistered = true;
        return;
      }
    });
    if (isAlreadyRegistered) {
      message.error(t('public.register.alreadyRegistered'));
      return;
    }

    let totalNumberOfAttendees = 0;
    occurrence.attendees.forEach((attendee) => {
      totalNumberOfAttendees += attendee.numberOfPeople;
    });

    const numberOfPeople = Number(values.numberOfPeople);

    if (capacity < totalNumberOfAttendees + numberOfPeople) {
      const capacityLeft = capacity - totalNumberOfAttendees;
      message.error(t('public.register.notEnoughSeats', { capacityLeft }));
      return;
    }

    const parsedValues = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      numberOfPeople,
    };

    try {
      await call(
        'registerAttendance',
        activity?._id,
        parsedValues,
        occurrenceIndex
      );
      await getActivityById();
      resetRsvpModal();
      message.success(t('public.attendance.create'));
    } catch (error) {
      message.error(error.reason);
    }
  };

  const handleChangeRsvpSubmit = async (values) => {
    let totalNumberOfAttendees = 0;
    occurrence?.attendees?.forEach((attendee, index) => {
      if (rsvpCancelModalInfo.attendeeIndex === index) {
        console.log('attendeeIndex:', rsvpCancelModalInfo.attendeeIndex);
        return;
      }
      totalNumberOfAttendees += attendee.numberOfPeople;
    });

    const numberOfPeople = Number(values.numberOfPeople);

    if (capacity < totalNumberOfAttendees + numberOfPeople) {
      const capacityLeft = capacity - totalNumberOfAttendees;
      message.error(t('public.register.notEnoughSeats', { capacityLeft }));
      return;
    }

    const parsedValues = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      numberOfPeople,
    };

    try {
      await call(
        'updateAttendance',
        activity?._id,
        parsedValues,
        rsvpCancelModalInfo?.occurrenceIndex,
        rsvpCancelModalInfo?.attendeeIndex
      );
      await getActivityById();
      resetRsvpModal();
      message.success(t('public.attendance.update'));
    } catch (error) {
      message.error(error.reason);
    }
  };

  const handleRemoveRsvp = async () => {
    if (!rsvpCancelModalInfo) {
      return;
    }
    const { email, lastName } = rsvpCancelModalInfo;

    if (!email || !lastName) {
      return;
    }

    const theOccurrence = activity?.datesAndTimes[occurrenceIndex];
    const theNonAttendee = theOccurrence.attendees.find(
      (a) =>
        a.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        a.lastName.trim().toLowerCase() === lastName.trim().toLowerCase()
    );

    if (!theNonAttendee) {
      message.error(t('public.register.notFound'));
      return;
    }

    try {
      await call(
        'removeAttendance',
        activity?._id,
        occurrenceIndex,
        email,
        lastName
      );
      await getActivityById();
      resetRsvpModal();
      message.success(t('public.attendance.remove'));
      setState({
        ...state,
        rsvpCancelModalInfo: null,
        isRsvpCancelModalOn: false,
      });
    } catch (error) {
      message.error(error.reason);
    }
  };

  const findRsvpInfo = () => {
    const theOccurrence =
      activity?.datesAndTimes[rsvpCancelModalInfo.occurrenceIndex];

    const attendeeFinder = (attendee) =>
      attendee.lastName.trim().toLowerCase() ===
        rsvpCancelModalInfo.lastName.trim().toLowerCase() &&
      attendee.email.trim().toLowerCase() ===
        rsvpCancelModalInfo.email.trim().toLowerCase();

    const foundAttendee = theOccurrence.attendees.find(attendeeFinder);
    const foundAttendeeIndex =
      theOccurrence.attendees.findIndex(attendeeFinder);

    if (!foundAttendee) {
      message.error(t('public.register.notFound'));
      return;
    }

    setState({
      ...state,
      rsvpCancelModalInfo: {
        ...rsvpCancelModalInfo,
        attendeeIndex: foundAttendeeIndex,
        isInfoFound: true,
        firstName: foundAttendee.firstName,
        numberOfPeople: foundAttendee.numberOfPeople,
      },
    });
  };

  const defaultRsvpValues = {
    firstName: currentUser ? currentUser.firstName : '',
    lastName: currentUser ? currentUser.lastName : '',
    email: currentUser ? currentUser.emails[0].address : '',
    numberOfPeople: 1,
  };

  const eventPast = dayjs(occurrence.endDate).isBefore(yesterday);

  return (
    <Box>
      <Box>
        {!eventPast && (
          <Center m="2">
            <Button
              colorScheme="red"
              size="sm"
              variant="ghost"
              onClick={() => openCancelRsvpModal(occurrenceIndex)}
            >
              {t('public.cancel.label')}
            </Button>
          </Center>
        )}

        {eventPast ? (
          <Box py="2">
            <Text color="gray.800">{t('public.past')}</Text>
          </Box>
        ) : capacity && occurrence.attendees && getTotalNumber() >= capacity ? (
          <p>
            {capacityGotFullByYou && t('public.capacity.fullByYou')}
            {t('public.capacity.full')}
          </p>
        ) : (
          <RsvpForm
            defaultValues={defaultRsvpValues}
            onSubmit={(values) => handleRsvpSubmit(values, occurrenceIndex)}
          />
        )}
      </Box>

      {canCreateContent && (
        <Center>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setState({ ...state, selectedOccurrence: occurrence })
            }
          >
            {t('public.attendance.show')}
          </Button>
        </Center>
      )}

      <Modal
        hideFooter
        id="occurrence-rsvp-content"
        open={isRsvpCancelModalOn}
        size="lg"
        title={
          rsvpCancelModalInfo && rsvpCancelModalInfo.isInfoFound
            ? t('public.cancel.found')
            : t('public.cancel.notFound')
        }
        onClose={() => setState({ ...state, isRsvpCancelModalOn: false })}
      >
        {rsvpCancelModalInfo?.isInfoFound ? (
          <RsvpForm
            isUpdateMode
            onDelete={handleRemoveRsvp}
            defaultValues={rsvpCancelModalInfo}
            onSubmit={(values) => handleChangeRsvpSubmit(values)}
          />
        ) : (
          <Box>
            <FormField label={t('public.register.form.name.last')}>
              <Input
                value={rsvpCancelModalInfo && rsvpCancelModalInfo.lastName}
                onChange={(e) =>
                  setState({
                    ...state,
                    rsvpCancelModalInfo: {
                      ...rsvpCancelModalInfo,
                      lastName: e.target.value,
                    },
                  })
                }
              />
            </FormField>

            <FormField label={t('public.register.form.email')}>
              <Input
                value={rsvpCancelModalInfo && rsvpCancelModalInfo.email}
                onChange={(e) =>
                  setState({
                    ...state,
                    rsvpCancelModalInfo: {
                      ...rsvpCancelModalInfo,
                      email: e.target.value,
                    },
                  })
                }
              />
            </FormField>

            <Flex justify="flex-end" pt="6">
              <Button onClick={findRsvpInfo}>Confirm</Button>
            </Flex>
          </Box>
        )}
      </Modal>

      <Modal
        hideFooter
        id="occurrence-rsvp-content-found-result"
        open={Boolean(selectedOccurrence)}
        size="2xl"
        title={
          <Box mr="8" w="100%">
            <FancyDate occurrence={selectedOccurrence} />
          </Box>
        }
        onClose={() => setState({ ...state, selectedOccurrence: null })}
      >
        <Heading as="h3" mb="2" size="md">
          {t('public.attendance.label')}
          {selectedOccurrence
            ? ` (${getAttendeeCount(selectedOccurrence.attendees)})`
            : null}
        </Heading>
        <Box bg="white" p="2">
          <RsvpList occurrence={selectedOccurrence} title={activity?.title} />
        </Box>
      </Modal>
    </Box>
  );
}
