import React, { useContext, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { StateContext } from '../LayoutContainer';
import { call } from '../utils/shared';
import { message } from '../components/message';
import ConfirmModal from '../components/ConfirmModal';
import FancyDate, { DateJust } from '../components/FancyDate';
import FormField from '../components/FormField';

const yesterday = dayjs(new Date()).add(-1, 'days');

const sexyBorder = {
  bg: 'white',
  border: '1px solid',
  borderColor: 'brand.500',
  color: 'brand.800',
};

export default function RsvpHandler({ activity }) {
  const [capacityGotFullByYou, setCapacityFullByYou] = useState(false);
  const { canCreateContent, currentUser } = useContext(StateContext);
  const [t] = useTranslation('activities');

  if (!activity) {
    return null;
  }

  if ((activity && activity.isRegistrationDisabled) || !activity.isPublicActivity) {
    return (
      <div>
        {activity?.isRegistrationDisabled && (
          <Text mb="2" size="sm" textAlign="center">
            {t('public.register.disabled.true')}
          </Text>
        )}
        {activity?.datesAndTimes.map((occurrence, occurrenceIndex) => (
          <Box
            key={occurrence.startDate + occurrence.startTime}
            {...sexyBorder}
            color="brand.800"
            p="2"
            mb="4"
          >
            <FancyDate occurrence={occurrence} />
          </Box>
        ))}
      </div>
    );
  }

  return <AccordionDates activity={activity} />;
}

function AccordionDates({ activity }) {
  const [t] = useTranslation('activities');

  if (!activity) {
    return null;
  }

  return (
    <Box>
      <Text mb="2" size="sm" textAlign="center">
        {t('public.register.disabled.false')}
      </Text>
      <Accordion allowToggle>
        {activity?.datesAndTimes?.map(
          (occurrence, occurrenceIndex) =>
            occurrence && (
              <AccordionItem key={occurrence.startDate + occurrence.startTime} mb="4">
                <AccordionButton
                  _hover={{ bg: 'brand.50' }}
                  _expanded={{ bg: 'brand.500', color: 'white' }}
                  {...sexyBorder}
                >
                  <Box flex="1" textAlign="left">
                    <FancyDate occurrence={occurrence} />
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel {...sexyBorder} bg="brand.50">
                  <Text m="2" fontWeight="bold">
                    {t('public.register.label')}
                  </Text>
                  <Box px="2">
                    <RsvpContent
                      activity={activity}
                      occurrence={occurrence}
                      occurrenceIndex={occurrenceIndex}
                    />
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            )
        )}
      </Accordion>
    </Box>
  );
}

function RsvpContent({ activity, occurrence, occurrenceIndex }) {
  const [state, setState] = useState({
    isRsvpCancelModalOn: false,
    rsvpCancelModalInfo: null,
  });
  const [t] = useTranslation('activities');
  const { canCreateContent, currentUser } = useContext(StateContext);
  const { isRsvpCancelModalOn, rsvpCancelModalInfo } = state;

  if (!occurrence || !occurrence.attendees) {
    return null;
  }

  const eventPast = dayjs(occurrence.endDate).isBefore(yesterday);

  if (eventPast) {
    return (
      <Box>
        <Text color="gray.800">{t('public.past')}</Text>
      </Box>
    );
  }

  const getTotalNumber = (occurrence) => {
    let counter = 0;
    occurrence.attendees.forEach((attendee) => {
      counter += Number(attendee.numberOfPeople);
    });
    return counter;
  };

  const openCancelRsvpModal = (occurrenceIndex) => {
    setState({
      ...state,
      isRsvpCancelModalOn: true,
      rsvpCancelModalInfo: {
        occurrenceIndex,
        email: currentUser ? currentUser.emails[0].address : '',
        lastName: currentUser && currentUser.lastName ? currentUser.lastName : '',
      },
    });
  };

  const handleRsvpSubmit = async (values, occurrenceIndex) => {
    let isAlreadyRegistered = false;
    const occurrence = activity?.datesAndTimes[occurrenceIndex];
    occurrence.attendees.forEach((attendee, attendeeIndex) => {
      if (
        attendee.lastName.trim().toLowerCase() === values.lastName.trim().toLowerCase() &&
        attendee.email.trim().toLowerCase() === values.email.trim().toLowerCase()
      ) {
        isAlreadyRegistered = true;
        return;
      }
    });
    if (isAlreadyRegistered) {
      message.error(t('public.register.alreadyRegistered'));
      return;
    }

    let registeredNumberOfAttendees = 0;
    occurrence.attendees.forEach((attendee) => {
      registeredNumberOfAttendees += attendee.numberOfPeople;
    });

    const numberOfPeople = Number(values.numberOfPeople);

    if (occurrence.capacity < registeredNumberOfAttendees + numberOfPeople) {
      const capacityLeft = occurrence.capacity - registeredNumberOfAttendees;
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
      await call('registerAttendance', activity?._id, parsedValues, occurrenceIndex);
      // await getActivityById();
      message.success(t('public.attendance.create'));
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  const handleChangeRsvpSubmit = async (values) => {
    const occurrenceIndex = rsvpCancelModalInfo?.occurrenceIndex;
    const occurrence = activity?.datesAndTimes[occurrenceIndex];

    let registeredNumberOfAttendees = 0;
    occurrence?.attendees?.forEach((attendee, index) => {
      if (rsvpCancelModalInfo.attendeeIndex === index) {
        return;
      }
      registeredNumberOfAttendees += attendee.numberOfPeople;
    });

    const numberOfPeople = Number(values.numberOfPeople);

    if (occurrence.capacity < registeredNumberOfAttendees + numberOfPeople) {
      const capacityLeft = occurrence.capacity - registeredNumberOfAttendees;
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
      // await getActivityById();
      message.success(t('public.attendance.update'));
      setState({
        ...state,
        rsvpCancelModalInfo: null,
        isRsvpCancelModalOn: false,
      });
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  const handleRemoveRsvp = async () => {
    if (!rsvpCancelModalInfo) {
      return;
    }
    const { email, lastName, occurrenceIndex } = rsvpCancelModalInfo;

    if (!email || !lastName) {
      return;
    }

    const theOccurrence = activity?.datesAndTimes[occurrenceIndex];
    const theNonAttendee = theOccurrence.attendees.find(
      (a) => a.email === email && a.lastName === lastName
    );

    if (!theNonAttendee) {
      message.error(t('public.register.notFound'));
      return;
    }

    try {
      await call('removeAttendance', activity?._id, occurrenceIndex, email, lastName);
      // await getActivityById();
      message.success(t('public.attendance.remove'));
      setState({
        ...state,
        rsvpCancelModalInfo: null,
        isRsvpCancelModalOn: false,
      });
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  const findRsvpInfo = () => {
    const theOccurrence = activity?.datesAndTimes[rsvpCancelModalInfo.occurrenceIndex];

    const attendeeFinder = (attendee) =>
      attendee.lastName === rsvpCancelModalInfo.lastName &&
      attendee.email === rsvpCancelModalInfo.email;

    const foundAttendee = theOccurrence.attendees.find(attendeeFinder);
    const foundAttendeeIndex = theOccurrence.attendees.findIndex(attendeeFinder);

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

  const setSelectedOccurrence = () => console.log('setSelectedOccurrence');

  const defaultRsvpValues = {
    firstName: currentUser ? currentUser.firstName : '',
    lastName: currentUser ? currentUser.lastName : '',
    email: currentUser ? currentUser.emails[0].address : '',
    numberOfPeople: 1,
  };

  return (
    <Box>
      <Box>
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

        {occurrence.capacity &&
        occurrence.attendees &&
        getTotalNumber(occurrence) >= occurrence.capacity ? (
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
        <Center mt="2">
          <Button size="sm" onClick={() => setSelectedOccurrence(occurrence)}>
            {t('public.attendance.show')}
          </Button>
        </Center>
      )}

      <ConfirmModal
        hideFooter={rsvpCancelModalInfo && rsvpCancelModalInfo.isInfoFound}
        title={
          rsvpCancelModalInfo && rsvpCancelModalInfo.isInfoFound
            ? t('public.cancel.found')
            : t('public.cancel.notFound')
        }
        visible={isRsvpCancelModalOn}
        onCancel={() => setState({ ...state, isRsvpCancelModalOn: false })}
        onClickOutside={() => setState({ ...state, isRsvpCancelModalOn: false })}
        onConfirm={findRsvpInfo}
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
            <FormControl id="lastname" mb="3" size="sm">
              <FormLabel>{t('public.register.form.name.last')}</FormLabel>
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
            </FormControl>

            <FormControl id="email" size="sm">
              <FormLabel>{t('public.register.form.email')}</FormLabel>
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
            </FormControl>
          </Box>
        )}
      </ConfirmModal>
    </Box>
  );
}

function RsvpForm({ isUpdateMode = false, defaultValues, onSubmit, onDelete }) {
  const { handleSubmit, register, formState } = useForm({
    defaultValues,
  });
  const { isDirty, isSubmitting } = formState;
  const [t] = useTranslation('activities');

  const fields = [
    {
      name: 'firstName',
      label: t('public.register.form.name.first'),
    },
    {
      name: 'lastName',
      label: t('public.register.form.name.last'),
    },
    {
      name: 'email',
      label: t('public.register.form.email'),
    },
    // {
    //   name: 'numberOfPeople',
    //   label: 'Number of people',
    // },
  ];

  return (
    <Box mb="8">
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <Stack spacing={2}>
          {fields.map((field) => (
            <FormField key={field.name} label={field.label}>
              <Input {...register(field.name, { required: true })} size="sm" />
            </FormField>
          ))}
          <FormField label={t('public.register.form.people.number')}>
            <NumberInput size="sm">
              <NumberInputField {...register('numberOfPeople', { required: true })} />
            </NumberInput>
          </FormField>
          <Box pt="2" w="100%">
            <Button
              colorScheme="green"
              isDisabled={isUpdateMode && !isDirty}
              isLoading={isSubmitting}
              loadingText={t('public.register.form.loading')}
              size="sm"
              type="submit"
              w="100%"
            >
              {isUpdateMode
                ? t('public.register.form.actions.update')
                : t('public.register.form.actions.create')}
            </Button>
          </Box>
          {isUpdateMode && (
            <Button colorScheme="red" size="sm" variant="ghost" onClick={onDelete}>
              {t('public.register.form.actions.remove')}
            </Button>
          )}
        </Stack>
      </form>
    </Box>
  );
}

function RsvpList({ occurrence, title }) {
  const [t] = useTranslation('activities');
  const [tc] = useTranslation('common');

  if (!occurrence) {
    return null;
  }

  const { attendees } = occurrence;

  return (
    <Box>
      <Center p="2">
        <CSVLink data={attendees} filename={getFileName(occurrence, title)} target="_blank">
          <Button as="span" size="sm">
            {tc('actions.downloadCSV')}
          </Button>
        </CSVLink>
      </Center>
      <ReactTable
        data={attendees}
        columns={[
          {
            Header: t('public.register.form.name.first'),
            accessor: 'firstName',
          },
          {
            Header: t('public.register.form.name.last'),
            accessor: 'lastName',
          },
          {
            Header: t('public.register.form.people.label'),
            accessor: 'numberOfPeople',
          },
          {
            Header: t('public.register.form.email'),
            accessor: 'email',
          },
        ]}
      />
    </Box>
  );
}

const getFileName = (occurrence, title) => {
  if (occurrence.startDate !== occurrence.endDate) {
    return (
      title +
      ' | ' +
      occurrence.startDate +
      '-' +
      occurrence.endDate +
      ', ' +
      occurrence.startTime +
      '-' +
      occurrence.endTime
    );
  } else {
    return (
      title + ' | ' + occurrence.startDate + ', ' + occurrence.startTime + '-' + occurrence.endTime
    );
  }
};
