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

const DatesAndTimes = ({
  recurrence,
  handleDateChange,
  handleStartTimeChange,
  handleFinishTimeChange,
  handleCapacityChange,
  handleRangeSwitch,
  removeRecurrence,
  isNotDeletable,
  isPublicActivity,
}) => {
  if (!recurrence) {
    return null;
  }

  const isRange = recurrence.isRange;

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
            checked={isRange}
            id="is-multipledays-switch"
            onChange={handleRangeSwitch}
            py="2"
          />
          <FormLabel htmlFor="is-multipledays-switch" mb="1" ml="2">
            Multiple Days
          </FormLabel>
        </FormControl>
      </Center>

      <Wrap>
        <Box p="2">
          <Box mb="2">
            <Text fontSize="sm">{isRange ? 'Start Day' : 'Day'}</Text>
            <DatePicker
              noTime
              value={recurrence.startDate}
              onChange={handleDateChange}
            />
          </Box>

          {isRange && (
            <Box>
              <Text fontSize="sm">Finish Day</Text>
              <DatePicker
                noTime
                value={recurrence.endDate}
                onChange={handleDateChange}
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
            <Text fontSize="sm">Start time</Text>
            <DatePicker
              onlyTime
              value={recurrence.startTime}
              onChange={handleStartTimeChange}
            />
          </Box>

          <Box>
            <Text fontSize="sm">Finish time</Text>
            <DatePicker
              onlyTime
              value={recurrence.endTime}
              onChange={handleFinishTimeChange}
            />
          </Box>

          {isPublicActivity && (
            <Box mt="4">
              <Text fontSize="sm">Capacity</Text>
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
