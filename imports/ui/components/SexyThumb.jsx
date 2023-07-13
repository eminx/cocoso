import React from 'react';
import moment from 'moment';
import { Box } from '@chakra-ui/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

const yesterday = moment(new Date()).add(-1, 'days');
const today = moment(new Date());

const dateStyle = {
  color: '#fff',
  fontWeight: 700,
  lineHeight: 1,
};

const imageStyle = {
  width: '375px',
  height: '315px',
  objectFit: 'cover',
};

const coverClass = 'thumb-cover';
const coverContainerClass = 'thumb-cover-container ';

function ThumbDate({ date }) {
  if (!date) {
    return null;
  }

  const isPastEvent = !moment(date?.startDate).isAfter(yesterday);

  if (isPastEvent) {
    dateStyle.color = '#aaa';
  } else {
    dateStyle.color = '#fff';
  }

  return (
    <div style={{ marginRight: 16, marginBottom: 16 }}>
      <div style={{ ...dateStyle, fontSize: 24 }}>{moment(date?.startDate).format('DD')}</div>
      <div style={{ ...dateStyle, fontSize: 17 }}>{moment(date?.startDate).format('MMM')}</div>
    </div>
  );
}

function SexyThumb({
  avatar,
  color,
  dates,
  host,
  imageUrl,
  subTitle,
  showPast = false,
  title,
  tag,
}) {
  const futureDates = dates && dates.filter((date) => moment(date?.endDate).isAfter(yesterday));
  const remaining = futureDates && futureDates.length - 3;
  const pastDates = dates && dates.filter((date) => moment(date?.startDate).isBefore(today));

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
            {futureDates &&
              futureDates
                .slice(0, 3)
                .map((date) => <ThumbDate key={date?.startDate + date?.startTime} date={date} />)}
            {remaining > 0 && (
              <div style={{ ...dateStyle, fontSize: 20, marginBottom: 16 }}>+ {remaining}</div>
            )}
            {showPast &&
              pastDates
                .slice(0, 3)
                .map((date) => <ThumbDate key={date?.startDate + date?.startTime} date={date} />)}
          </div>
        )}
        <h3 className="thumb-title">{title}</h3>
        <h4 className="thumb-subtitle">{subTitle}</h4>
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
          {(host || tag) && <em style={{ color: '#fff' }}>{host || tag}</em>}
        </div>
      </div>
    </Box>
  );
}

export default SexyThumb;
