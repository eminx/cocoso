import React, { useContext, useEffect } from 'react';
import { Box, Center, IconButton, Select, VStack } from '@chakra-ui/react';
import AddIcon from 'lucide-react/dist/esm/icons/plus';
import { useTranslation } from 'react-i18next';
import parseHtml from 'html-react-parser';

import DatesAndTimes from './DatesAndTimes';
import FormField from './FormField';
import { localeSort } from '../utils/shared';
import { StateContext } from '../LayoutContainer';

const defaultCapacity = 40;
const today = new Date().toISOString().substring(0, 10);

const emptyDateAndTime = {
  startDate: today,
  endDate: today,
  startTime: '00:00',
  endTime: '23:59',
  attendees: [],
  capacity: defaultCapacity,
};

export default function ActivityFormPublic({
  datesAndTimes,
  defaultValues,
  resources,
  setDatesAndTimes,
  setSelectedResource,
}) {
  const { currentHost } = useContext(StateContext);

  const [t] = useTranslation('activities');

  const addOccurrence = () => {
    const newDatesAndTimes = [...datesAndTimes, { ...emptyDateAndTime }];

    setDatesAndTimes(newDatesAndTimes);
  };

  const removeOccurrence = (index) => {
    const newDatesAndTimes = datesAndTimes.filter((item, i) => i !== index);

    setDatesAndTimes(newDatesAndTimes);
  };

  const handleDateTimeChange = (date, occurrenceIndex) => {
    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (index === occurrenceIndex) {
        return date;
      }
      return item;
    });

    setDatesAndTimes(newDatesAndTimes);
  };

  const handleRangeSwitch = (event, occurrenceIndex) => {
    const value = event.target.checked;
    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (occurrenceIndex === index && !value) {
        return {
          ...item,
          endDate: item.startDate,
        };
      }
      return item;
    });

    setDatesAndTimes(newDatesAndTimes);
  };

  const resourcesInMenu = currentHost?.settings?.menu?.find((item) => item.name === 'resources');

  return (
    <VStack spacing="6">
      <Box>
        <FormField
          helperText={t('form.occurrences.helper')}
          label={<b>{t('form.occurrences.label')}</b>}
          isRequired
        />

        <Box mb="4" mt="2">
          {datesAndTimes.map((occurrence, index) => {
            const id =
              occurrence.startDate +
              occurrence.endDate +
              occurrence.startTime +
              occurrence.endTime +
              index;
            return (
              <DatesAndTimes
                key={id}
                id={id}
                isPublicActivity
                occurrence={occurrence}
                removeOccurrence={() => removeOccurrence(index)}
                isDeletable={datesAndTimes.length > 1}
                handleCapacityChange={(value) => handleCapacityChange(value, index)}
                handleDateTimeChange={(date) => handleDateTimeChange(date, index)}
                handleRangeSwitch={(event) => handleRangeSwitch(event, index)}
              />
            );
          })}
          <Center bg="white" borderRadius="8px" p="6">
            <IconButton bg="gray.700" size="lg" onClick={addOccurrence} icon={<AddIcon />} />
          </Center>
        </Box>
      </Box>

      <FormField
        helperText={t('form.resource.helper')}
        label={
          <b>
            {parseHtml(
              t('form.resource.label', {
                resources: resourcesInMenu?.label,
              })
            )}
          </b>
        }
      >
        <Select
          {...register('resourceId')}
          placeholder={t('form.resource.holder')}
          onChange={(e) => setSelectedResource(e.target.value)}
        >
          {resources
            .sort(localeSort)
            .filter((r) => r.isBookable)
            .map((option) => (
              <option
                key={option._id}
                selected={option._id === defaultValues.resourceId}
                value={option._id}
              >
                {option.isCombo
                  ? `${option.label}: [${option.resourcesForCombo.map((res) => res.label)}]`
                  : option.label}
              </option>
            ))}
        </Select>
      </FormField>
    </VStack>
  );
}
