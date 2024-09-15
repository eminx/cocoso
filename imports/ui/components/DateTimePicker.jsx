import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import AntTimePicker from 'antd/lib/time-picker';
import AntDatePicker from 'antd/lib/date-picker';
import ConfigProvider from 'antd/lib/config-provider';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import en from 'antd/locale/en_US';
import sv from 'antd/locale/sv_SE';
import tr from 'antd/locale/tr_TR';

import i18n from '../../startup/i18n';

const locale = i18n.language === 'sv' ? sv : i18n.language === 'tr' ? tr : en;

export default function DateTimePicker({ isRange, value, onChange }) {
  const [t] = useTranslation('activities');

  const handleDateChange = (date, entity) => {
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

  const handleTimeChange = (time, entity) => {
    if (!time) {
      return;
    }

    const parsedValue = {
      ...value,
    };

    parsedValue[entity] = time.format('HH:mm');
    if (!isRange && dayjs(parsedValue.startTime).isAfter(dayjs(parsedValue.endTime))) {
      parsedValue.endTime = time.format('HH:mm');
    }

    onChange(parsedValue);
  };

  return (
    <Box w="100%" py="2">
      <Flex>
        <Box w="170px">
          <DatePicker
            label={isRange ? t('form.date.start') : t('form.days.single')}
            value={value.startDate}
            onChange={(date) => handleDateChange(date, 'startDate')}
          />
        </Box>

        {isRange && (
          <DatePicker
            disabledDate={value.startDate}
            label={t('form.date.finish')}
            value={value.endDate}
            onChange={(date) => handleDateChange(date, 'endDate')}
          />
        )}
      </Flex>

      <Flex>
        <Box w="170px">
          <TimePicker
            label={t('form.time.start')}
            value={value?.startTime || '08:00'}
            onChange={(time) => handleTimeChange(time, 'startTime')}
          />
        </Box>

        <TimePicker
          label={t('form.time.finish')}
          value={value?.endTime || '16:00'}
          onChange={(time) => handleTimeChange(time, 'endTime')}
        />
      </Flex>
    </Box>
  );
}

function DatePicker({ disabledDate, label, value, onChange }) {
  return (
    <Box mb="4">
      <Text mb="2">{label}</Text>
      <ConfigProvider locale={locale}>
        <AntDatePicker
          disabledDate={(date) => date && date < dayjs(disabledDate)}
          size="large"
          value={dayjs(value, 'YYYY-MM-DD')}
          onChange={onChange}
        />
      </ConfigProvider>
    </Box>
  );
}

function TimePicker({ label, value, onChange }) {
  return (
    <Box>
      <Text mb="2">
        {label}
        {': '}
      </Text>

      <AntTimePicker
        format="HH:mm"
        minuteStep={5}
        size="large"
        value={dayjs(value, 'HH:mm')}
        onChange={onChange}
      />
    </Box>
  );
}

// function DatePicker({ placeholder, value, onChange }) {
//   const [month, setMonth] = useState(new Date());

//   const locale = i18n.language === 'sv' ? sv : i18n.language === 'tr' ? tr : en;
//   const monthShown = value?.date || month;

//   return (
//     <Box>
//       <Text>{placeholder}:</Text>
//       <Popover
//         closeOnBlur={false}
//         isDark={false}
//         trigger="click"
//         triggerComponent={
//           <Box py="2" mb="2">
//             <Button bg="white" color="$gray.800" fontWeight="normal" size="lg" variant="outline">
//               {value}
//             </Button>
//           </Box>
//         }
//       >
//         <DayPicker
//           locale={locale}
//           mode="single"
//           month={monthShown}
//           selected={value}
//           showOutsideDays
//           // showWeekNumber
//           weekStartsOn={1}
//           onMonthChange={setMonth}
//           onSelect={onChange}
//         />
//       </Popover>
//     </Box>
//   );
// }
