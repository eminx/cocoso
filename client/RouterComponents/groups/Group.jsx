import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import MediaQuery from 'react-responsive';

import Chattery from '../../chattery';
import Loader from '../../UIComponents/Loader';

import {
  Row,
  Col,
  Divider,
  Collapse,
  Modal,
  List,
  Card,
  Button,
  DatePicker,
  TimePicker,
  Select,
  Icon,
  message
} from 'antd/lib';
const ListItem = List.Item;
const { Meta } = Card;
const { Option } = Select;
const Panel = Collapse.Panel;

const defaultMeetingRoom = 'Office';

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 12,
  border: 0,
  overflow: 'hidden'
};

const yesterday = moment(new Date()).add(-1, 'days');

class Group extends React.PureComponent {
  state = {
    modalOpen: false,
    redirectToLogin: false,
    newMeeting: {
      room: defaultMeetingRoom
    },
    isFormValid: false
  };

  isMember = () => {
    const { currentUser, group } = this.props;
    if (!currentUser || !group) {
      return false;
    }

    const isMember = group.members.some(
      member => member.memberId === currentUser._id
    );

    return Boolean(isMember);
  };

  isAdmin = () => {
    const { currentUser, group } = this.props;
    if (!currentUser || !group) {
      return false;
    }

    const isAdmin = group && group.adminId === currentUser._id;

    return Boolean(isAdmin);
  };

  openModal = () => {
    if (!this.props.currentUser) {
      this.setState({
        redirectToLogin: true
      });
      return;
    }
    this.setState({
      modalOpen: true
    });
  };

  closeModal = () => {
    this.setState({
      modalOpen: false
    });
  };

  addNewChatMessage = message => {
    Meteor.call(
      'addChatMessage',
      this.props.group._id,
      message,
      (error, respond) => {
        if (error) {
          console.log('error', error);
          message.destroy();
          message.error(error.error);
        }
      }
    );
  };

  getChatMessages = () => {
    const { chatData, currentUser } = this.props;

    let messages = [];

    if (chatData) {
      messages = [...chatData.messages];
      messages.forEach(message => {
        if (message.senderId === currentUser._id) {
          message.isFromMe = true;
        }
      });
    }

    return messages;
  };

  getTitle = group => {
    return (
      <div>
        <h2>{group.title}</h2>
        <h5>
          <span>reading: </span>
          {group.documentUrl ? (
            <a href={group.documentUrl} target="_blank">
              {group.readingMaterial}
            </a>
          ) : (
            <span>{group.readingMaterial}</span>
          )}
        </h5>
      </div>
    );
  };

