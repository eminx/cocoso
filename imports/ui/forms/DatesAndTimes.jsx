import React, { useEffect, useState } from 'react';
import {
  Box,
  Center,
  Code,
  FormControl,
  FormLabel,
  IconButton,
  NumberInput,
  NumberInputField,
  Switch,
  Text,
  Wrap,
} from '@chakra-ui/react';
import AddIcon from 'lucide-react/dist/esm/icons/plus';
import DeleteIcon from 'lucide-react/dist/esm/icons/x';
import { useTranslation } from 'react-i18next';

import DateTimePicker from './DateTimePicker';

const today = new Date().toISOString().substring(0, 10);
const defaultCapacity = 40;
const maxAttendees = 1000;

export const emptyDateAndTime = {
  startDate: today,
  endDate: today,
  startTime: '08:00',
  endTime: '10:00',
  attendees: [],
  isRange: false,
  conflict: null,
};

function ConflictMarker({ occurrence, t }) {
  if (!occurrence) {
    return null;
  }
  return (
    <Box>
      <Text fontSize="sm" textAlign="center" fontWeight="bold">
        {t('form.conflict.alert')}
        <br />
      </Text>
      <Code
        colorScheme={occurrence.isConflictOK ? 'orange' : 'red'}
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
      </Code>
      {occurrence.isConflictOK && (
        <Text fontSize="sm" fontWeight="bold" mt="2" textAlign="center">
          {t('form.conflict.notExclusiveInfo')}
        </Text>
      )}
    </Box>
  );
}

export default function DatesAndTimes({ datesAndTimes, onDatesAndTimesChange }) {
  const [t] = useTranslation('activities');

  const addOccurrence = () => {
    const newDatesAndTimes = [...datesAndTimes, { ...emptyDateAndTime }];

    onDatesAndTimesChange(newDatesAndTimes);
  };

  const removeOccurrence = (index) => {
    const newDatesAndTimes = datesAndTimes.filter((item, i) => i !== index);

    onDatesAndTimesChange(newDatesAndTimes);
  };

  const handleDateTimeChange = (date, occurrenceIndex) => {
    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (index === occurrenceIndex) {
        return date;
      }
      return item;
    });

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
    if (!occurrence.conflict) {
      return 'gray.400';
    } else if (occurrence.isConflictOK) {
      return 'orange';
    }
    return 'tomato';
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
    borderRadius: '8px',
    mb: '4',
    p: '4',
    position: 'relative',
  };

  const iconProps = {
    bg: 'gray.700',
    icon: <DeleteIcon />,
    position: 'absolute',
    right: '12px',
    top: '12px',
    size: 'sm',
    zIndex: 9,
  };

  const isDeletable = datesAndTimes.length > 1;

  return (
    <Box mb="4" mt="2">
      {datesAndTimes.map((occurrence, index) => {
        const id = getOccurrenceId(occurrence);
        return (
          <Box key={id} {...containerProps} borderColor={getBorderColor(occurrence)}>
            {isDeletable && <IconButton {...iconProps} onClick={() => removeOccurrence(index)} />}

            <Box mb="2">
              <FormControl w="auto" alignItems="center" display="flex">
                <Switch
                  isChecked={occurrence.isRange}
                  id={id}
                  onChange={handleRangeSwitch}
                  py="2"
                />
                <FormLabel htmlFor={id} mb="1" ml="2">
                  {t('form.days.multiple')}
                </FormLabel>
              </FormControl>
            </Box>

            <Wrap>
              <DateTimePicker value={occurrence} onChange={handleDateTimeChange} />
              {/* 
              <Box
                flexDirection="column"
                mb="6"
                justify="space-around"
                flexGrow={0}
                flexBasis="180px"
              >
                {isPublicActivity && (
                  <Box mt="4">
                    <Text mb="2">{t('form.capacity.label')}:</Text>
                    <NumberInput
                      min={1}
                      max={maxAttendees}
                      value={occurrence.capacity}
                      variant="filled"
                      onChange={handleCapacityChange}
                    >
                      <NumberInputField placeholder="Capacity" />
                    </NumberInput>
                  </Box>
                )}
              </Box> */}
            </Wrap>

            {occurrence.conflict && <ConflictMarker occurrence={occurrence} t={t} />}
          </Box>
        );
      })}
      <Center bg="white" p="6">
        <IconButton bg="gray.700" size="lg" onClick={addOccurrence} icon={<AddIcon />} />
      </Center>
    </Box>
  );
}
