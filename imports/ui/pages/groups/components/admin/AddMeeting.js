import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Switch,
  Text,
  Textarea,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import DateTimePicker from '/imports/ui/components/DateTimePicker';
import { ConflictMarker } from '/imports/ui/components/DatesAndTimes';
import {
  call,
  checkAndSetBookingsWithConflict,
  getAllBookingsWithSelectedResource,
  parseAllBookingsWithResources,
} from '/imports/ui/utils/shared';
import Modal from '/imports/ui/components/Modal';
import { StateContext } from '/imports/ui/LayoutContainer';

const yesterday = dayjs().add(-1, 'days');
const today = dayjs();

const emptyDateAndTime = {
  startDate: today,
  endDate: today,
  startTime: '00:00',
  endTime: '23:59',
  attendees: [],
  capacity: 40,
  isRange: false,
  conflict: null,
};

export default function AddMeeting({ group, isOpen, onClose }) {
  const [state, setState] = useState({
    activities: [],
    conflictingBooking: null,
    isFormValid: false,
    newMeeting: emptyDateAndTime,
    resources: [],
  });
  const { currentHost } = useContext(StateContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const activities = await call('getAllActivities');
      const resources = await call('getResources');
      setState({
        ...state,
        activities,
        resources,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const { activities, conflictingBooking, isFormValid, newMeeting, resources } = state;

  const handleDateAndTimeChange = (date) => {
    setState(
      {
        ...state,
        newMeeting: date,
      },
      () => validateBookings()
    );
  };

  const validateBookings = () => {
    if (!activities || !resources || activities.length < 1 || resources.length < 1) {
      return null;
    }

    if (!newMeeting || !newMeeting.startDate || !newMeeting.startTime || !newMeeting.endTime) {
      setState({
        ...state,
        conflictingBooking: null,
        isFormValid: false,
      });
      return;
    }

    if (!newMeeting.resourceId) {
      setState({
        ...state,
        conflictingBooking: null,
        isFormValid: true,
      });
      return;
    }

    const selectedResource = resources.find((r) => r._id === newMeeting.resourceId);

    const allBookingsParsed = parseAllBookingsWithResources(activities, resources);

    const allBookingsWithSelectedResource = getAllBookingsWithSelectedResource(
      selectedResource,
      allBookingsParsed
    );

    const selectedBookingsWithConflict = checkAndSetBookingsWithConflict(
      [
        {
          startDate: newMeeting.startDate,
          endDate: newMeeting.startDate,
          startTime: newMeeting.startTime,
          endTime: newMeeting.endTime,
        },
      ],
      allBookingsWithSelectedResource
    );

    if (
      selectedBookingsWithConflict &&
      selectedBookingsWithConflict[0] &&
      selectedBookingsWithConflict[0].conflict
    ) {
      setState({
        ...state,
        conflictingBooking: selectedBookingsWithConflict && selectedBookingsWithConflict[0],
        isFormValid: false,
      });
    } else {
      setState({
        ...state,
        conflictingBooking: null,
        isFormValid: true,
      });
    }
  };

  const handleResourceChange = (resourceLabel) => {
    const selectedResource = resources?.find((r) => r.label === resourceLabel);
    setState(
      {
        ...state,
        newMeeting: {
          ...newMeeting,
          resource: resourceLabel,
          resourceId: selectedResource ? selectedResource._id : null,
          resourceIndex: selectedResource ? selectedResource.resourceIndex : null,
        },
      },
      () => {
        if (!selectedResource) {
          return;
        }
        validateBookings();
      }
    );
  };

  const createActivity = async () => {
    if (!isFormValid) {
      return;
    }

    if (!newMeeting.resource || newMeeting.resource.length < 4) {
      // message.error(t('errors.noresource'));
      console.log('no resource');
      return;
    }

    const activityValues = {
      title: group.title,
      subTitle: group.readingMaterial,
      longDescription: group.description,
      images: [group.imageUrl],
      resource: newMeeting.resource,
      resourceId: newMeeting.resourceId,
      resourceIndex: newMeeting.resourceIndex,
      datesAndTimes: [
        {
          startDate: newMeeting.startDate,
          endDate: newMeeting.startDate,
          startTime: newMeeting.startTime,
          endTime: newMeeting.endTime,
          attendees: [],
          capacity: group.capacity,
        },
      ],
      isPublicActivity: false,
      isRegistrationDisabled: false,
      isGroupMeeting: true,
      isGroupPrivate: group.isPrivate,
      groupId: group._id,
    };

    try {
      await call('createActivity', activityValues);
      // message.success(tc('message.success.create'));
    } catch (error) {
      console.log(error);
      // message.error(error.reason);
    }
  };

  return (
    <Box>
      <Modal
        // actionButtonLabel={getButtonLabel()}
        bg="gray.100"
        isOpen={isOpen}
        // secondaryButtonLabel={copied ? tc('actions.copied') : tc('actions.share')}
        // size="xl"
        // onActionButtonClick={() => handleActionButtonClick()}
        onClose={onClose}
        // onSecondaryButtonClick={handleCopyLink}
      >
        <AddMeetingForm
          buttonDisabled={!isFormValid}
          conflictingBooking={conflictingBooking}
          hostname={currentHost?.settings?.name}
          newMeeting={newMeeting}
          resources={resources?.filter((r) => r.isBookable)}
          handleDateChange={(date) => handleDateAndTimeChange(date)}
          handleResourceChange={handleResourceChange}
          handleSubmit={createActivity}
        />
      </Modal>
    </Box>
  );
}

function AddMeetingForm({
  buttonDisabled,
  conflictingBooking,
  hostname,
  newMeeting,
  resources,
  handleDateChange,
  handleResourceChange,
  handleSubmit,
}) {
  const [isLocal, setIsLocal] = useState(true);
  const [t] = useTranslation('groups');

  return (
    <Box bg="brand.50" border="1px solid" borderColor="brand.500" p="4" my="4">
      <Text fontWeight="bold">{t('meeting.form.label')}</Text>
      <Box py="2" mb="8">
        <DateTimePicker value={newMeeting} onChange={handleDateChange} />
      </Box>

      <FormControl alignItems="center" display="flex" mb="2" ml="2" mt="4">
        <Switch
          id="is-local-switch"
          isChecked={isLocal}
          onChange={({ target: { checked } }) => setIsLocal(checked)}
        />
        <FormLabel htmlFor="is-local-switch" mb="1" ml="2">
          {t('meeting.form.switch', { place: hostname })}
        </FormLabel>
      </FormControl>

      {isLocal ? (
        <Select
          name="resource"
          placeholder={t('meeting.form.resource')}
          onChange={({ target: { value } }) => handleResourceChange(value)}
        >
          {resources.map((r, i) => (
            <option key={r._id}>{r.label}</option>
          ))}
        </Select>
      ) : (
        <Textarea
          placeholder={t('meeting.form.location')}
          size="sm"
          onChange={(event) => handleResourceChange(event.target.value)}
        />
      )}

      <Flex justify="flex-end" my="4">
        <Button isDisabled={buttonDisabled} size="sm" onClick={handleSubmit}>
          {t('meeting.form.submit')}
        </Button>
      </Flex>

      {conflictingBooking && <ConflictMarker recurrence={conflictingBooking} t={ta} />}
    </Box>
  );
}
