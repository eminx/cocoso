import React, { useEffect } from 'react';
import AddIcon from 'lucide-react/dist/esm/icons/plus';
import DeleteIcon from 'lucide-react/dist/esm/icons/x';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Text,
  Wrap,
} from '/imports/ui/core';

import { call } from '../utils/shared';
import DateTimePicker from './DateTimePicker';

const today = new Date().toISOString().substring(0, 10);

export const emptyDateAndTime = {
  startDate: today,
  endDate: today,
  startTime: '08:00',
  endTime: '10:00',
  attendees: [],
  isRange: false,
  conflict: null,
};

export function ConflictMarker({ occurrence, t }) {
  if (!occurrence) {
    return null;
  }

  return (
    <Box>
      <Text
        color="red.600"
        fontSize="sm"
        fontWeight="bold"
        my="4"
        textAlign="center"
      >
        {t('form.conflict.alert')}
        <br />
      </Text>
      {/* <Code
        colorScheme={occurrence.isConflictHard ? 'tomato' : 'orange'}
        mx="auto"
        display="block"
        width="fit-content"
        mt="4"
      >
        {occurrence.conflict.startDate === occurrence.conflict.endDate
          ? occurrence.conflict.startDate
          : `${occurrence.conflict.startDate}-${occurrence.conflict.endDate}`}
        {', '}
        {`${occurrence.conflict.startTime} – ${occurrence.conflict.endTime}`}
      </Code> */}
      {!occurrence.isConflictHard && (
        <Text fontSize="sm" fontWeight="bold" mt="2" textAlign="center">
          {t('form.conflict.notExclusiveInfo')}
        </Text>
      )}
    </Box>
  );
}

export default function DatesAndTimes({
  activityId,
  datesAndTimes,
  isExclusiveActivity,
  resourceId,
  onDatesAndTimesChange,
}) {
  const [t] = useTranslation('activities');

  const checkDatesForConflict = async () => {
    if (!resourceId || !datesAndTimes) {
      return null;
    }

    const newDatesAndTimes = await Promise.all(
      datesAndTimes.map(async (occurrence) => {
        const params = {
          ...occurrence,
          resourceId,
        };
        const conflict = await call(
          'checkDatesForConflict',
          params,
          activityId
        );
        return {
          ...occurrence,
          conflict,
          isConflictHard:
            conflict && (isExclusiveActivity || conflict?.isExclusiveActivity),
        };
      })
    );

    return onDatesAndTimesChange(newDatesAndTimes);
  };

  useEffect(() => {
    checkDatesForConflict();
  }, [resourceId, isExclusiveActivity]);

  const handleDateTimeChange = async (occurrence, occurrenceIndex) => {
    if (!occurrence) {
      return;
    }

    const params = {
      ...occurrence,
      resourceId,
    };

    const conflict = resourceId
      ? await call('checkDatesForConflict', params, activityId)
      : null;

    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (index === occurrenceIndex) {
        return {
          ...occurrence,
          conflict,
          isConflictHard:
            conflict && (isExclusiveActivity || conflict?.isExclusiveActivity),
        };
      }
      return item;
    });

    onDatesAndTimesChange(newDatesAndTimes);
  };

  const addOccurrence = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const newDatesAndTimes = [...datesAndTimes, { ...emptyDateAndTime }];

    onDatesAndTimesChange(newDatesAndTimes);
  };

  const removeOccurrence = (index) => {
    const newDatesAndTimes = datesAndTimes.filter((item, i) => i !== index);

    onDatesAndTimesChange(newDatesAndTimes);
  };

  const handleRangeSwitch = (event, occurrenceIndex) => {
    const checked = event.target.checked;
    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (occurrenceIndex === index) {
        return {
          ...item,
          isRange: checked,
          endDate: item.startDate,
        };
      }
      return item;
    });

    onDatesAndTimesChange(newDatesAndTimes);
  };

  const getBorderColor = (occurrence) => {
    if (!occurrence || !occurrence.conflict) {
      return 'var(--cocoso-colors-theme-200)';
    } else if (occurrence.isConflictHard) {
      return 'var(--cocoso-colors-red-600)';
    }
    return 'orange';
  };

  const getOccurrenceId = (occurrence, index) => {
    if (!occurrence) {
      return null;
    }
    const { startDate, startTime, endDate, endTime } = occurrence;
    return `${startDate}-${startTime}-${endDate}-${endTime}-${index}`;
  };

  const containerStyle = {
    backgroundColor: 'white',
    border: '2px solid',
    borderRadius: 'var(--cocoso-border-radius)',
    marginBottom: '1rem',
    padding: '1rem',
    position: 'relative',
  };

  const iconStyle = {
    flexGrow: 0,
    position: 'absolute',
    right: '0.5rem',
    top: '0.5rem',
  };

  if (!datesAndTimes || datesAndTimes.length === 0) {
    return null;
  }

  const isDeletable = datesAndTimes.length > 1;

  return (
    <Box mb="4" mt="2">
      {datesAndTimes?.map((occurrence, index) => {
        const id = getOccurrenceId(occurrence, index);
        return (
          <Box
            key={id}
            style={{
              ...containerStyle,
              borderColor: getBorderColor(occurrence),
            }}
          >
            <Flex mb="2">
              <Checkbox
                checked={
                  occurrence?.isRange ||
                  occurrence.startDate !== occurrence.endDate
                }
                id={id}
                onChange={(event) => handleRangeSwitch(event, index)}
                py="2"
              >
                {t('form.days.multiple')}
              </Checkbox>

              {isDeletable && (
                <IconButton
                  colorScheme="red"
                  icon={<DeleteIcon />}
                  size="xs"
                  style={iconStyle}
                  onClick={() => removeOccurrence(index)}
                />
              )}
            </Flex>

            <DateTimePicker
              value={occurrence}
              onChange={(value) => handleDateTimeChange(value, index)}
            />

            {occurrence?.conflict && (
              <ConflictMarker occurrence={occurrence} t={t} />
            )}
          </Box>
        );
      })}
      <Center
        bg="white"
        p="6"
        style={{ borderRadius: 'var(--cocoso-border-radius)' }}
      >
        <IconButton icon={<AddIcon />} size="lg" onClick={addOccurrence} />
      </Center>
    </Box>
  );
}
