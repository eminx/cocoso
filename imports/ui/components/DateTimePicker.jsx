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
    <Box w="100%" py="2" data-oid="9::wt69">
      <Flex data-oid="u70ewdx">
        <Box w="170px" mr="2" data-oid="qf_4zqo">
          <DatePicker
            label={isRange ? t('form.date.start') : t('form.days.single')}
            value={value.startDate}
            onChange={(date) => handleDateChange(date, 'startDate')}
            data-oid="v6d82ys"
          />
        </Box>

        {isRange && (
          <DatePicker
            disabledDate={value.startDate}
            label={t('form.date.finish')}
            value={value.endDate}
            onChange={(date) => handleDateChange(date, 'endDate')}
            data-oid="4tp-7hn"
          />
        )}
      </Flex>

      <Flex data-oid="q227_w1">
        <Box w="170px" data-oid="shypc7d">
          <TimePicker
            label={t('form.time.start')}
            value={value?.startTime || '08:00'}
            onChange={(time) => handleTimeChange(time, 'startTime')}
            data-oid="ohfm4d-"
          />
        </Box>

        <TimePicker
          label={t('form.time.finish')}
          value={value?.endTime || '16:00'}
          onChange={(time) => handleTimeChange(time, 'endTime')}
          data-oid="jojc2-n"
        />
      </Flex>
    </Box>
  );
}

function DatePicker({ disabledDate, label, value, onChange }) {
  const locale = i18n.language === 'sv' ? sv : i18n.language === 'tr' ? tr : en;

  return (
    <Box mb="4" data-oid="2om0rd.">
      <Text mb="2" data-oid="hdolx-h">
        {label}
      </Text>
      <ConfigProvider locale={locale} data-oid=".sw2m7s">
        <AntDatePicker
          disabledDate={disabledDate ? (date) => date && date < dayjs(disabledDate) : null}
          size="large"
          value={dayjs(value, 'YYYY-MM-DD')}
          onChange={onChange}
          data-oid="hnnxye3"
        />
      </ConfigProvider>
    </Box>
  );
}

function TimePicker({ label, value, onChange }) {
  const locale = i18n.language === 'sv' ? sv : i18n.language === 'tr' ? tr : en;

  return (
    <Box data-oid="qy89fko">
      <Text mb="2" data-oid="5vi624q">
        {label}
        {': '}
      </Text>

      <ConfigProvider locale={locale} data-oid="kirdz.d">
        <AntTimePicker
          format="HH:mm"
          minuteStep={5}
          size="large"
          value={dayjs(value, 'HH:mm')}
          onChange={onChange}
          data-oid=".6jrwyb"
        />
      </ConfigProvider>
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
