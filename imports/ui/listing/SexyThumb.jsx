import { Meteor } from 'meteor/meteor';
import React, { memo } from 'react';
import dayjs from 'dayjs';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useAtomValue } from 'jotai';

import { Box, Flex, Tag } from '/imports/ui/core';

import { DateJust } from '../entry/FancyDate';
import { allHostsAtom } from '../../state';

const isClient = Meteor?.isClient;

if (isClient) {
  import 'react-lazy-load-image-component/src/effects/black-and-white.css';
}

const today = dayjs().format('YYYY-MM-DD');
const yesterday = dayjs(new Date()).add(-1, 'days').format('YYYY-MM-DD');
const tomorrow = dayjs(new Date()).add(1, 'days').format('YYYY-MM-DD');

const remainingStyle = {
  fontSize: '27px',
  fontWeight: 'bold',
};

const imageStyle = {
  height: '325px',
  maxWidth: '780px',
  minWidth: '355px',
  objectFit: 'cover',
  width: '100%',
  borderRadius: 'var(--cocoso-border-radius)',
};

export function ThumbDate({ occurrence }) {
  if (!occurrence) {
    return null;
  }

  const isPast = dayjs(occurrence.endDate)?.isBefore(today);

  return (
    <Flex
      key={occurrence.startDate + occurrence.startTime}
      align="center"
      color={isPast ? 'gray.400' : 'white'}
      gap="0"
    >
      <DateJust>{occurrence.startDate}</DateJust>
      {occurrence.startDate !== occurrence.endDate && (
        <span style={{ margin: '0 2px' }}>–</span>
      )}
      {occurrence.startDate !== occurrence.endDate && (
        <DateJust>{occurrence.endDate}</DateJust>
      )}
    </Flex>
  );
}

function SexyThumb({ activity, host, index, showPast = false, tags }) {
  // const allHosts = isClient && useAtomValue(allHostsAtom);

  if (!activity) {
    return null;
  }

  const { datesAndTimes, readingMaterial, subTitle, tag, title } = activity;
  const imageUrl = (activity.images && activity.images[0]) || activity.imageUrl;

  const dates = datesAndTimes;
  const futureDates = dates.filter((date) =>
    dayjs(date.endDate, 'YYYY-MM-DD').isAfter(yesterday)
  );
  const pastDates = dates.filter((date) =>
    dayjs(date.endDate, 'YYYY-MM-DD').isBefore(tomorrow)
  );
  const remainingFuture = futureDates && futureDates.length - 3;
  const remainingPast = futureDates && pastDates.length - 1;

  // const hostName = host && allHosts?.find((h) => h?.host === host)?.name;

  return (
    <Box
      bg="theme.500"
      className="thumb-cover-container"
      h={imageStyle.height}
      mb="0.6"
      css={{
        borderRadius: 'var(--cocoso-border-radius)',
        maxWidth: imageStyle.maxWidth,
        minWidth: imageStyle.minWidth,
      }}
    >
      <div className="thumb-cover">
        <LazyLoadImage
          alt={title}
          effect="black-and-white"
          src={imageUrl}
          style={imageStyle}
          visibleByDefault={index < 6}
        />
      </div>

      <div className="thumb-text-container">
        <Flex direction="column" h="100%" justify="space-between">
          <Box mt="2">
            <h3 className="thumb-title">{title}</h3>
            <h4 className="thumb-subtitle">{subTitle || readingMaterial}</h4>
            {tags && (
              <Flex my="2">
                {tags.map((t) => (
                  <Tag key={t} colorScheme="gray" size="sm">
                    {t}
                  </Tag>
                ))}
              </Flex>
            )}
          </Box>

          {dates && (
            <div>
              {!showPast && futureDates && (
                <Flex
                  align="center"
                  color="theme.50"
                  gap="2"
                  mb="4"
                  wrap="wrap"
                >
                  {futureDates.slice(0, 3).map((occurrence) => (
                    <ThumbDate
                      key={occurrence?.startDate + occurrence?.startTime}
                      occurrence={occurrence}
                    />
                  ))}
                  {remainingFuture > 0 && (
                    <span style={remainingStyle}>
                      <span>+ </span>
                      <span>{remainingFuture}</span>
                    </span>
                  )}
                </Flex>
              )}
              {showPast && (
                <Flex color="gray.400" mb="4" wrap="wrap">
                  {pastDates.slice(0, 1).map((occurrence) => (
                    <ThumbDate
                      key={occurrence?.startDate + occurrence?.startTime}
                      occurrence={occurrence}
                    />
                  ))}
                  {remainingPast > 0 && (
                    <span style={remainingStyle}>
                      <span>+ </span>
                      <span>{remainingPast}</span>
                    </span>
                  )}
                </Flex>
              )}
            </div>
          )}
        </Flex>

        {host && (
          <div
            style={{
              alignItems: 'center',
              bottom: 12,
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              right: 24,
            }}
          >
            <em style={{ color: '#fff' }}>{host}</em>
          </div>
        )}
      </div>
    </Box>
  );
}

export default memo(SexyThumb);
