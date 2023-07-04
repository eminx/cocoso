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

function DatesAndTimes({
  recurrence,
  id,
  handleStartDateChange,
  handleEndDateChange,
  handleStartTimeChange,
  handleEndTimeChange,
  handleCapacityChange,
  handleRangeSwitch,
  removeRecurrence,
  isDeletable,
  isPublicActivity,
}) {
  if (!recurrence) {
    return null;
  }

  const [t] = useTranslation('activities');

  const isRange = recurrence.isRange;

  const startDate = {
    date: recurrence.startDate,
    time: recurrence.startTime,
  };

  const endDate = {
    date: recurrence.endDate,
    time: recurrence.endTime,
  };

  const getBorderColorStyle = () => {
    if (!recurrence.conflict) {
    } else if (recurrence.isConflictOK) {
      return 'orange';
    } else {
      return 'red';
    }
  };

  return (
    <Box bg="brand.50" borderColor={getBorderColorStyle()} mb="4" p="4">
      {isDeletable && (
        <Flex justify="flex-end" mb="4">
          <IconButton onClick={removeRecurrence} size="sm" icon={<DeleteIcon />} />
        </Flex>
      )}

      <Center>
        <FormControl w="auto" alignItems="center" display="flex">
          <Switch isChecked={isRange} id={id} onChange={handleRangeSwitch} py="2" />
          <FormLabel htmlFor={id} mb="1" ml="2">
            {t('form.days.multiple')}
          </FormLabel>
        </FormControl>
      </Center>

      <Wrap>
        <Box p="2">
          <Box mb="2">
            <Text fontSize="sm">{isRange ? t('form.date.start') : t('form.days.single')}</Text>
            <DatePicker noTime value={startDate} onChange={handleStartDateChange} />
          </Box>

          {isRange && (
            <Box>
              <Text fontSize="sm">{t('form.date.finish')}</Text>
              <DatePicker
                noTime
                value={endDate}
                onChange={handleEndDateChange}
                minDate={new Date(startDate.date)}
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
            <Text fontSize="sm">{t('form.time.start')}</Text>
            <DatePicker onlyTime value={startDate} onChange={handleStartTimeChange} />
          </Box>

          <Box>
            <Text fontSize="sm">{t('form.time.finish')}</Text>
            <DatePicker onlyTime value={endDate} onChange={handleEndTimeChange} />
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

      {recurrence.conflict && <ConflictMarker recurrence={recurrence} t={t} />}
    </Box>
  );
}

function ConflictMarker({ recurrence, t }) {
  return (
    <Box>
      <Text fontSize="sm" textAlign="center" fontWeight="bold">
        {t('form.conflict.alert')}
        <br />
      </Text>
      <Code
        colorScheme={recurrence.isConflictOK ? 'orange' : 'red'}
        mx="auto"
        display="block"
        width="fit-content"
        mt="4"
      >
        {recurrence.conflict.startDate === recurrence.conflict.endDate
          ? recurrence.conflict.startDate
          : `${recurrence.conflict.startDate}-${recurrence.conflict.endDate}`}
        {', '}
        {`${recurrence.conflict.startTime} – ${recurrence.conflict.endTime}`}
      </Code>
      {recurrence.isConflictOK && (
        <Text fontSize="sm" fontWeight="bold" mt="2" textAlign="center">
          {t('form.conflict.notExclusiveInfo')}
        </Text>
      )}
    </Box>
  );
}

export { ConflictMarker };

export default DatesAndTimes;
