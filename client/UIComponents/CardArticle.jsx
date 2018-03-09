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
    isAttending: false
  }

  componentDidMount() {
    this.setIsAttending();
  }

  setIsAttending = () => {
    const gathering = this.props.item;
    const currentUser = Meteor.user();
    let isAttending = false;
    if (!currentUser) {
      console.log('olmadi');
      return;
    }
    for (let event of currentUser.attending) {
      console.log(event.gatheringId, gathering._id);
      if (event.gatheringId === gathering._id) {
        console.log('yey');
        isAttending = true;
      }
    } 
    this.setState({
      isAttending: isAttending
    });
  }

  signupComing = () => {
    const { isAttending } = this.state;
    const gathering = this.props.item;
    if (!isAttending) {
      if (gathering) {
        Meteor.call('registerAttendance', gathering._id, (err, res) => {
          if (err) {
            message.error("It didn't work :/");
            console.log(err);
          } else {
            console.log('success');
            this.setIsAttending();
            message.success("You're successfully registered!");
          }
        });
      } else {
        message.error("Sorry, the event is full");
      }
    }
  }

  signupNotComing = () => {
    const { isAttending } = this.state;
    if (isAttending) {
      const gatheringId = this.props.item._id;
      Meteor.call('unRegisterAttendance', gatheringId, (err, res) => {
        if (err) {
          message.error("It didn't work :/");
          console.log(err);
        } else {
          this.setIsAttending();
          message.info("Sad that you aren't coming, but thanks for letting us know!");
        }
      });
    }
  }
	
  render() {
    const { isLoading, item } = this.props;
    const { isAttending } = this.state;

    const eventTimes = item 
    ?
      `${item.startTime}–${item.endTime}, ${moment(item.startDate).format('Do MMMM dddd')}`
    :
      null;

    const rsvpButtonGroup = 
      <Button.Group>
        <Button type={isAttending ? 'default' : 'primary'} onClick={this.signupNotComing}>
          <Icon type={isAttending ? 'minus-circle-o' : 'minus-circle' } />I'm not coming
        </Button>
        <Button type={isAttending ? 'primary' : 'default'} onClick={this.signupComing}>
          <Icon type={isAttending ? 'heart' : 'heart-o' } />I'm coming!
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