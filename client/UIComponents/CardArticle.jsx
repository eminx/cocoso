import React from 'react';
import { Card, Icon, Avatar, Row, Col, Button, message } from 'antd/lib';
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

  state= {
    isComing: false
  }

  signupComing = () => {
    if (!this.state.isComing) {
      this.setState({
        isComing: true
      });
      message.success("You're successfully registered!");
    }
  }

  signupNotComing = () => {
    if (this.state.isComing) {
      this.setState({
        isComing: false
      });
      message.info("Sad that you aren't coming, but thanks for letting us know!");
    }
  }
	
  render() {

    const { isLoading, item } = this.props;
    const { isComing } = this.state;

    const eventTimes = item 
    ?
      `${item.startTime}–${item.endTime}, ${moment(item.startDate).format('Do MMMM dddd')}`
    :
      null;
    console.log(eventTimes);

    const rsvpButtonGroup = 
      <Button.Group>
        <Button type={isComing ? 'default' : 'primary'} onClick={this.signupNotComing}>
          <Icon type={isComing ? 'minus-circle-o' : 'minus-circle' } />I'm not coming
        </Button>
        <Button type={isComing ? 'primary' : 'default'} onClick={this.signupComing}>
          <Icon type={isComing ? 'heart' : 'heart-o' } />I'm coming!
        </Button>
      </Button.Group>;

    if (!isLoading) {
      return (
        <Card
          title={<div><h1>{item.title}</h1><h3 style={{color: 'rgba(0,0,0,.65)'}}>{item.shortDescription}</h3></div>}
          bordered={false}
          cover={<img alt="example" src={item.imageUrl} />}
          actions={[rsvpButtonGroup]}
        >
          <Meta
            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
            title={<span>{item.room}, Noden<br />{eventTimes}</span>}
            description={item.longDescription}
          />
        </Card>
      )
    } else {
      return <Card loading />; 
    }
  }
}

export default CardArticle;