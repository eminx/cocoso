import React from 'react';
import dayjs from 'dayjs';
import { Box, Flex, HStack } from '@chakra-ui/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

import { DateJust } from './FancyDate';

const yesterday = dayjs(new Date()).add(-1, 'days');
const today = dayjs(new Date());

const dateStyle = {
  fontWeight: 700,
  lineHeight: 1,
};

const imageStyle = {
  height: '315px',
  maxWidth: '550px',
  objectFit: 'cover',
  width: '100%',
};

function ThumbDate({ date }) {
  if (!date) {
    return null;
  }

  const isPast = dayjs(date.endDate)?.isBefore(today);

  return (
    <Flex
      key={date.startDate + date.startTime}
      align="center"
      color={isPast ? 'gray.400' : 'white'}
    >
      <DateJust>{date.startDate}</DateJust>
      {date.startDate !== date.endDate && <span style={{ margin: '0 2px' }}>–</span>}
      {date.startDate !== date.endDate && <DateJust>{date.endDate}</DateJust>}
    </Flex>
  );
}

function SexyThumb({ avatar, dates, host, imageUrl, subTitle, showPast = false, title, tag }) {
  const futureDates =
    dates &&
    dates
      .filter((date) => dayjs(date?.endDate)?.isAfter(yesterday))
      .sort((a, b) => dayjs(a?.startDate) - dayjs(b?.startDate));
  const remaining = futureDates && futureDates.length - 3;
  const pastDates =
    dates &&
    dates
      .filter((date) => dayjs(date?.startDate)?.isBefore(today))
      .sort((a, b) => dayjs(a?.startDate) - dayjs(b?.startDate));

  return (
    <Box
      _hover={{ bg: 'brand.400' }}
      bg="brand.500"
      border="1px solid"
      borderColor="brand.500"
      className="thumb-cover-container"
      fontWeight="bold"
    >
      <div className="thumb-cover">
        <LazyLoadImage alt={title} effect="black-and-white" src={imageUrl} style={imageStyle} />
      </div>

      <div className="thumb-text-container">
        {dates && (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {!showPast && futureDates && (
              <HStack align="center" color="brand.50" mb="4" spacing="4">
                {futureDates.slice(0, 3).map((date) => (
                  <ThumbDate key={date?.startDate + date?.startTime} date={date} />
                ))}
                {remaining > 0 && (
                  <div style={{ ...dateStyle, fontSize: 20, marginBottom: 16 }}>+ {remaining}</div>
                )}
              </HStack>
            )}
            {showPast && (
              <HStack spacing="4" mb="4">
                {pastDates.slice(0, 3).map((date) => (
                  <ThumbDate key={date?.startDate + date?.startTime} color="gray.400" date={date} />
                ))}
              </HStack>
            )}
          </div>
        )}

        <h3 className="thumb-title">{title}</h3>
        <h4 className="thumb-subtitle">{subTitle}</h4>

        {(host || tag) && (
          <div
            style={{
              alignItems: 'center',
              bottom: 12,
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              right: 12,
            }}
          >
            <em style={{ color: '#fff' }}>{host || tag}</em>
          </div>
        )}
      </div>
    </Box>
  );
}

export default SexyThumb;
