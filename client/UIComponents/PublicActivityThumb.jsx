import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const yesterday = moment(new Date()).add(-1, 'days');

const compareForSort = (a, b) => {
  const dateA = moment(a.startDate, 'YYYY-MM-DD');
  const dateB = moment(b.startDate, 'YYYY-MM-DD');
  return dateA.diff(dateB);
};

const dateStyle = {
  color: '#fff',
  fontWeight: 700,
  lineHeight: 1
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
      dateStyle.color = '#aaa';
    } else {
      dateStyle.color = '#fff';
    }

    return (
      <div
        key={date.startDate + date.startTime}
        style={{ marginRight: 16, marginBottom: 16 }}
      >
        <div style={{ ...dateStyle, fontSize: 24 }}>
          {moment(date.startDate).format('DD')}
        </div>
        <div style={{ ...dateStyle, fontSize: 15 }}>
          {moment(date.startDate)
            .format('MMM')
            .toUpperCase()}
        </div>
      </div>
    );
  };

  renderDates = () => {
    const { item } = this.props;
    const futureDates =
      item.isGroup &&
      item.datesAndTimes.filter(date =>
        moment(date.startDate).isAfter(yesterday)
      );
    const remaining = item.isGroup && futureDates.length - 3;

    if (item.isGroup) {
      return (
        <div
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}
        >
          {futureDates.slice(0, 3).map(date => this.renderDate(date))}
          {remaining > 0 && (
            <div style={{ ...dateStyle, fontSize: 20, marginBottom: 16 }}>
              + {remaining}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}
        >
          {item.datesAndTimes.map(date => this.renderDate(date))}
        </div>
      );
    }
  };

  render() {
    const { item } = this.props;

    const commonStyle = {
      color: '#fff',
      fontWeight: 300,
      lineHeight: 1
    };

    const coverStyle = {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
      maxHeight: '100%',
      backgroundImage: `url('${item.imageUrl}')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center center'
    };

    let clickLink = item.isGroup ? `/group/${item._id}` : `/event/${item._id}`;

    const coverClass = 'thumb-cover';

    let coverContainerClass = 'thumb-cover-container ';

    const highlightClass = 'cover-highlight-title';

    return (
      <div className={coverContainerClass}>
        <Link to={clickLink}>
          <div style={coverStyle} className={coverClass} />
          <div style={{ position: 'relative', padding: '24px 16px' }}>
            {this.renderDates()}
            <h3
              style={{
                ...commonStyle,
                fontSize: 24,
                marginBottom: 6,
                lineHeight: '32px'
              }}
            >
              {item.isGroup ? item.title : item.title}
            </h3>
            <h4 style={{ ...commonStyle, fontSize: 16, lineHeight: '21px' }}>
              {item.isGroup ? item.readingMaterial : item.subTitle}
            </h4>
          </div>
        </Link>
      </div>
    );
  }
}

export default PublicActivityThumb;
