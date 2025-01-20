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
import DeleteIcon from 'lucide-react/dist/esm/icons/x';
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

  const getBorderColor = () => {
    if (!occurrence.conflict) {
      return 'green.300';
    } else if (occurrence.isConflictOK) {
      return 'orange';
    } else {
      return 'red';
    }
  };

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor={getBorderColor()}
      mb="4"
      p="4"
      position="relative"
      data-oid="b00omlu"
    >
      {isDeletable && (
        <IconButton
          bg="gray.700"
          icon={<DeleteIcon data-oid="einc4:2" />}
          position="absolute"
          right="12px"
          top="12px"
          size="sm"
          zIndex={9}
          onClick={removeOccurrence}
          data-oid="1vs-4zq"
        />
      )}

      <Box mb="2" data-oid="q_qoibe">
        <FormControl w="auto" alignItems="center" display="flex" data-oid="0hxmngs">
          <Switch
            isChecked={isRange}
            id={id}
            onChange={handleRangeSwitch}
            py="2"
            data-oid=".tl0enc"
          />
          <FormLabel htmlFor={id} mb="1" ml="2" data-oid="iq5lj1n">
            {t('form.days.multiple')}
          </FormLabel>
        </FormControl>
      </Box>

      <Wrap data-oid="1cdwhn0">
        <Box data-oid="vj0eak-">
          <DateTimePicker
            isRange={isRange}
            value={occurrence}
            onChange={handleDateTimeChange}
            data-oid="-tf97bh"
          />
        </Box>

        <Box
          flexDirection="column"
          mb="6"
          justify="space-around"
          flexGrow={0}
          flexBasis="180px"
          data-oid="a1n_zs-"
        >
          {isPublicActivity && (
            <Box mt="4" data-oid="eer0.re">
              <Text mb="2" data-oid="_bt_a-3">
                {t('form.capacity.label')}:
              </Text>
              <NumberInput
                min={1}
                max={maxAttendees}
                value={occurrence.capacity}
                variant="filled"
                onChange={handleCapacityChange}
                data-oid="9mjnqw1"
              >
                <NumberInputField placeholder="Capacity" data-oid="agweeee" />
              </NumberInput>
            </Box>
          )}
        </Box>
      </Wrap>

      {occurrence.conflict && <ConflictMarker occurrence={occurrence} t={t} data-oid="j5d6v10" />}
    </Box>
  );
}

function ConflictMarker({ occurrence, t }) {
  return (
    <Box data-oid="0kawd4o">
      <Text fontSize="sm" textAlign="center" fontWeight="bold" data-oid="lobvuow">
        {t('form.conflict.alert')}
        <br data-oid=":0qx4bc" />
      </Text>
      <Code
        colorScheme={occurrence.isConflictOK ? 'orange' : 'red'}
        mx="auto"
        display="block"
        width="fit-content"
        mt="4"
        data-oid="y5ah.:a"
      >
        {occurrence.conflict.startDate === occurrence.conflict.endDate
          ? occurrence.conflict.startDate
          : `${occurrence.conflict.startDate}-${occurrence.conflict.endDate}`}
        {', '}
        {`${occurrence.conflict.startTime} – ${occurrence.conflict.endTime}`}
      </Code>
      {occurrence.isConflictOK && (
        <Text fontSize="sm" fontWeight="bold" mt="2" textAlign="center" data-oid="th3ky0-">
          {t('form.conflict.notExclusiveInfo')}
        </Text>
      )}
    </Box>
  );
}

export { ConflictMarker };

export default DatesAndTimes;
