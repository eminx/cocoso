import React, { useState, useEffect } from 'react';
import loadable from '@loadable/component';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { Box, Flex, Text, Skeleton } from '/imports/ui/core';

dayjs.extend(customParseFormat);

// Lazy load antd components - they're heavy!
const AntTimePicker = loadable(() => import('antd/lib/time-picker'), {
  ssr: false, // antd components don't work well with SSR
});
const AntDatePicker = loadable(() => import('antd/lib/date-picker'), {
  ssr: false,
});
const ConfigProvider = loadable(() => import('antd/lib/config-provider'), {
  ssr: false,
});

// Lazy load locales
const loadLocale = async (lang: string) => {
  switch (lang) {
    case 'sv':
      return (await import('antd/locale/sv_SE')).default;
    case 'tr':
      return (await import('antd/locale/tr_TR')).default;
    default:
      return (await import('antd/locale/en_GB')).default;
  }
};

const antTheme = {
  components: {
    DatePicker: {
      zIndexPopup: 1500,
    },
    TimePicker: {
      zIndexPopup: 1500,
    },
  },
};

interface DatePickerProps {
  disabledDate?: string;
  label?: string;
  value?: string;
  onChange?: (date: any) => void;
  DatePickerComponent: any;
}

function DatePicker({
  disabledDate,
  label,
  value,
  onChange,
  DatePickerComponent,
}: DatePickerProps) {
  if (!DatePickerComponent) {
    return (
      <Box mb="4">
        <Text mb="2">{label}</Text>
        <Box h="40px" w="170px" />
      </Box>
    );
  }
  return (
    <Box mb="4">
      <Text mb="2">{label}</Text>
      <DatePickerComponent
        disabledDate={
          disabledDate ? (date) => date && date < dayjs(disabledDate) : null
        }
        size="large"
        value={dayjs(value, 'YYYY-MM-DD')}
        onChange={onChange}
      />
    </Box>
  );
}

interface TimePickerProps {
  label?: string;
  value?: string;
  onChange?: (time: any) => void;
  TimePickerComponent: any;
}

function TimePicker({ label, value, onChange, TimePickerComponent }: TimePickerProps) {
  if (!TimePickerComponent) {
    return (
      <Box>
        <Text mb="2">{label}</Text>
        <Box h="40px" w="170px" />
      </Box>
    );
  }
  return (
    <Box>
      <Text mb="2">{label}</Text>
      <TimePickerComponent
        format="HH:mm"
        minuteStep={5}
        needConfirm={false}
        size="large"
        value={dayjs(value, 'HH:mm')}
        onChange={onChange}
      />
    </Box>
  );
}

interface DateTimeValue {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  isRange?: boolean;
}

export interface DateTimePickerProps {
  value: DateTimeValue;
  onChange: (value: DateTimeValue) => void;
}

export default function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [t] = useTranslation('activities');
  const { i18n } = useTranslation();
  const [locale, setLocale] = useState<any>(null);

  const isRange = value?.isRange || value.startDate !== value.endDate;

  // Load locale dynamically
  useEffect(() => {
    loadLocale(i18n.language).then(setLocale);
  }, [i18n.language]);

  const handleDateChange = (date: any, entity: string) => {
    if (!date) {
      return;
    }

    const parsedValue = {
      ...value,
    };

    if (isRange) {
      if (entity === 'endDate') {
        parsedValue.endDate = date.format('YYYY-MM-DD');
      } else {
        parsedValue.startDate = date.format('YYYY-MM-DD');
        if (dayjs(parsedValue.startDate).isAfter(dayjs(parsedValue.endDate))) {
          parsedValue.endDate = date.format('YYYY-MM-DD');
        }
      }
    } else {
      parsedValue.startDate = date.format('YYYY-MM-DD');
      parsedValue.endDate = date.format('YYYY-MM-DD');
    }

    onChange(parsedValue);
  };

  const handleTimeChange = (time: any, entity: string) => {
    if (!time) {
      return;
    }

    const parsedValue = {
      ...value,
    };

    parsedValue[entity] = time.format('HH:mm');
    if (
      !isRange &&
      dayjs(parsedValue.startTime).isAfter(dayjs(parsedValue.endTime))
    ) {
      parsedValue.endTime = time.format('HH:mm');
    }

    onChange(parsedValue);
  };

  // Show skeleton while antd components and locale load
  if (!locale) {
    return (
      <Box w="100%" py="2">
        <Skeleton isEntry={false} count={2} />
      </Box>
    );
  }

  return (
    <Box w="100%" py="2">
      <ConfigProvider locale={locale} theme={antTheme}>
        <Flex>
          <Box w="170px" mr="2">
            <DatePicker
              DatePickerComponent={AntDatePicker}
              label={isRange ? t('form.date.start') : t('form.days.single')}
              value={value?.startDate}
              onChange={(date) => handleDateChange(date, 'startDate')}
            />
          </Box>

          {isRange && (
            <Box w="170px" mr="2">
              <DatePicker
                DatePickerComponent={AntDatePicker}
                disabledDate={value.startDate}
                label={t('form.date.finish')}
                value={value?.endDate}
                onChange={(date) => handleDateChange(date, 'endDate')}
              />
            </Box>
          )}
        </Flex>

        <Flex>
          <Box w="170px" mr="2">
            <TimePicker
              TimePickerComponent={AntTimePicker}
              label={t('form.time.start')}
              value={value?.startTime}
              onChange={(time) => handleTimeChange(time, 'startTime')}
            />
          </Box>

          <Box w="170px">
            <TimePicker
              TimePickerComponent={AntTimePicker}
              label={t('form.time.finish')}
              value={value?.endTime}
              onChange={(time) => handleTimeChange(time, 'endTime')}
            />
          </Box>
        </Flex>
      </ConfigProvider>
    </Box>
  );
}
