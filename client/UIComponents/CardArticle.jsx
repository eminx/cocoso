import React from 'react';
import { Card, Icon, Avatar, Row, Col, Button } from 'antd/lib';
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
    const { item, signupComing, signupNotComing, isAttending, isMyEventWTF } = this.props;

    const eventTimes = item 
    ?
      `${item.startTime}–${item.endTime}, ${moment(item.startDate).format('Do MMMM dddd')}`
    :
      null;

    const rsvpButtonGroup = 
      <Button.Group>
        <Button type={isAttending ? 'default' : 'primary'} onClick={signupNotComing}>
          <Icon type={isAttending ? 'minus-circle-o' : 'minus-circle' } />I'm not coming
        </Button>
        <Button type={isAttending ? 'primary' : 'default'} onClick={signupComing}>
          <Icon type={isAttending ? 'heart' : 'heart-o' } />I'm coming!
        </Button>
      </Button.Group>;

    const hostActions =
      <div>
        <h4 style={{color: 'rgba(0, 0, 0, .55)'}}>You're the host of this activity</h4>
        <Button.Group>
          <Button disabled>
            <Icon type="edit" />Edit this post
          </Button>
          <Button disabled>
            <Icon type="delete"/>Delete this post
          </Button>
        </Button.Group>
      </div>;

    return (
      <Card
        title={<div><h1>{item.title}</h1><h3 style={{color: 'rgba(0,0,0,.65)'}}>{item.shortDescription}</h3></div>}
        bordered={false}
        cover={<img alt="example" src={item.imageUrl} />}
        actions={[isMyEventWTF ? hostActions : rsvpButtonGroup]}
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