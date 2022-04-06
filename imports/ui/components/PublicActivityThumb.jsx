import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/layout';
import moment from 'moment';
import i18n from 'i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

moment.locale(i18n.language);

const yesterday = moment(new Date()).add(-1, 'days');

const dateStyle = {
  fontWeight: 300,
  lineHeight: 1,
  fontSize: 20,
  color: '#030303',
};

const ellipsisStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

function PublicActivityThumb({ item }) {
  const renderDate = (date) => {
    if (!date) {
      return;
    }

    // const isPastEvent = !moment(date.startDate).isAfter(yesterday);

    // if (isPastEvent) {
    // dateStyle.color = '#aaa';
    // } else {
    // dateStyle.color = '#fff';
    // }

    return (
      <div
        key={date.startDate + date.startTime}
        style={{ marginRight: 12, marginBottom: 12 }}
      >
        <div style={{ ...dateStyle }}>
          <span style={{ fontSize: 24, marginRight: 2 }}>
            <b>{moment(date.startDate).format('DD')}</b>
          </span>
          <span style={{ fontSize: 16 }}>
            {moment(date.startDate).format('MMM').toUpperCase()}
          </span>
        </div>
      </div>
    );
  };

  const futureDates = item.datesAndTimes.filter((date) =>
    moment(date.startDate).isAfter(yesterday)
  );
  const remaining = futureDates.length - 3;

  const imageStyle = {
    width: '100%',
    // maxWidth: 360,
    height: 260,
    objectFit: 'cover',
  };

  return (
    <Box bg="rgba(255, 255, 255, 0.6)" p="2" w="100%">
      <Box p="1">
        <Heading as="h3" size="md" weight="bold" style={ellipsisStyle}>
          {item.isProcess ? item.title : item.title}
        </Heading>
        <Text fontWeight={300} style={ellipsisStyle}>
          {item.isProcess ? item.readingMaterial : item.subTitle}
        </Text>
      </Box>

      <Box w="100%">
        <LazyLoadImage
          alt={item.title}
          src={item.imageUrl}
          style={imageStyle}
          effect="black-and-white"
          width="100%"
        />
      </Box>

      <Flex direction="row" justify="end" align="center" mt="1" wrap p="1">
        {futureDates.slice(0, 3).map((date) => renderDate(date))}
        {remaining > 0 && <div style={{ ...dateStyle }}> + {remaining}</div>}
      </Flex>
    </Box>
  );
}

export default PublicActivityThumb;
