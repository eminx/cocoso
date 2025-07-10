import React from 'react';
import dayjs from 'dayjs';

import { Box, Flex } from '../core';
import { DateJust } from './FancyDate';

const today = dayjs().format('YYYY-MM-DD');
const yesterday = dayjs(new Date())
  .add(-1, 'days')
  .format('YYYY-MM-DD');

const getFutureOccurrences = (dates) =>
  dates.filter((date) =>
    dayjs(date.endDate, 'YYYY-MM-DD').isAfter(yesterday)
  );

const getPastOccurrences = (dates) =>
  dates.filter((date) =>
    dayjs(date.endTime, 'YYYY-MM-DD').isBefore(today)
  );

export default function ActionDates({
  activity,
  showPast = false,
  showTime = false,
}) {
  if (
    !activity ||
    !activity.datesAndTimes ||
    !activity.datesAndTimes.length
  ) {
    return null;
  }

  const dates = showPast
    ? getPastOccurrences(activity.datesAndTimes)
    : getFutureOccurrences(activity.datesAndTimes);

  if (!dates || !dates.length) {
    return null;
  }

  return (
    <Flex justify="center" wrap="wrap">
      {dates.map(
        (occurrence, occurrenceIndex) =>
          occurrence && (
            <Flex
              key={occurrence.startDate + occurrence.startTime}
              color="gray.700"
              mx="2"
              ml={occurrenceIndex === 0 ? '0' : '2'}
              textShadow="1px 1px 1px #fff"
            >
              <Box>
                <DateJust time={showTime ? occurrence.startTime : null}>
                  {occurrence.startDate}
                </DateJust>
              </Box>
              {occurrence.startDate !== occurrence.endDate && (
                <Flex>
                  {'-'}
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
