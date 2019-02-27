import React from 'react';
import { Link } from 'react-router-dom';
import Blaze from 'meteor/gadicc:blaze-react-component';
import Chattery from '../chattery';
import {
  Row,
  Col,
  Button,
  Icon,
  Divider,
  Checkbox,
  List,
  Avatar,
  Popconfirm,
  message
} from 'antd/lib';
import CardArticle from '../UIComponents/CardArticle';
import Loader from '../UIComponents/Loader';
const ListItem = List.Item;

class Gathering extends React.Component {
  addNewChatMessage = message => {
    Meteor.call(
      'addChatMessage',
      this.props.gatheringData._id,
      message,
      (error, respond) => {
        if (error) {
          console.log('error', error);
        }
      }
    );
  };

  checkIfAttending = () => {
    const { gatheringData, currentUser } = this.props;
    let isAttending = false;
    if (currentUser && currentUser.attending && gatheringData) {
      for (let event of currentUser.attending) {
        if (event.gatheringId === gatheringData._id) {
          isAttending = true;
        }
      }
    }
    return isAttending;
  };

  signupComing = () => {
    const isAttending = this.checkIfAttending();
    const { gatheringData } = this.props;
    if (!isAttending && gatheringData) {
      Meteor.call('registerAttendance', gatheringData._id, (err, res) => {
        if (err) {
          message.error("It didn't work :/");
          console.log(err);
        } else {
          message.success("You're successfully registered!");
        }
      });
    } else {
      message.error("You've already signed up!");
    }
  };

  signupNotComing = () => {
    const isAttending = this.checkIfAttending();
    const { gatheringData } = this.props;
    if (isAttending && gatheringData) {
      const gatheringId = gatheringData._id;
      Meteor.call('unRegisterAttendance', gatheringId, (err, res) => {
        if (err) {
          message.error("It didn't work :/");
          console.log(err);
        } else {
          message.info(
            "Sad that you aren't coming, but thanks for letting us know!"
          );
        }
      });
    } else {
      message.error("OK! We get that you won't come");
    }
  };

  toggleAttendance = (username, e) => {
    const { gatheringData } = this.props;
    e.preventDefault();
    Meteor.call(
      'toggleAttendanceAsHost',
      gatheringData._id,
      username,
      (err, res) => {
        if (err) {
          message.error("It didn't work :/");
          console.log(err);
        } else {
          console.log('fixed');
        }
      }
    );
  };

  getManageButtons = () => {
    const { currentUser, gatheringData } = this.props;
    const isAttending = this.checkIfAttending();

    const isMyEventWTF = this.isMyEvent();

    const rsvpButtonGroupForUser = (
      <Button.Group>
        <Button
          type={isAttending ? 'default' : 'primary'}
          onClick={this.signupNotComing}
        >
          <Icon type={isAttending ? 'minus-circle-o' : 'minus-circle'} />
          I'm not coming
        </Button>
        <Button
          type={isAttending ? 'primary' : 'default'}
          onClick={this.signupComing}
        >
          <Icon type={isAttending ? 'heart' : 'heart-o'} />
          I'm coming!
        </Button>
      </Button.Group>
    );

    const rsvpButtonGroupForNonUser = (
      <div>
        <Button.Group>
          <Button type={isAttending ? 'default' : 'primary'} disabled>
            <Icon type={isAttending ? 'minus-circle-o' : 'minus-circle'} />
            I'm not coming
          </Button>
          <Button type={isAttending ? 'primary' : 'default'} disabled>
            <Icon type={isAttending ? 'heart' : 'heart-o'} />
            I'm coming!
          </Button>
        </Button.Group>
        <Divider />
        <p style={{ cursor: 'default' }}>You have to sign in to RSVP</p>
        <Blaze template="loginButtons">
          <Button>
            <Icon type="login" />
          </Button>
        </Blaze>
      </div>
    );

    let manageButtons;
    if (
      currentUser &&
      currentUser.isSuperAdmin &&
      gatheringData &&
      !gatheringData.isPublished
    ) {
      manageButtons = this.adminApprovalButtons();
    } else if (currentUser) {
      manageButtons = rsvpButtonGroupForUser;
    } else {
      manageButtons = rsvpButtonGroupForNonUser;
    }

    return manageButtons;
  };

