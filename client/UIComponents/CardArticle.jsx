import React from 'react';
import { Card, Icon, Avatar, Row, Col, Button, Divider } from 'antd/lib';
const { Meta } = Card;
import moment from 'moment';

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
      `${item.startTime}–${item.endTime}, ${moment(item.startDate).format('Do MMMM dddd')}`
    :
      null;

    return (
      <Card
        title={<div><h1>{item.title}</h1><h3 style={{color: 'rgba(0,0,0,.65)'}}>{item.shortDescription}</h3></div>}
        bordered={false}
        cover={<img alt="example" src={item.imageUrl} />}
      >
        <Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={<span>{item.room}, Noden<br />{eventTimes}</span>}
          description={item.longDescription}
        />
      </Card>
    )
  }
}

export default CardArticle;