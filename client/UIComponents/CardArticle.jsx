import React from 'react';
import { Card, Icon, Avatar, Row, Col, Button, Divider } from 'antd/lib';
const { Meta } = Card;
import moment from 'moment';

const getInitials = (string) => {
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

  getEventTimes = (event) => {
    if (event) {
      if (event.isMultipleDay || event.isFullDay) {
        return moment(event.startDate).format('Do MMM') + ' ' + event.startTime + ' – ' + 
          moment(event.endDate).format('Do MMM') + ' ' + event.endTime;
      } else {
        return `${event.startTime}–${event.endTime} ${moment(event.startDate).format('Do MMMM')}`;
      }
    }
  }

  render() {
    const { item, isAttending, isMyEventWTF, currentUser } = this.props;
    const eventTimes = this.getEventTimes(item);

    return (
      <Card
        title={<div><h1>{item.title}</h1></div>}
        bordered={false}
      >
        <Meta
          avatar={<Avatar>{getInitials(item.authorName || 'emo')}</Avatar>}
          title={<div><b>{item.room}, Skogen<br />{eventTimes}</b><br /> booked by {item.authorName} <Divider /></div>}
          description={item.longDescription}
        />
      </Card>
    )
  }
}

export default CardArticle;
