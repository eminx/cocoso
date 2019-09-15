import React, { Component, PureComponent, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import ReactDropzone from 'react-dropzone';
import MediaQuery from 'react-responsive';

import {
  Row,
  Col,
  Anchor,
  Divider,
  Collapse,
  Drawer,
  Modal,
  List,
  Card,
  Button,
  DatePicker,
  TimePicker,
  Input,
  Select,
  Switch,
  Icon,
  Tooltip,
  message
} from 'antd/lib';
const ListItem = List.Item;
const { Meta } = Card;
const { Option } = Select;
const Panel = Collapse.Panel;
const { TextArea } = Input;

import Chattery from '../../chattery';
import Loader from '../../UIComponents/Loader';
import FancyDate from '../../UIComponents/FancyDate';
import NiceList from '../../UIComponents/NiceList';
import InviteManager from './InviteManager';

const defaultMeetingRoom = 'Office';

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 12,
  paddingRight: 12,
  border: 0,
  overflow: 'hidden'
};

const yesterday = moment(new Date()).add(-1, 'days');

class Group extends Component {
  state = {
    modalOpen: false,
    redirectToLogin: false,
    newMeeting: {
      room: defaultMeetingRoom
    },
    isFormValid: false,
    isUploading: false,
    droppedDocuments: null,
    potentialNewAdmin: false,
    inviteManagerOpen: false
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

  getTitle = (group, isAdmin) => {
    return (
      <div>
        {group.isPrivate && (
          <div style={{ textAlign: 'right' }}>
            <Tooltip
              placement="topRight"
              trigger={['hover', 'click', 'focus']}
              title={
                <span style={{ fontSize: 12 }}>
                  Private groups are only visible by their members, and
                  participation is possible only via invites by their admins.
                </span>
              }
            >
              <em style={{ fontSize: 12 }}>This is a private group</em>
            </Tooltip>
          </div>
        )}
        <div>
          <h2 style={{ overflowWrap: 'anywhere' }}>{group.title}</h2>
          <h5>
            <span>{group.readingMaterial}</span>
          </h5>
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 14 }}
        >
          {isAdmin ? (
            <div>
              <Link to={`/edit-group/${group._id}`}>Edit</Link>
              {group.isPrivate && (
                <a
                  onClick={this.handleOpenInviteManager}
                  style={{ marginLeft: 12 }}
                >
                  Manage Access
                </a>
              )}
            </div>
          ) : (
            <div>{group.adminUsername}</div>
          )}
        </div>
      </div>
    );
  };

  getExtra = (group, isAdmin) => {
    if (isAdmin) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to={`/edit-group/${group._id}`}>Edit</Link>
        </div>
      );
    } else {
      return <div>{group.adminUsername}</div>;
    }
  };

  joinGroup = () => {
    const { group } = this.props;

    this.closeModal();

    Meteor.call('joinGroup', group._id, (error, response) => {
      if (error) {
        message.destroy();
        message.error(error.error);
      } else {
        message.destroy();
        message.success('You are added to the group');
      }
    });
  };

  leaveGroup = () => {
    const { group } = this.props;

    this.closeModal();

    Meteor.call('leaveGroup', group._id, (error, response) => {
      if (error) {
        message.destroy();
        message.error(error.error);
      } else {
        message.destroy();
        message.info('You are removed from the group');
      }
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

    if (!currentUser) {
      message.destroy();
      message.error('Please login and join the group to attend the meeting');
      return;
    }
    if (!this.isMember()) {
      message.destroy();
      message.error('Please join the group to attend the meeting');
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

  deleteMeeting = meetingIndex => {
    const { group } = this.props;
    if (!group || !group.meetings) {
      return;
    }

    if (group.meetings[meetingIndex].attendees.length > 0) {
      message.error(
        'Sorry. Currently you can not delete meetings which have attendees registered to attend'
      );
      return;
    }

    Meteor.call('deleteMeeting', group._id, meetingIndex, (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.error);
      } else {
        message.success('The meeting is successfully removed');
      }
    });
  };

  renderDates = () => {
    const { group, places } = this.props;
    if (!group) {
      return;
    }

    const isFutureMeeting = meeting =>
      moment(meeting.endDate).isAfter(yesterday);

    return (
      group &&
      group.meetings.map((meeting, meetingIndex) => (
        <Panel
          key={`${meeting.startTime} ${meeting.endTime} ${meetingIndex}`}
          header={
            <div>
              <FancyDate occurence={meeting} places={places} />
              {/* <div style={{ marginTop: 12, textAlign: 'center' }}>
                <span>{meeting.attendees && meeting.attendees.length}</span>
              </div> */}
            </div>
          }
          style={{
            ...customPanelStyle,
            flexBasis: 200,
            flexShrink: 0,
            display: isFutureMeeting(meeting) ? 'block' : 'none'
          }}
        >
          <div style={{ marginLeft: 24 }}>
            <h4>Attendees ({meeting.attendees && meeting.attendees.length})</h4>
            {meeting.attendees && (
              <List>
                {meeting.attendees.map(attendee => (
                  <ListItem
                    key={attendee.memberUsername}
                    style={{
                      position: 'relative',
                      paddingTop: 6,
                      paddingBottom: 6
                    }}
                  >
                    {attendee.memberUsername}
                  </ListItem>
                ))}
              </List>
            )}

            <Divider />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <a onClick={() => this.deleteMeeting(meetingIndex)}>
                Delete this meeting
              </a>
            </div>
          </div>
        </Panel>
      ))
    );
  };

  renderMeetings = () => {
    const { group, currentUser, places } = this.props;
    if (!group || !group.meetings) {
      return;
    }

    const isFutureMeeting = meeting =>
      moment(meeting.endDate).isAfter(yesterday);

    return group.meetings.map((meeting, meetingIndex) => {
      const isAttending =
        currentUser &&
        meeting.attendees &&
        meeting.attendees
          .map(attendee => attendee.memberId)
          .includes(currentUser._id);

      return (
        <Panel
          key={`${meeting.startTime} ${meeting.endTime} ${meetingIndex}`}
          header={
            <MeetingInfo
              isSmallViewport
              isAttending={isAttending}
              meeting={meeting}
              isFutureMeeting={isFutureMeeting(meeting)}
              places={places}
            />
          }
          style={{
            ...customPanelStyle,
            flexBasis: 200,
            flexShrink: 0,
            display: isFutureMeeting(meeting) ? 'block' : 'none'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingLeft: 12
            }}
          >
            <Button onClick={() => this.toggleAttendance(meetingIndex)}>
              {isAttending ? 'Cannot make it' : 'Register attendance'}
            </Button>
          </div>
        </Panel>
      );
    });
  };

  handleFileDrop = files => {
    if (files.length !== 1) {
      message.error('Please drop only one file at a time.');
      return;
    }

    const { group } = this.props;
    this.setState({ isUploading: true });

    const closeLoader = () => this.setState({ isUploading: false });

    const upload = new Slingshot.Upload('groupDocumentUpload');
    files.forEach(file => {
      const parsedName = file.name.replace(/\s+/g, '-').toLowerCase();
      const uploadableFile = new File([file], parsedName, {
        type: file.type
      });
      upload.send(uploadableFile, (error, downloadUrl) => {
        if (error) {
          console.error('Error uploading:', error);
          message.error(error.reason);
          closeLoader();
          return;
        } else {
          Meteor.call(
            'createDocument',
            uploadableFile.name,
            downloadUrl,
            'group',
            group._id,
            (error, respond) => {
              if (error) {
                message.error(error);
                console.log(error);
                closeLoader();
              } else {
                console.log(respond);
                Meteor.call(
                  'addGroupDocument',
                  { name: uploadableFile.name, downloadUrl },
                  group._id,
                  (error, respond) => {
                    if (error) {
                      message.error(error);
                      console.log(error);
                      closeLoader();
                    } else {
                      console.log(respond);
                      message.success(
                        `${
                          uploadableFile.name
                        } is succesfully uploaded and assigned to this group!`
                      );
                      closeLoader();
                    }
                  }
                );
              }
            }
          );
        }
      });
    });
  };

  changeAdmin = () => {
    const { potentialNewAdmin } = this.state;

    const closeModal = () => this.setState({ potentialNewAdmin: false });

    const { group } = this.props;
    Meteor.call(
      'changeAdmin',
      group._id,
      potentialNewAdmin,
      (error, respond) => {
        if (error) {
          console.log(error);
          message.error(error.error);
          closeModal();
        } else {
          message.success('The admin is successfully changed');
          closeModal();
        }
      }
    );
  };

  handleOpenInviteManager = event => {
    event.preventDefault();
    this.setState({
      inviteManagerOpen: true
    });
  };

  handleCloseInviteManager = () => {
    this.setState({
      inviteManagerOpen: false
    });
  };

  renderMembersAndDocuments = () => {
    const { group, currentUser } = this.props;

    const { isUploading } = this.state;

    const isMember = this.isMember();
    const isAdmin = this.isAdmin();

    const documentsList =
      group &&
      group.documents &&
      group.documents.map(document => ({
        ...document,
        actions: [
          {
            content: 'Remove',
            handleClick: () => this.removeGroupDocument(document.name)
          }
        ]
      }));

    const membersList =
      group &&
      group.members &&
      group.members.map(member => ({
        ...member,
        actions: [
          {
            content: 'Make admin',
            handleClick: () =>
              this.setState({
                potentialNewAdmin: member.username
              }),
            isDisabled: member.username === group.adminUsername
          }
        ]
      }));

    return (
      <Fragment>
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

        {currentUser && group && group.members && (
          <Fragment>
            <div style={{ paddingTop: 24, paddingLeft: 12 }}>
              <h3>Members</h3>
            </div>
            <div style={{ paddingLeft: 12 }}>
              <NiceList list={membersList} actionsDisabled={!isAdmin}>
                {member => (
                  <span
                    style={{
                      fontWeight: group.adminId === member.memberId ? 700 : 400
                    }}
                  >
                    {member.username}
                  </span>
                )}
              </NiceList>
            </div>
          </Fragment>
        )}

        <Divider />

        <div style={{ paddingTop: 24, paddingLeft: 12 }}>
          <h3>Documents</h3>
        </div>
        <div style={{ paddingLeft: 12 }}>
          {group && group.documents && group.documents.length > 0 ? (
            <NiceList list={documentsList} actionsDisabled={!isAdmin}>
              {document => (
                <div style={{ width: '100%' }}>
                  <a href={document.downloadUrl} target="_blank">
                    {document.name}
                  </a>
                </div>
              )}
            </NiceList>
          ) : (
            <em>No document assigned</em>
          )}
        </div>

        {isAdmin && (
          <ReactDropzone onDrop={this.handleFileDrop} multiple={false}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                {...getRootProps()}
                style={{
                  width: '100%',
                  height: 200,
                  background: isDragActive ? '#ea3924' : '#fff5f4cc',
                  padding: 24,
                  border: '1px dashed #ea3924',
                  textAlign: 'center'
                }}
              >
                {isUploading ? (
                  <div>
                    <Loader />
                    uploading
                  </div>
                ) : (
                  <div>
                    <b>Drop documents to upload</b>
                  </div>
                )}
                <input {...getInputProps()} />
              </div>
            )}
          </ReactDropzone>
        )}
      </Fragment>
    );
  };

  removeGroupDocument = documentName => {
    if (!this.isAdmin()) {
      return;
    }

    Meteor.call(
      'removeGroupDocument',
      documentName,
      this.props.group._id,
      (error, respond) => {
        if (error) {
          console.log('error', error);
          message.destroy();
          message.error(error.error);
        } else {
          message.success('The manual is successfully removed');
        }
      }
    );
  };

  renderGroupInfo = () => {
    const { group } = this.props;
    const isAdmin = this.isAdmin();

    return (
      <Card
        title={this.getTitle(group, isAdmin)}
        bordered
        // extra={this.getExtra(group, isAdmin)}
        style={{ width: '100%', marginBottom: 24 }}
        cover={
          group.imageUrl ? <img alt="group-image" src={group.imageUrl} /> : null
        }
      >
        <Meta
          description={
            <div
              dangerouslySetInnerHTML={{
                __html: group.description
              }}
            />
          }
        />
      </Card>
    );
  };

  renderDiscussion = () => {
    const messages = this.getChatMessages();
    const isMember = this.isMember();

    const titleStyle = {
      marginLeft: 24,
      fontWeigth: 300,
      color: '#0g0g0g'
    };

    return (
      <div>
        <h3 style={titleStyle}>Discussion</h3>
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
    );
  };

  isInvited = () => {
    const { group, currentUser } = this.props;

    if (!currentUser || !group) {
      return false;
    }

    const isInvited = group.peopleInvited.some(
      person => person.email === currentUser.emails[0].address
    );

    return Boolean(isInvited);
  };

  isNoAccess = () => {
    return !this.isMember() && !this.isAdmin() && !this.isInvited();
  };

  render() {
    const {
      redirectToLogin,
      isFormValid,
      potentialNewAdmin,
      inviteManagerOpen
    } = this.state;

    if (redirectToLogin) {
      return <Redirect to="/my-profile" />;
    }

    const { group, isLoading, chatData, places } = this.props;

    const isMember = this.isMember();
    const isAdmin = this.isAdmin();

    const collapseStyle = {
      marginBottom: 24,
      backgroundColor: '#fff',
      borderRadius: 0,
      borderColor: '#030303'
    };

    if (group && group.isPrivate && this.isNoAccess()) {
      return null;
    }

    return (
      <div>
        <div style={{ padding: 12 }}>
          <Link to="/groups">
            <Button icon="arrow-left">Groups</Button>
          </Link>
        </div>

        {!isLoading && group ? (
          <Row gutter={24} style={{ paddingRight: 12, paddingLeft: 12 }}>
            <Col lg={5} style={{ padding: 12, paddingTop: 0 }}>
              <MediaQuery query="(min-width: 992px)">
                {this.renderMembersAndDocuments()}
              </MediaQuery>
            </Col>

            <Col md={14} lg={12}>
              {this.renderGroupInfo()}
            </Col>

            <Col md={10} lg={6} style={{ paddingTop: 24 }}>
              <div style={{ paddingLeft: 12, paddingRight: 12 }}>
                <h3>Meetings</h3>

                <p style={{ textAlign: 'right' }}>
                  <em>
                    {group.meetings &&
                    group.meetings.filter(meeting =>
                      moment(meeting.endDate).isAfter(yesterday)
                    ).length > 0
                      ? isAdmin
                        ? 'Open the dates to see the attendees'
                        : 'Click and open the date to RSVP'
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
                <Collapse
                  bordered={false}
                  accordion
                  defaultActiveKey={['1']}
                  style={{ ...collapseStyle }}
                >
                  {this.renderMeetings()}
                </Collapse>
              )}

              {isAdmin && (
                <div>
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

        <Row gutter={24}>
          <Col lg={5} />
          <Col md={14} lg={12}>
            {chatData && this.renderDiscussion()}
          </Col>
          <Col md={10} lg={6} />
        </Row>

        <MediaQuery query="(max-width: 991px)">
          <Row>
            <div style={{ padding: 12 }}>
              {this.renderMembersAndDocuments()}
            </div>
          </Row>
        </MediaQuery>

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

        <Modal
          title="Are you sure?"
          visible={Boolean(potentialNewAdmin)}
          onOk={this.changeAdmin}
          onCancel={() => this.setState({ potentialNewAdmin: null })}
        >
          <p>
            <b>
              Please confirm you want to make {potentialNewAdmin} the new admin.
            </b>
          </p>
          <p>
            There can only be one admin at a time, so your admin priveleges will
            be removed.
          </p>
        </Modal>

        {group && group.isPrivate && (
          <Drawer
            width="80%"
            title="Manage Access"
            visible={inviteManagerOpen}
            onClose={this.handleCloseInviteManager}
          >
            <InviteManager group={group} />
          </Drawer>
        )}
      </div>
    );
  }
}

const MeetingInfo = ({ meeting, isAttending, places }) => {
  const style = {
    flexBasis: 180,
    flexShrink: 0
  };

  return (
    <div style={style}>
      <FancyDate occurence={meeting} places={places} />

      {isAttending && (
        <div style={{ paddingTop: 12, textAlign: 'center' }}>
          <em>You're attending</em>
          <Icon type="check" theme="outlined" style={{ marginLeft: 6 }} />
        </div>
      )}
    </div>
  );
};

class CreateMeetingForm extends PureComponent {
  state = {
    isLocal: true
  };

  render() {
    const {
      handleDateChange,
      handleStartTimeChange,
      handleFinishTimeChange,
      places,
      handlePlaceChange,
      handleSubmit,
      buttonDisabled
    } = this.props;

    const { isLocal } = this.state;

    return (
      <div
        style={{
          padding: 12,
          backgroundColor: '#f8f8f8',
          marginBottom: 12
        }}
      >
        <h4>Add a Meeting</h4>
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

        <div style={{ marginBottom: 6 }}>
          <Switch
            checked={isLocal}
            onChange={() => this.setState({ isLocal: !isLocal })}
          />
          <span style={{ marginLeft: 12 }}>At Skogen? </span>
        </div>

        <div style={{ marginBottom: 6 }}>
          {isLocal ? (
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
          ) : (
            <TextArea
              placeholder="Location"
              onChange={event => handlePlaceChange(event.target.value)}
              autosize={{ minRows: 2, maxRows: 4 }}
              style={{ width: 200 }}
            />
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 0
          }}
        >
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={buttonDisabled}
          >
            Add
          </Button>
        </div>
      </div>
    );
  }
}

export default Group;
