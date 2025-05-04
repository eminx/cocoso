import React, { useEffect } from 'react';
import {
  Box,
  Center,
  FormControl,
  FormLabel,
  IconButton,
  Switch,
  Text,
  Wrap,
} from '@chakra-ui/react';
import AddIcon from 'lucide-react/dist/esm/icons/plus';
import DeleteIcon from 'lucide-react/dist/esm/icons/x';
import { useTranslation } from 'react-i18next';

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
      <Text color="red.600" fontSize="sm" fontWeight="bold" my="4" textAlign="center">
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
        const conflict = await call('checkDatesForConflict', params, activityId);
        return {
          ...occurrence,
          conflict,
          isConflictHard: conflict && (isExclusiveActivity || conflict?.isExclusiveActivity),
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

    const conflict = resourceId ? await call('checkDatesForConflict', params, activityId) : null;

    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (index === occurrenceIndex) {
        return {
          ...occurrence,
          conflict,
          isConflictHard: conflict && (isExclusiveActivity || conflict?.isExclusiveActivity),
        };
      }
      return item;
    });

    onDatesAndTimesChange(newDatesAndTimes);
  };

  const addOccurrence = () => {
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
      return 'gray.400';
    } else if (occurrence.isConflictHard) {
      return 'tomato';
    }
    return 'orange';
  };

  const getOccurrenceId = (occurrence) => {
    if (!occurrence) {
      return null;
    }
    const { startDate, startTime, endDate, endTime } = occurrence;
    return `${startDate}-${startTime}-${endDate}-${endTime}`;
  };

  const containerProps = {
    bg: 'white',
    borderWidth: '2px',
    borderRadius: 'lg',
    mb: '4',
    p: '4',
    position: 'relative',
  };

  const iconProps = {
    bg: 'gray.600',
    icon: <DeleteIcon size="16px" style={{ zIndex: 1 }} />,
    position: 'absolute',
    right: '12px',
    top: '12px',
    size: 'xs',
  };

  if (!datesAndTimes || datesAndTimes.length === 0) {
    return null;
  }

  const isDeletable = datesAndTimes.length > 1;

  return (
    <Box mb="4" mt="2">
      {datesAndTimes?.map((occurrence, index) => {
        const id = getOccurrenceId(occurrence);
        return (
          <Box key={id} {...containerProps} borderColor={getBorderColor(occurrence)}>
            {isDeletable && <IconButton {...iconProps} onClick={() => removeOccurrence(index)} />}

            <Box mb="2">
              <FormControl w="auto" alignItems="center" display="flex">
                <Switch
                  isChecked={occurrence?.isRange || occurrence.startDate !== occurrence.endDate}
                  id={id}
                  onChange={(event) => handleRangeSwitch(event, index)}
                  py="2"
                />
                <FormLabel htmlFor={id} mb="1" ml="2">
                  {t('form.days.multiple')}
                </FormLabel>
              </FormControl>
            </Box>

            <Wrap>
              <DateTimePicker
                value={occurrence}
                onChange={(value) => handleDateTimeChange(value, index)}
              />
            </Wrap>

            {occurrence?.conflict && <ConflictMarker occurrence={occurrence} t={t} />}
          </Box>
        );
      })}
      <Center bg="white" borderRadius="lg" p="6">
        <IconButton bg="gray.700" size="lg" onClick={addOccurrence} icon={<AddIcon />} />
      </Center>
    </Box>
  );
}