  getExtra = (group, isAdmin) => {
    if (isAdmin) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <b>{group.members.length + ' / ' + group.capacity}</b>
          <Divider type="vertical" />
          <Link to={`/edit-group/${group._id}`}>Edit</Link>
        </div>
      );
    } else {
      return (
        <div>
          <b>{group.members.length + ' / ' + group.capacity}</b>
          <br />
          {group.adminUsername}
        </div>
      );
    }
  };

  joinGroup = () => {
    const { group } = this.props;

    Meteor.call('joinGroup', group._id, (error, response) => {
      if (error) {
        message.destroy();
        message.error(error.error);
      } else {
        message.destroy();
        message.success('You are added to the group');
      }
      this.closeModal();
    });
  };

  leaveGroup = () => {
    const { group } = this.props;

    Meteor.call('leaveGroup', group._id, (error, response) => {
      if (error) {
        message.destroy();
        message.error(error.error);
      } else {
        message.destroy();
        message.info('You are removed from the group');
      }
      this.closeModal();
    });
  };

  removeNotification = messageIndex => {
    const { group, currentUser } = this.props;
    const shouldRun = currentUser.notifications.find(notification => {
      if (!notification.unSeenIndexes) {
        return false;
      }
      return notification.unSeenIndexes.some(unSeenIndex => {
        return unSeenIndex === messageIndex;
      });
    });
    if (!shouldRun) {
      return;
    }

    Meteor.call(
      'removeNotification',
      group._id,
      messageIndex,
      (error, respond) => {
        if (error) {
          console.log('error', error);
          message.destroy();
          message.error(error.error);
        }
      }
    );
  };

  isFormValid = () => {
    const { newMeeting } = this.state;
    return (
      newMeeting &&
      newMeeting.startTime &&
      newMeeting.endTime &&
      newMeeting.startDate
    );
  };

  handleDateAndTimeChange = (date, dateString, entity) => {
    const { newMeeting } = this.state;
    newMeeting[entity] = dateString;
    this.setState({ newMeeting, isFormValid: this.isFormValid() });
  };

  handlePlaceChange = place => {
    const { newMeeting } = this.state;
    newMeeting.room = place;
    this.setState({ newMeeting, isFormValid: this.isFormValid() });
  };

  addMeeting = () => {
    const { newMeeting } = this.state;
    const { group } = this.props;
    newMeeting.endDate = newMeeting.startDate;

    Meteor.call('addGroupMeeting', newMeeting, group._id, (error, respond) => {
      if (error) {
        console.log('error', error);
        message.destroy();
        message.error(error.error);
      } else {
        message.destroy();
        message.success('Your group meeting is added!');
      }
    });
  };

  toggleAttendance = meetingIndex => {
    const { group, currentUser } = this.props;
    const meetingPast =
      group && moment(group.meetings[meetingIndex].endDate).isBefore(yesterday);
    if (meetingPast) {
      message.destroy();
      message.error(
        'Meeting date has unfortunately past. Try an upcoming date'
      );
      return;
    }

    if (!currentUser) {
      message.destroy();
      message.error('Please login and join the group to attend the meeting');
      return;
    }
    if (!this.isMember()) {
      message.destroy();
      message.error('Please join the group to attend.');
      return;
    }

    const isAttending = group.meetings[meetingIndex].attendees
      .map(attendee => attendee.memberId)
      .includes(currentUser._id);

    if (isAttending) {
      Meteor.call(
        'unAttendMeeting',
        group._id,
        meetingIndex,
        (error, respond) => {
          if (error) {
            console.log('error', error);
            message.destroy();
            message.error(error.error);
          } else {
            message.destroy();
            message.success('Your are successfully removed from the list!');
          }
        }
      );
    } else {
      Meteor.call(
        'attendMeeting',
        group._id,
        meetingIndex,
        (error, respond) => {
          if (error) {
            console.log('error', error);
            message.destroy();
            message.error(error.error);
          } else {
            message.destroy();
            message.success('Your attendance is successfully registered!');
          }
        }
      );
    }
  };

  renderDates = () => {
    const { group, currentUser } = this.props;
    if (!group) {
      return;
    }

    return (
      group.meetings &&
      group.meetings.map((meeting, meetingIndex) => (
        <Panel
          key={`${meeting.startTime} ${meeting.endTime} ${meetingIndex}`}
          header={
            <div style={{ paddingRight: 12 }}>
              <FancyDate meeting={meeting} />
              <div
                style={{
                  paddingTop: 12,
                  textAlign: 'center'
                }}
              >
                {meeting.attendees && meeting.attendees.length}
              </div>
            </div>
          }
          style={{ ...customPanelStyle, flexBasis: 200, flexShrink: 0 }}
        >
          <div style={{ marginLeft: 24 }}>
            {meeting.attendees && (
              <List>
                {meeting.attendees.map(attendee => (
                  <ListItem key={attendee.memberUsername}>
                    {attendee.memberUsername}
                  </ListItem>
                ))}
              </List>
            )}
          </div>
        </Panel>
      ))
    );
  };

  renderMeetings = () => {
    const { group, currentUser } = this.props;
    if (!group || !group.meetings) {
      return;
    }
    return group.meetings.map((meeting, meetingIndex) => (
      <MeetingInfo
        isSmallViewport
        key={`${meeting.startTime} ${meeting.endTime} ${meetingIndex}`}
        meeting={meeting}
        onClick={() => this.toggleAttendance(meetingIndex)}
        isAttending={
          currentUser &&
          meeting.attendees &&
          meeting.attendees
            .map(attendee => attendee.memberId)
            .includes(currentUser._id)
        }
      />
    ));
  };

  render() {
    const { redirectToLogin, isFormValid } = this.state;

    if (redirectToLogin) {
      return <Redirect to="/my-profile" />;
    }

    const { group, isLoading, currentUser, chatData, places } = this.props;
    const messages = this.getChatMessages();

    const isMember = this.isMember();
    const isAdmin = this.isAdmin();

    const titleStyle = {
      marginLeft: 24,
      fontWeigth: 300,
      color: '#0g0g0g'
    };

    const collapseStyle = {
      marginBottom: 24,
      backgroundColor: '#fff',
      borderRadius: 0,
      borderColor: '#030303'
    };

    return (
      <div>
        <div style={{ padding: 24 }}>
          <Link to="/groups">
            <Button icon="arrow-left">Groups</Button>
          </Link>
        </div>

        {!isLoading && group ? (
          <Row gutter={24} style={{ paddingRight: 12, paddingLeft: 12 }}>
            <Col md={5} style={{ padding: 12, paddingTop: 0 }}>
              {!isAdmin && (
                <div style={{ padding: 12 }}>
                  <Button
                    type={isMember ? null : 'primary'}
                    onClick={this.openModal}
                    block
                  >
                    {isMember ? 'Leave group' : 'Join group'}
                  </Button>
                </div>
              )}

              {currentUser && (
                <Fragment>
                  <div style={{ paddingTop: 24, paddingLeft: 12 }}>
                    <h3>Members</h3>
                  </div>
                  <List
                    dataSource={group.members}
                    style={{ backgroundColor: '#fff' }}
                    renderItem={member => (
                      <ListItem>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            paddingLeft: 24
                          }}
                        >
                          <em>{member.username}</em>
                          {member.username === currentUser.username && ' you'}
                          {member.username === group.adminUsername && ' admin'}
                        </div>
                      </ListItem>
                    )}
                  />
                </Fragment>
              )}
            </Col>
            <Col sm={24} md={12}>
              <Card
                title={this.getTitle(group)}
                bordered
                extra={this.getExtra(group, isAdmin)}
                style={{ width: '100%', marginBottom: 24 }}
                cover={
                  group.imageUrl ? (
                    <img alt="group-image" src={group.imageUrl} />
                  ) : null
                }
              >
                <Meta description={group.description} />
              </Card>
            </Col>

            <Col sm={24} md={6} style={{ paddingTop: 24 }}>
              <div style={{ paddingLeft: 12 }}>
                <h3>Meetings</h3>

                <p style={{ textAlign: 'right' }}>
                  <em>
                    {group.meetings && group.meetings.length > 0
                      ? isAdmin
                        ? 'Click to see the attendees'
                        : 'Click to toggle attendance'
                      : 'No meeting scheduled yet'}
                  </em>
                </p>
              </div>
              {group.meetings && isAdmin ? (
                <div>
                  <Collapse
                    bordered={false}
                    accordion
                    defaultActiveKey={['1']}
                    style={{ ...collapseStyle }}
                  >
                    {this.renderDates()}
                  </Collapse>
                </div>
              ) : (
                <div style={{ marginBottom: 24 }}>{this.renderMeetings()}</div>
              )}

              {isAdmin && (
                <div>
                  <h3>Add a Meeting</h3>
                  <CreateMeetingForm
                    handleDateChange={(date, dateString) =>
                      this.handleDateAndTimeChange(
                        date,
                        dateString,
                        'startDate'
                      )
                    }
                    handleStartTimeChange={(time, timeString) =>
                      this.handleDateAndTimeChange(
                        time,
                        timeString,
                        'startTime'
                      )
                    }
                    handleFinishTimeChange={(time, timeString) =>
                      this.handleDateAndTimeChange(time, timeString, 'endTime')
                    }
                    places={places}
                    handlePlaceChange={this.handlePlaceChange}
                    handleSubmit={this.addMeeting}
                    buttonDisabled={!isFormValid}
                  />
                </div>
              )}
            </Col>
          </Row>
        ) : (
          <Loader />
        )}
        <Divider />
        <Row gutter={24}>
          <Col sm={24} md={16}>
            {chatData && (
              <div>
                <h4 style={titleStyle}>Chat Section</h4>
                <Chattery
                  messages={messages}
                  onNewMessage={this.addNewChatMessage}
                  removeNotification={this.removeNotification}
                  isMember={isMember}
                />
                {!isMember && (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      type="primary"
                      onClick={this.openModal}
                      style={{ marginBottom: 24 }}
                    >
                      Join this group
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>

        <Modal
          title={`Confirm ${
            isMember ? 'leaving' : 'participation to'
          } the group`}
          visible={this.state.modalOpen}
          onOk={isMember ? this.leaveGroup : this.joinGroup}
          onCancel={this.closeModal}
        >
          <p>
            Are you sure you want to
            {isMember ? ' leave ' : ' join '}
            this Group?
          </p>
        </Modal>
      </div>
    );
  }
}

export default Group;

const MeetingInfo = ({ meeting, onClick, isAttending }) => {
  const style = {
    flexBasis: 180,
    flexShrink: 0
  };
  if (isAttending) {
    style.backgroundColor = '#fff5f4';
  }

  return (
    <div style={style} className="toggleable" onClick={onClick}>
      <FancyDate meeting={meeting} />

      {isAttending && (
        <div style={{ paddingTop: 12, textAlign: 'center' }}>
          <em>You're attending</em>
          <Icon type="check" theme="outlined" style={{ marginLeft: 6 }} />
        </div>
      )}
    </div>
  );
};

const fancyDateStyle = {
  color: '#030303',
  fontWeight: 700,
  lineHeight: 1
};

const FancyDate = ({ meeting }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <div>
      <div style={{ ...fancyDateStyle, fontSize: 24 }}>
        {moment(meeting.startDate).format('DD')}
      </div>
      <div style={{ ...fancyDateStyle, fontSize: 15 }}>
        {moment(meeting.startDate)
          .format('MMM')
          .toUpperCase()}
      </div>
    </div>
    <div
      style={{
        ...fancyDateStyle,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}
    >
      <div>
        {meeting.startTime} – {meeting.endTime}
      </div>
      <div style={{ fontWeight: 300 }}>
        <em>{meeting.room}, Skogen</em>
      </div>
    </div>
  </div>
);

const CreateMeetingForm = ({
  handleDateChange,
  handleStartTimeChange,
  handleFinishTimeChange,
  places,
  handlePlaceChange,
  handleSubmit,
  buttonDisabled
}) => {
  return (
    <div
      style={{
        padding: 12,
        backgroundColor: '#f8f8f8',
        marginBottom: 12
      }}
    >
      <div style={{ marginBottom: 6 }}>
        <DatePicker onChange={handleDateChange} placeholder="Date" required />
      </div>

      <div style={{ marginBottom: 6 }}>
        <TimePicker
          onChange={handleStartTimeChange}
          format="HH:mm"
          minuteStep={30}
          placeholder="Start time"
          required
        />
      </div>

      <div style={{ marginBottom: 6 }}>
        <TimePicker
          onChange={handleFinishTimeChange}
          format="HH:mm"
          minuteStep={30}
          placeholder="Finish time"
          required
        />
      </div>

      <div style={{ marginBottom: 0 }}>
        <Select
          placeholder="Select room"
          defaultValue="Office"
          onChange={handlePlaceChange}
        >
          {places
            ? places.map((part, i) => (
                <Option key={part.name + i} value={part.name}>
                  {part.name}
                </Option>
              ))
            : null}
        </Select>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 0
        }}
      >
        <Button type="submit" onClick={handleSubmit} disabled={buttonDisabled}>
          Add
        </Button>
      </div>
    </div>
  );
};