  adminApprovalButtons = () => {
    const { currentUser, gatheringData } = this.props;

    const confirm = () => {
      Meteor.call('publishGathering', gatheringData._id, (err, res) => {
        if (err) {
          message.error("Sorry didn't happen for some reason :/");
        } else {
          message.success('The activity is successfully published.');
        }
      });
    };

    return (
      <div style={{ marginTop: 30 }}>
        <p>This event is not published.</p>
        <Popconfirm
          title="Are you sure?"
          onConfirm={confirm}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary">Publish</Button>
        </Popconfirm>
      </div>
    );
  };

  isMyEvent = () => {
    const { gatheringData, currentUser } = this.props;
    if (currentUser && gatheringData) {
      return gatheringData.authorId === currentUser._id;
    }
  };

  render() {
    const { gatheringData, isLoading, currentUser, chatData } = this.props;
    const isMyEventWTF = this.isMyEvent();

    const manageButtons = this.getManageButtons();

    const EditButton =
      currentUser &&
      gatheringData &&
      currentUser._id === gatheringData.authorId ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            top: 20,
            right: 30
          }}
        >
          <Link to={`/edit-booking/${gatheringData._id}`}>
            <Button>Edit</Button>
          </Link>
        </div>
      ) : null;

    let messages = [];
    if (chatData) {
      messages = chatData.messages;
      messages.forEach(message => {
        if (message.senderId === currentUser._id) {
          message.isFromMe = true;
        }
      });
    }

    return (
      <div>
        {!isLoading && gatheringData ? (
          <Row gutter={24}>
            <Col sm={24} md={16} style={{ position: 'relative' }}>
              <CardArticle
                item={gatheringData}
                isLoading={isLoading}
                currentUser={currentUser}
              />
              {EditButton}
            </Col>

            <Col sm={24} md={8}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 10
                }}
              >
                {isMyEventWTF && gatheringData && gatheringData.attendees ? (
                  gatheringData.attendees.length > 0 ? (
                    <div style={{ padding: 12 }}>
                      <h3>Attendees</h3>
                      <p>Please uncheck for those who did not attend</p>
                      <List bordered itemLayout="horizontal" size="small">
                        {gatheringData.attendees.map((attendee, i) => {
                          attendee.username
                            ? null
                            : (attendee.username = 'someone');
                          return (
                            <ListItem key={attendee.username + i}>
                              <List.Item.Meta
                                avatar={
                                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                }
                                title={
                                  <span
                                    className={
                                      !attendee.didNotAttend ? 'bold-font' : ''
                                    }
                                  >
                                    {attendee.username}
                                  </span>
                                }
                              />
                              <Checkbox
                                checked={!attendee.didNotAttend}
                                onChange={this.toggleAttendance.bind(
                                  this,
                                  attendee.username
                                )}
                              />
                            </ListItem>
                          );
                        })}
                      </List>
                    </div>
                  ) : gatheringData.isPublished ? (
                    <p>Currently no one registered. Keep spreading the word!</p>
                  ) : (
                    <p>Your activity is awaiting review to be published.</p>
                  )
                ) : (
                  manageButtons
                )}
              </div>
            </Col>
          </Row>
        ) : (
          <Loader />
        )}
        <Divider />
        <Row gutter={24}>
          <Col sm={24} md={20} lg={16}>
            {chatData ? (
              <div>
                <h2>Chat Section</h2>
                <Chattery
                  messages={messages}
                  onNewMessage={this.addNewChatMessage}
                />
              </div>
            ) : null}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Gathering;
