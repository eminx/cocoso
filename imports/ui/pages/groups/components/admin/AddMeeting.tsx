import React, { useEffect, useState } from 'react';
import { useRevalidator } from 'react-router';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useAtom, useAtomValue } from 'jotai';

import { currentHostAtom } from '/imports/state';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  Modal,
  Select,
  Textarea,
} from '/imports/ui/core';
import DateTimePicker from '/imports/ui/forms/DateTimePicker';
import { ConflictMarker } from '/imports/ui/forms/DatesAndTimes';
import { call } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';

import { groupAtom } from '../../GroupItemHandler';

const today = dayjs();

const emptyDateAndTime = {
  endDate: today,
  endTime: '23:59',
  resource: null,
  resourceId: null,
  startDate: today,
  startTime: '00:00',
};

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
  const [ta] = useTranslation('activities');

  return (
    <>
      <Box bg="theme.50" borderRadius="lg" p="4">
        <DateTimePicker value={newMeeting} onChange={handleDateChange} />

        <FormControl alignItems="center" display="flex" my="4">
          <Checkbox
            id="is-local-switch"
            checked={isLocal}
            onChange={({ target: { checked } }) => setIsLocal(checked)}
          >
            {t('meeting.form.switch', { place: hostname })}
          </Checkbox>
        </FormControl>

        {isLocal ? (
          <Select
            name="resource"
            placeholder={t('meeting.form.resource')}
            onChange={({ target: { value } }) => handleResourceChange(value)}
          >
            {resources.map((r) => (
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
      </Box>

      {conflictingBooking && (
        <ConflictMarker occurrence={conflictingBooking} t={ta} />
      )}

      <Flex justify="flex-end" pt="4">
        <Button isDisabled={buttonDisabled} onClick={handleSubmit}>
          {t('meeting.form.submit')}
        </Button>
      </Flex>
    </>
  );
}

export default function AddMeeting({ onClose }) {
  const currentHost = useAtomValue(currentHostAtom);
  const [state, setState] = useState({
    activities: [],
    conflictingBooking: null,
    isFormValid: false,
    isSubmitted: false,
    newMeeting: emptyDateAndTime,
    resources: [],
  });
  const [group, setGroup] = useAtom(groupAtom);
  const [t] = useTranslation('groups');
  const [tc] = useTranslation('common');
  const revalidator = useRevalidator();

  const { conflictingBooking, isFormValid, newMeeting, resources } = state;

  const getData = async () => {
    try {
      const activitiesReceived = await call('getAllActivities');
      const resourcesReceived = await call('getResources');
      setState({
        ...state,
        activities: activitiesReceived,
        resources: resourcesReceived,
      });
    } catch (error: any) {
      message.error(error?.reason || error?.error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const checkDatesForConflict = async () => {
    const { resourceId, resource, startDate, startTime, endTime } =
      state.newMeeting;
    if (!resourceId || !startDate || !startTime || !endTime) {
      if (resource) {
        setState((prevState) => ({
          ...prevState,
          conflictingBooking: null,
          isFormValid: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          isFormValid: false,
        }));
      }
      return;
    }

    const params = {
      startDate,
      startTime,
      endDate: startDate,
      endTime,
      resourceId,
      resource,
    };

    const conflictingBooking = await call('checkDatesForConflict', params);

    setState((prevState) => ({
      ...prevState,
      conflictingBooking: conflictingBooking
        ? { ...conflictingBooking, isConflictHard: true }
        : null,
      isFormValid: Boolean(!conflictingBooking),
    }));
  };

  useEffect(() => {
    checkDatesForConflict();
  }, [newMeeting]);

  const handleDateAndTimeChange = (selectedDates) => {
    setState((prevState) => ({
      ...prevState,
      newMeeting: {
        ...prevState.newMeeting,
        startDate: selectedDates.startDate,
        endDate: selectedDates.endDate,
        startTime: selectedDates.startTime,
        endTime: selectedDates.endTime,
      },
    }));
  };

  const handleResourceChange = (resourceLabel) => {
    const selectedResource = resources.find((r) => r?.label === resourceLabel);

    setState((prevState) => ({
      ...prevState,
      newMeeting: {
        ...prevState.newMeeting,
        resource: resourceLabel,
        resourceId: selectedResource ? selectedResource._id : null,
      },
    }));
  };

  const createActivity = async () => {
    if (!isFormValid) {
      return;
    }

    setState((prevState) => ({
      ...prevState,
      isSubmitted: true,
    }));

    const activityValues = {
      title: group.title,
      subTitle: group.readingMaterial,
      longDescription: group.description,
      images: [group.imageUrl],
      resource: newMeeting.resource,
      resourceId: newMeeting.resourceId,
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
      const groupId = group?._id;
      setGroup(await call('getGroupWithMeetings', groupId));
      revalidator.revalidate();
      setState((prevState) => ({
        ...prevState,
        isSubmitted: false,
      }));
      onClose();
      message.success(tc('message.success.create'));
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  return (
    <Modal
      hideFooter
      id="group-add-meeting"
      open
      title={t('meeting.form.label')}
      onClose={onClose}
    >
      <AddMeetingForm
        buttonDisabled={!isFormValid}
        conflictingBooking={conflictingBooking}
        hostname={currentHost?.settings?.name}
        newMeeting={newMeeting}
        resources={resources?.filter((r) => r.isBookable)}
        handleDateChange={handleDateAndTimeChange}
        handleResourceChange={handleResourceChange}
        handleSubmit={createActivity}
      />
    </Modal>
  );
}
