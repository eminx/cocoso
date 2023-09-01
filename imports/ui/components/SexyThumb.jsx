import React from 'react';
import moment from 'moment';
import { Box, Flex, HStack } from '@chakra-ui/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

import { DateJust } from './FancyDate';

const yesterday = moment(new Date()).add(-1, 'days');
const today = moment(new Date());

const dateStyle = {
  fontWeight: 700,
  lineHeight: 1,
};

const imageStyle = {
  height: '315px',
  width: '355px',
  objectFit: 'cover',
};

const coverClass = 'thumb-cover';
const coverContainerClass = 'thumb-cover-container ';

function ThumbDate({ date }) {
  if (!date) {
    return null;
  }

  const isPast = moment(date.endDate).isBefore(today);

  return (
    <Flex
      key={date.startDate + date.startTime}
      align="center"
      color={isPast ? 'gray.400' : 'brand.50'}
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
      .filter((date) => moment(date?.endDate).isAfter(yesterday))
      .sort((a, b) => moment(a.startDate) - moment(b.startDate));
  const remaining = futureDates && futureDates.length - 3;
  const pastDates =
    dates &&
    dates
      .filter((date) => moment(date?.endDate).isBefore(today))
      .sort((a, b) => moment(a.startDate) - moment(b.startDate));

  return (
    <Box
      _hover={{ bg: 'brand.400' }}
      bg="brand.500"
      className={coverContainerClass}
      fontWeight="bold"
    >
      <div className={coverClass}>
        <LazyLoadImage alt={title} src={imageUrl} style={imageStyle} effect="black-and-white" />
      </div>

      <div
        style={{
          fontFamily: `'Raleway', sans-serif`,
          height: '100%',
          padding: '24px 16px',
          position: 'relative',
        }}
      >
        {dates && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
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
                  <ThumbDate key={date?.startDate + date?.startTime} date={date} color="gray.400" />
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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'absolute',
              right: 12,
              bottom: 12,
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
