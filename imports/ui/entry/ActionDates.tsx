import React from 'react';
import dayjs from 'dayjs';

import { Box, Flex } from '../core';
import { DateJust } from './FancyDate';

const today = dayjs().format('YYYY-MM-DD');
const yesterday = dayjs(new Date()).add(-1, 'days').format('YYYY-MM-DD');

export interface DateOccurrence {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface Activity {
  datesAndTimes?: DateOccurrence[];
}

const getFutureOccurrences = (dates: DateOccurrence[]): DateOccurrence[] =>
  dates.filter((date) => dayjs(date.endDate, 'YYYY-MM-DD').isAfter(yesterday));

const getPastOccurrences = (dates: DateOccurrence[]): DateOccurrence[] =>
  dates.filter((date) => dayjs(date.endTime, 'YYYY-MM-DD').isBefore(today));

export interface ActionDatesProps {
  activity?: Activity | null;
  showPast?: boolean;
  showTime?: boolean;
}

export default function ActionDates({
  activity,
  showPast = false,
  showTime = true,
}: ActionDatesProps) {
  if (!activity || !activity.datesAndTimes || !activity.datesAndTimes.length) {
    return null;
  }

  const dates = showPast
    ? getPastOccurrences(activity.datesAndTimes)
    : getFutureOccurrences(activity.datesAndTimes);

  if (!dates || !dates.length) {
    return null;
  }

  return (
    <Flex justify="center" gap="2" wrap="wrap">
      {dates.map(
        (occurrence, occurrenceIndex) =>
          occurrence && (
            <Flex
              key={occurrence.startDate + occurrence.startTime}
              pl={occurrenceIndex === 0 ? '0' : '2'}
              pr="2"
              py="1"
            >
              <Box>
                <DateJust time={showTime ? occurrence.startTime : null}>
                  {occurrence.startDate}
                </DateJust>
              </Box>
              {occurrence.startDate !== occurrence.endDate && (
                <Flex>
                  <span style={{ margin: '0 4px', fontSize: '200%' }}>
                    {'-'}
                  </span>
                  <DateJust time={showTime ? occurrence.endTime : null}>
                    {occurrence.endDate}
                  </DateJust>
                </Flex>
              )}
            </Flex>
          )
      )}
    </Flex>
  );
}
