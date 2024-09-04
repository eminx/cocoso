import React, { useState } from 'react';
import { DayPicker as DayPickerX } from 'react-day-picker';
import 'react-day-picker/src/style.css';
import { sv } from 'date-fns/locale';

export default function DayPicker({ value, onChange }) {
  console.log(value);

  const handleDayClick = (date) => {
    console.log(date);
    onChange(date);
    // setCurrentMonth(date);
  };

  return (
    <DayPickerX
      locale={sv}
      mode="single"
      // month={currentMonth}
      // selected={value.date}
      showWeekNumber
      weekStartsOn={1}
      // onMonthChange={handleDayClick}
      onSelect={handleDayClick}
    />
  );
}
