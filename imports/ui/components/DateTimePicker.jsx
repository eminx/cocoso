import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/src/style.css';
import { en, sv, tr } from 'date-fns/locale';
import moment from 'moment';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import Popover from './Popover';
import i18n from '../../startup/i18n';

export default function DateTimePicker({ isRange, value, onChange }) {
  const [t] = useTranslation('activities');

  const handleDateChange = (date, entity) => {
    if (!date) {
      return;
    }

    const parsedValue = {
      ...value,
    };

    const parsedDate = moment(date)?.format('YYYY-MM-DD');

    if (entity === 'startDate') {
      parsedValue.startDate = parsedDate;
    }

    if (entity === 'endDate') {
      parsedValue.endDate = parsedDate;
    }

    onChange(parsedValue);
  };

  const handleTimeChange = (e, entity) => {
    e.preventDefault();
    const time = e.target.value;
    if (!time) {
      return;
    }

    const parsedValue = {
      ...value,
    };

    if (entity === 'startTime') {
      parsedValue.startTime = time;
    }
    if (entity === 'endTime') {
      parsedValue.endTime = time;
    }

    onChange(parsedValue);
  };

  return (
    <Box w="100%" py="2">
      <Flex w="100%">
        <Box w={isRange ? '165px' : 'auto'}>
          <DatePicker
            placeholder={isRange ? t('form.date.start') : t('form.days.single')}
            value={value?.startDate || new Date()}
            onChange={(date) => handleDateChange(date, 'startDate')}
          />
        </Box>
        {isRange && (
          <DatePicker
            placeholder={t('form.date.finish')}
            value={value?.endDate || new Date()}
            onChange={(date) => handleDateChange(date, 'endDate')}
          />
        )}
      </Flex>

      <Flex w="100%">
        <Box w="165px">
          <TimePicker
            label={t('form.time.start')}
            value={value?.startTime || '08:00'}
            onChange={(e) => handleTimeChange(e, 'startTime')}
          />
        </Box>
        <Box>
          <TimePicker
            label={t('form.time.finish')}
            value={value?.endTime || '16:00'}
            onChange={(e) => handleTimeChange(e, 'endTime')}
          />
        </Box>
      </Flex>
    </Box>
  );
}

function DatePicker({ placeholder, value, onChange }) {
  const [month, setMonth] = useState(new Date());

  const locale = i18n.language === 'sv' ? sv : i18n.language === 'tr' ? tr : en;
  const monthShown = value?.date || month;

  return (
    <Box>
      <Text>{placeholder}:</Text>
      <Popover
        closeOnBlur={false}
        isDark={false}
        triggerComponent={
          <Box py="2" mb="2">
            <Button bg="white" color="$gray.800" size="lg" variant="outline">
              {value && moment(value).format('YYYY-MM-DD')}
            </Button>
          </Box>
        }
      >
        <DayPicker
          locale={locale}
          mode="single"
          month={monthShown}
          selected={value}
          showOutsideDays
          // showWeekNumber
          weekStartsOn={1}
          onMonthChange={setMonth}
          onSelect={onChange}
        />
      </Popover>
    </Box>
  );
}

function TimePicker({ label, value, onChange }) {
  return (
    <Box>
      <label>
        {label}
        {': '}
        <br />
        <input
          type="time"
          value={value}
          style={{ fontSize: '120%', fontWeight: 'bold', marginTop: '8px', padding: '2px 8px' }}
          onChange={onChange}
        />
      </label>
    </Box>
  );
}
