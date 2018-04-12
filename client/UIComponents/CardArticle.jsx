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
  render() {
    const { item, isAttending, isMyEventWTF, currentUser } = this.props;
    const eventTimes = item
      ?
        `${item.startTime}–${item.endTime}`
      :
        null;

    const eventDate = moment(item.startDate).format('Do MMMM dddd');

    return (
      <Card
        title={<div><h1>{item.title}</h1><h3 style={{color: 'rgba(0,0,0,.65)'}}>{item.shortDescription}</h3></div>}
        bordered={false}
        cover={<img alt="example" src={item.imageUrl} />}
      >
        <Meta
          avatar={<Avatar>{getInitials(item.authorName)}</Avatar>}
          title={<div><b>{item.room}, Nobelberget<br />{eventTimes}, {eventDate}</b><br /> hosted by {item.authorName} <Divider /></div>}
          description={item.longDescription}
        />
      </Card>
    )
  }
}

export default CardArticle;
