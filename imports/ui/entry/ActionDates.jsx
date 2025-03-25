import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import dayjs from 'dayjs';

import { DateJust } from './FancyDate';

const now = dayjs();

const getFutureOccurrences = (dates) =>
  dates.filter((date) =>
    dayjs(`${date.startDate} ${date.startTime}`, 'YYYY-MM-DD HH:mm').isAfter(now)
  );

const getPastOccurrences = (dates) =>
  dates.filter((date) =>
    dayjs(`${date.startDate} ${date.startTime}`, 'YYYY-MM-DD HH:mm').isBefore(now)
  );

export default function ActionDates({ activity, showPast = false, showTime = false }) {
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
