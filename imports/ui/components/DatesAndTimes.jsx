import React from 'react';
import {
  Box,
  Center,
  Code,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  NumberInput,
  NumberInputField,
  Switch,
  Text,
  Wrap,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import DatePicker from './DatePicker';
import { useTranslation } from 'react-i18next';

const DatesAndTimes = ({
  recurrence,
  handleStartDateChange,
  handleEndDateChange,
  handleStartTimeChange,
  handleEndTimeChange,
  handleCapacityChange,
  handleRangeSwitch,
  removeRecurrence,
  isNotDeletable,
  isPublicActivity,
}) => {
  if (!recurrence) {
    return null;
  }

  
  const [ t ] = useTranslation('activities');

  const isRange = recurrence.isRange;

  const startDate = {
    date: recurrence.startDate,
    time: recurrence.startTime,
  };

  const endDate = {
    date: recurrence.endDate,
    time: recurrence.endTime,
  };

  return (
    <Box
      p="4"
      mb="4"
      border={recurrence.conflict ? '1px solid red' : '1px solid #ccc'}
    >
      {!isNotDeletable && (
        <Flex justify="flex-end" mb="4">
          <IconButton
            onClick={removeRecurrence}
            size="sm"
            icon={<DeleteIcon />}
          />
        </Flex>
      )}

      <Center>
        <FormControl w="auto" alignItems="center" display="flex">
          <Switch
            isChecked={isRange}
            id="is-multipledays-switch"
            onChange={handleRangeSwitch}
            py="2"
          />
          <FormLabel htmlFor="is-multipledays-switch" mb="1" ml="2">
            {t('form.day.multiple')}
          </FormLabel>
        </FormControl>
      </Center>

      <Wrap>
        <Box p="2">
          <Box mb="2">
            <Text fontSize="sm">{isRange ? t('form.date.start') : t('form.day.single')}</Text>
            <DatePicker
              noTime
              value={startDate}
              onChange={handleStartDateChange}
            />
          </Box>

          {isRange && (
            <Box>
              <Text fontSize="sm">{t('form.date.finish')}</Text>
              <DatePicker
                noTime
                value={endDate}
                onChange={handleEndDateChange}
              />
            </Box>
          )}
        </Box>

        <Box
          flexDirection="column"
          p="2"
          mb="6"
          justify="space-around"
          flexGrow={0}
          flexBasis="180px"
        >
          <Box mb="2">
            <Text fontSize="sm">{t('form.start.finish')}</Text>
            <DatePicker
              onlyTime
              value={startDate}
              onChange={handleStartTimeChange}
            />
          </Box>

          <Box>
            <Text fontSize="sm">{t('form.time.finish')}</Text>
            <DatePicker
              onlyTime
              value={endDate}
              onChange={handleEndTimeChange}
            />
          </Box>

          {isPublicActivity && (
            <Box mt="4">
              <Text fontSize="sm">{t('form.capacity.label')}</Text>
              <NumberInput
                min={1}
                max={40}
                value={recurrence.capacity}
                variant="filled"
                onChange={handleCapacityChange}
              >
                <NumberInputField placeholder="Capacity" />
              </NumberInput>
            </Box>
          )}
        </Box>
      </Wrap>

      {recurrence.conflict && (
        <Box>
          <Text fontSize="sm" textAlign="center" fontWeight="bold">
            There's already a booking for this resource at this date & time:{' '}
          </Text>
          <Code>
            {recurrence.conflict.startDate === recurrence.conflict.endDate
              ? recurrence.conflict.startDate
              : recurrence.conflict.startDate +
                '-' +
                recurrence.conflict.endDate}
            {', '}
            {recurrence.conflict.startTime +
              ' – ' +
              recurrence.conflict.endTime}
          </Code>
        </Box>
      )}
    </Box>
  );
};

export default DatesAndTimes;
