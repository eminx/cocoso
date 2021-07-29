import React from 'react';
import moment from 'moment';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import { Box, Text } from 'grommet';

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

function PublicActivityThumb({ item, large, history }) {
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
    maxWidth: 360,
    height: 220,
    objectFit: 'cover',
  };

  return (
    <Box
      width="320px"
      background={{ color: 'rgba(255, 255, 255, 0.6)' }}
      margin={{ vertical: 'small', horizontal: large ? 'small' : 'none' }}
      hoverIndicator="brand-light"
      onClick={() =>
        history.push(
          item.isProcess ? `/process/${item._id}` : `/activity/${item._id}`
        )
      }
    >
      <Box pad="small">
        <Text size="large" weight="bold" style={ellipsisStyle}>
          {item.isProcess ? item.title : item.title}
        </Text>
        <Text weight={300} style={ellipsisStyle}>
          {item.isProcess ? item.readingMaterial : item.subTitle}
        </Text>
      </Box>

      <Box>
        <LazyLoadImage
          alt={item.title}
          src={item.imageUrl}
          style={imageStyle}
          effect="black-and-white"
        />
      </Box>

      <Box
        direction="row"
        justify="end"
        alignItems="center"
        margin={{ top: 'small' }}
        wrap
        pad="small"
      >
        {futureDates.slice(0, 3).map((date) => renderDate(date))}
        {remaining > 0 && <div style={{ ...dateStyle }}>+ {remaining}</div>}
      </Box>
    </Box>
  );
}

export default PublicActivityThumb;
