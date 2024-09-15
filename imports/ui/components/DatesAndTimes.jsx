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
import { useTranslation } from 'react-i18next';

// import DatePicker from './DatePicker';
import DateTimePicker from './DateTimePicker';

const maxAttendees = 1000;

function DatesAndTimes({
  occurrence,
  id,
  handleDateTimeChange,
  handleCapacityChange,
  handleRangeSwitch,
  removeOccurrence,
  isDeletable,
  isPublicActivity,
}) {
  if (!occurrence) {
    return null;
  }

  const [t] = useTranslation('activities');

  const isRange = occurrence.isRange;

  const getBorderColorStyle = () => {
    if (!occurrence.conflict) {
    } else if (occurrence.isConflictOK) {
      return 'orange';
    } else {
      return 'red';
    }
  };

  return (
    <Box bg="brand.50" borderColor={getBorderColorStyle()} mb="4" p="4" position="relative">
      {isDeletable && (
        <Flex justify="flex-end" mb="4" position="absolute" right="0" top="0">
          <IconButton onClick={removeOccurrence} size="sm" icon={<DeleteIcon />} />
        </Flex>
      )}

      <Center mb="2">
        <FormControl w="auto" alignItems="center" display="flex">
          <Switch isChecked={isRange} id={id} onChange={handleRangeSwitch} py="2" />
          <FormLabel htmlFor={id} mb="1" ml="2">
            {t('form.days.multiple')}
          </FormLabel>
        </FormControl>
      </Center>

      <Wrap>
        <Box mb="2">
          <DateTimePicker isRange={isRange} value={occurrence} onChange={handleDateTimeChange} />
        </Box>

        <Box
          flexDirection="column"
          p="2"
          mb="6"
          justify="space-around"
          flexGrow={0}
          flexBasis="180px"
        >
          {isPublicActivity && (
            <Box mt="4">
              <Text fontSize="sm">{t('form.capacity.label')}</Text>
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
        </Box>
      </Wrap>

      {occurrence.conflict && <ConflictMarker occurrence={occurrence} t={t} />}
    </Box>
  );
}

function ConflictMarker({ occurrence, t }) {
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

export { ConflictMarker };

export default DatesAndTimes;
