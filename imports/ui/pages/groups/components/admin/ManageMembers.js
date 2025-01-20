import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
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

import DateTimePicker, { ConflictMarker } from '/imports/ui/components/DateTimePicker';
import { call } from '/imports/ui/utils/shared';

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

export default function AddMeeting({ group, onClose }) {
  const [state, setState] = useState({
    conflictingBooking: null,
    isFormValid: false,
    modalOpen: false,
    newMeeting: emptyDateAndTime,
    resources: [],
  });

  useEffect(() => {
    getResources();
  }, []);

  const getResources = async () => {
    try {
      const resources = await call('getResources');
      setState({
        ...state,
        resources,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const { conflictingBooking, isFormValid, modalOpen, newMeeting, resources } = state;

  return null;

  return (
    <AddMeetingForm
      buttonDisabled={!isFormValid}
      conflictingBooking={conflictingBooking}
      hostname={currentHost?.settings?.name}
      newMeeting={newMeeting}
      resources={resources.filter((r) => r.isBookable)}
      handleDateChange={(date) => this.handleDateAndTimeChange(date)}
      handleResourceChange={this.handleResourceChange}
      handleSubmit={this.createActivity}
    />
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
  const [ta] = useTranslation('activities');

  return (
    <Box bg="brand.50" border="1px solid" borderColor="brand.500" p="4" my="4">
      <Text fontWeight="bold">{t('meeting.form.label')}</Text>
      <Box py="2" mb="8">
        <DateTimePicker
          placeholder={t('meeting.form.time.start')}
          value={newMeeting}
          onChange={handleDateChange}
        />
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
          {resources.map((part, i) => (
            <option key={part.label}>{part.label}</option>
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
