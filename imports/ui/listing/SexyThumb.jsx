import { Meteor } from 'meteor/meteor';
import React, { useContext } from 'react';
import dayjs from 'dayjs';
import { Box, Flex, HStack, Tag as CTag } from '@chakra-ui/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { DateJust } from '../entry/FancyDate';
import { StateContext } from '../LayoutContainer';

const isClient = Meteor?.isClient;

if (isClient) {
  import 'react-lazy-load-image-component/src/effects/black-and-white.css';
}

const today = dayjs(new Date());

const remainingStyle = {
  fontSize: '27px',
  fontWeight: 'bold',
};

const imageStyle = {
  height: '325px',
  maxWidth: '780px',
  objectFit: 'cover',
  width: '100%',
  borderRadius: '8px',
};

function ThumbDate({ date }) {
  if (!date) {
    return null;
  }

  const isPast = dayjs(date.endDate)?.isBefore(now);

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

export default function SexyThumb({ activity, host, index, showPast = false, tags }) {
  const { allHosts } = isClient && useContext(StateContext);

  if (!activity) {
    return null;
  }

  const { datesAndTimes, hostName, readingMaterial, subTitle, tag, title } = activity;
  const imageUrl = (activity.images && activity.images[0]) || activity.imageUrl;

  const dates = datesAndTimes;

  const futureDates = dates.filter((date) => dayjs(`${date.endDate}`, 'YYYY-MM-DD').isAfter(today));
  const pastDates = dates.filter((date) => dayjs(`${date.endDate}`, 'YYYY-MM-DD').isBefore(today));

  const remainingFuture = futureDates && futureDates.length - 3;
  const remainingPast = futureDates && pastDates.length - 1;

  const hostValue = host && isClient ? allHosts?.find((h) => h?.host === host)?.name : host;

  return (
    <Box
      bg="brand.500"
      border="1px solid"
      borderColor="white"
      borderRadius="lg"
      boxShadow="xl"
      className="thumb-cover-container"
      fontWeight="bold"
      h={imageStyle.height}
      maxW={imageStyle.maxWidth}
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

      {host && (
        <Box p="1" position="absolute" right="12px" bottom="8px">
          <CTag bg="rgba(255, 255, 255, 0.7)" size="sm">
            {hostValue}
          </CTag>
        </Box>
      )}

      <div className="thumb-text-container">
        <Flex direction="column" h="100%" justify="space-between">
          <Box mt="2">
            <h3 className="thumb-title">{title}</h3>
            <h4 className="thumb-subtitle">{subTitle || readingMaterial}</h4>
            {tags && (
              <Flex my="2">
                {tags.map((t) => (
                  <CTag bg="gray.700" color="white" key={t} size="sm">
                    {t}
                  </CTag>
                ))}
              </Flex>
            )}
          </Box>

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
                  {remainingFuture > 0 && (
                    <span style={remainingStyle}>
                      <span>+ </span>
                      <span>{remainingFuture}</span>
                    </span>
                  )}
                </HStack>
              )}
              {showPast && (
                <HStack color="gray.400" spacing="4" mb="4">
                  {pastDates.slice(0, 1).map((date) => (
                    <ThumbDate key={date?.startDate + date?.startTime} date={date} />
                  ))}
                  {remainingPast > 0 && (
                    <span style={remainingStyle}>
                      <span>+ </span>
                      <span>{remainingPast}</span>
                    </span>
                  )}
                </HStack>
              )}
            </div>
          )}
        </Flex>

        {(hostName || tag) && (
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
            <em style={{ color: '#fff' }}>{hostName || tag}</em>
          </div>
        )}
      </div>
    </Box>
  );
}
