import React from 'react';
import { Card, Icon, Avatar, Row, Col, Button, Divider } from 'antd/lib';
const { Meta } = Card;
import moment from 'moment';

const getInitials = string => {
  var names = string.split(' '),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

const sectionStyle = {
  marginTop: 12,
  paddingTop: 12,
  paddingRright: 12,
  fontStyle: 'italic',
  textAlign: 'right',
  whiteSpace: 'pre-line'
};

class CardArticle extends React.Component {
  getEventTimes = event => {
    if (event) {
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
        ).format('Do MMMM')}`;
      } else {
        return '';
      }
    }
  };

  render() {
    const { item, isAttending, isMyEventWTF, currentUser } = this.props;

    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ marginBottom: 0 }}>{item.title}</h2>
          {item.subTitle && (
            <h4 style={{ fontWeight: 300 }}>{item.subTitle}</h4>
          )}
        </div>
        <div style={{ paddingBottom: 12 }}>
          <img
            width="100%"
            height="100%"
            alt={item.title}
            src={item.imageUrl}
          />
        </div>
        <div style={{ whiteSpace: 'pre-line', color: 'rgba(0,0,0, .85)' }}>
          {item.longDescription}
        </div>

        {item.practicalInfo && item.practicalInfo.length > 0 && (
          <div style={{ ...sectionStyle, textAlign: 'left' }}>
            <h4>Practical information:</h4>
            <div>{item.practicalInfo}</div>
          </div>
        )}

        {currentUser &&
          currentUser.isRegisteredMember &&
          item &&
          item.internalInfo && (
            <div style={{ ...sectionStyle, textAlign: 'left' }}>
              <h4>Internal information for Skogen members:</h4>
              <p>{item.internalInfo}</p>
            </div>
          )}

        <div style={sectionStyle}>
          <div>
            {item.room && item.room + ', '}
            {item.place}
          </div>
          <div>{item.address}</div>
        </div>
      </div>
    );
  }
}

export default CardArticle;
