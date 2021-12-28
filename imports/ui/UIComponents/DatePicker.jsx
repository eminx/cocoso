import React, { useEffect, useState } from 'react';
import RDC from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from '@chakra-ui/react';

function DatePicker({ value, onChange, onlyTime = false, noTime = true }) {
  const [selectedDate, setSelectedDate] = useState();

  useEffect(() => {
    if (value) {
      setSelectedDate(unFormatDate(value));
    }
  }, []);

  const handleChange = (date) => {
    setSelectedDate(date);
    if (onlyTime) {
      onChange(formatTime(date));
    } else if (noTime) {
      onChange(formatDate(date));
    } else {
      onChange({
        date: formatDate(date),
        time: formatTime(date),
      });
    }
  };

  return (
    <RDC
      calendarStartDay={1}
      customInput={<Input variant="filled" />}
      dateFormat={
        onlyTime ? 'HH:mm' : noTime ? 'yyyy-MM-dd' : 'yyyy-MM-dd  HH:mm'
      }
      placeholderText={
        onlyTime ? 'Select Time' : noTime ? 'Select Day' : 'Select Day & Time'
      }
      selected={selectedDate}
      showTimeSelect={onlyTime || !noTime}
      showTimeSelectOnly={onlyTime}
      timeFormat="p"
      timeIntervals={15}
      onChange={handleChange}
    />
  );
}

function appendLeadingZeroes(n) {
  if (n <= 9) {
    return '0' + n;
  }
  return n;
}

function unFormatDate({ date, time }) {
  if (!date || !time) {
    return new Date();
  }
  return new Date(`${date}T${time}`);
}

function formatDate(date) {
  return (
    date.getFullYear() +
    '-' +
    appendLeadingZeroes(date.getMonth() + 1) +
    '-' +
    appendLeadingZeroes(date.getDate())
  );
}

function formatTime(date) {
  return (
    appendLeadingZeroes(date.getHours()) +
    ':' +
    appendLeadingZeroes(date.getMinutes())
  );
}

export default DatePicker;
