import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import { Box } from 'grommet';

const yesterday = moment(new Date()).add(-1, 'days');

const dateStyle = {
  fontWeight: 300,
  lineHeight: 1,
  fontSize: 20,
  color: '#030303'
};

class PublicActivityThumb extends React.Component {
  getEventTimes = event => {
    if (!event) {
      return;
    }

    if (event.isMultipleDay || event.isFullDay) {
      return (
        moment(event.startDate).format('Do MMM') +
        ' ' +
        event.startTime +
        ' – ' +
        moment(event.endDate).format('Do MMM') +
        ' ' +
        event.endTime
      );
    } else if (event.startTime) {
      return `${event.startTime}–${event.endTime} ${moment(
        event.startDate
      ).format('DD MMMM')}`;
    } else {
      return '';
    }
  };

  renderDate = date => {
    if (!date) {
      return;
    }

    const isPastEvent = !moment(date.startDate).isAfter(yesterday);

    if (isPastEvent) {
      // dateStyle.color = '#aaa';
    } else {
      // dateStyle.color = '#fff';
    }

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
            {moment(date.startDate)
              .format('MMM')
              .toUpperCase()}
          </span>
        </div>
      </div>
    );
  };

  renderDates = () => {
    const { item } = this.props;
    const futureDates = item.datesAndTimes.filter(date =>
      moment(date.startDate).isAfter(yesterday)
    );
    const remaining = futureDates.length - 3;

    return (
      <Box
        direction="row"
        justify="end"
        alignItems="center"
        margin={{ top: 'small' }}
        wrap
      >
        {futureDates.slice(0, 3).map(date => this.renderDate(date))}
        {remaining > 0 && <div style={{ ...dateStyle }}>+ {remaining}</div>}
      </Box>
    );
  };

  render() {
    const { item } = this.props;

    const commonStyle = {
      color: '#030303',
      fontWeight: 300,
      lineHeight: 1
    };

    const imageStyle = {
      width: 288,
      height: 180,
      objectFit: 'cover'
    };

    let clickLink = item.isGroup ? `/group/${item._id}` : `/event/${item._id}`;

    return (
      <Box
        pad={{ bottom: 'medium', right: 'medium', left: 'medium' }}
        hoverIndicator={{ background: 'light-1' }}
        onClick={() => null}
      >
        <Link to={clickLink}>
          <Box>
            <h3
              style={{
                ...commonStyle,
                fontSize: 24,
                marginBottom: 6,
                lineHeight: '32px',
                overflowWrap: 'anywhere'
              }}
            >
              {item.isGroup ? item.title : item.title}
            </h3>
            <h4 style={{ ...commonStyle, fontSize: 16, lineHeight: '21px' }}>
              {item.isGroup ? item.readingMaterial : item.subTitle}
            </h4>
          </Box>

          <Box>
            <LazyLoadImage
              alt={item.title}
              src={item.imageUrl}
              style={imageStyle}
              effect="black-and-white"
            />
          </Box>

          <Box>{this.renderDates()}</Box>
        </Link>
      </Box>
    );
  }
}

export default PublicActivityThumb;
