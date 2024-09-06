import React, { useState } from 'react';
import { DayPicker as DayPickerX } from 'react-day-picker';
import 'react-day-picker/src/style.css';
import { en, sv, tr } from 'date-fns/locale';
import moment from 'moment';
import i18n from '../../startup/i18n';

export default function DayPicker({ value, onChange }) {
  const [month, setMonth] = useState(new Date());
  const handleSelect = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    onChange(formattedDate);
  };
  const locale = i18n.language === 'sv' ? sv : i18n.language === 'tr' ? tr : en;
  const monthShown = value?.date || month;

  return (
    <DayPickerX
      locale={locale}
      mode="single"
      month={monthShown}
      selected={value?.date}
      showWeekNumber
      weekStartsOn={1}
      onMonthChange={setMonth}
      onSelect={handleSelect}
    />
  );
}
