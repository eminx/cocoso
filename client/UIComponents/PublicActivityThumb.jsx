import React from 'react';
import moment from 'moment';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import { Box, Anchor, Text } from 'grommet';

const yesterday = moment(new Date()).add(-1, 'days');

const dateStyle = {
  fontWeight: 300,
  lineHeight: 1,
  fontSize: 20,
  color: '#030303',
};

class PublicActivityThumb extends React.Component {
  getEventTimes = (event) => {
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

  renderDate = (date) => {
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
            {moment(date.startDate).format('MMM').toUpperCase()}
          </span>
        </div>
      </div>
    );
  };

  renderDates = () => {
    const { item } = this.props;
    const futureDates = item.datesAndTimes.filter((date) =>
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
        {futureDates.slice(0, 3).map((date) => this.renderDate(date))}
        {remaining > 0 && <div style={{ ...dateStyle }}>+ {remaining}</div>}
      </Box>
    );
  };

  render() {
    const { item, history } = this.props;

    const imageStyle = {
      width: 288,
      height: 180,
      objectFit: 'cover',
    };

    let clickLink = item.isProcess
      ? `/process/${item._id}`
      : `/activity/${item._id}`;

    return (
      <Box
        pad="medium"
        hoverIndicator="light-1"
        onClick={() => history.push(clickLink)}
      >
        <Box>
          <Box pad={{ bottom: 'medium' }}>
            <Text weight={600} size="large">
              {item.isProcess ? item.title : item.title}
            </Text>
            <Text weight={300}>
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

          <Box>{this.renderDates()}</Box>
        </Box>
      </Box>
    );
  }
}

export default PublicActivityThumb;
