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

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

const footerIcons = [
  <IconText type="star-o" text="156" />,
  <IconText type="like-o" text="156" />,
  <IconText type="message" text="2" />
];

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
    const eventTimes = this.getEventTimes(item);

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
        <div>{item.longDescription}</div>
      </div>
    );
  }
}

export default CardArticle;
