import { Meteor } from 'meteor/meteor';
import React, { Component, PureComponent, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import ReactDropzone from 'react-dropzone';
import { Visible } from 'react-grid-system';

import {
  Box,
  Layer,
  List,
  Calendar,
  Tabs,
  Tab,
  Image,
  Select,
  CheckBox,
  TextArea,
  Heading,
  Button,
  Accordion,
  AccordionPanel,
  Anchor,
  Text
} from 'grommet';
import { FormPrevious, Close } from 'grommet-icons';

import Chattery from '../../chattery';
import Loader from '../../UIComponents/Loader';
import FancyDate from '../../UIComponents/FancyDate';
import NiceList from '../../UIComponents/NiceList';
import InviteManager from './InviteManager';
import { TimePicker } from '../../UIComponents/DatesAndTimes';
import Template from '../../UIComponents/Template';
import ConfirmModal from '../../UIComponents/ConfirmModal';
import { message } from '../../UIComponents/message';

const publicSettings = Meteor.settings.public;
const defaultMeetingRoom = 'Office';

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
    const { history } = this.props;

    return (
      <Box>
        {group.isPrivate && (
          <div style={{ textAlign: 'right' }}>
            {/* <Tooltip
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
            </Tooltip> */}
          </div>
        )}
        <Box>
          <Heading level={3} style={{ overflowWrap: 'anywhere' }}>
            {group.title}
          </Heading>
          <Text weight={300}>{group.readingMaterial}</Text>
        </Box>
        <Box>
          {isAdmin ? (
            <Box alignSelf="end" direction="row">
              <Anchor
                onClick={() => history.push(`/edit-group/${group._id}`)}
                label="Edit"
              />
              {group.isPrivate && (
                <Anchor
                  onClick={this.handleOpenInviteManager}
                  style={{ marginLeft: 12 }}
                  label="Manage Access"
                />
              )}
            </Box>
          ) : (
            <Box alignSelf="end">{group.adminUsername}</Box>
          )}
        </Box>
      </Box>
    );
  };

  getExtra = (group, isAdmin) => {
    const { history } = this.props;

    if (isAdmin) {
      return (
        <Box alignSelf>
          <Anchor
            onClick={() => history.push(`/edit-group/${group._id}`)}
            label="Edit"
          />
        </Box>
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

  handleDateAndTimeChange = (dateOrTime, entity) => {
    const { newMeeting } = this.state;
    const newerMeeting = { ...newMeeting };
    newerMeeting[entity] = dateOrTime;

    this.setState({
      newMeeting: newerMeeting,
      isFormValid: this.isFormValid()
    });
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
        <AccordionPanel
          key={`${meeting.startTime} ${meeting.endTime} ${meetingIndex}`}
          header={
            <Box pad="small">
              <FancyDate occurence={meeting} places={places} />
            </Box>
          }
          style={{
            display: isFutureMeeting(meeting) ? 'block' : 'none'
          }}
        >
          <Box pad="small">
            <h4>Attendees ({meeting.attendees && meeting.attendees.length})</h4>
            {meeting.attendees && (
              <List data={meeting.attendees}>
                {attendee => (
                  <Box
                    key={attendee.memberUsername}
                    style={{
                      position: 'relative',
                      paddingTop: 6,
                      paddingBottom: 6
                    }}
                  >
                    {attendee.memberUsername}
                  </Box>
                )}
              </List>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <a onClick={() => this.deleteMeeting(meetingIndex)}>
                Delete this meeting
              </a>
            </div>
          </Box>
        </AccordionPanel>
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
        <AccordionPanel
          key={`${meeting.startTime} ${meeting.endTime} ${meetingIndex}`}
          header={
            <Box pad="small">
              <MeetingInfo
                isSmallViewport
                isAttending={isAttending}
                meeting={meeting}
                isFutureMeeting={isFutureMeeting(meeting)}
                places={places}
              />
            </Box>
          }
          style={{
            display: isFutureMeeting(meeting) ? 'block' : 'none'
          }}
        >
          <Box pad="small" justify="center" direction="row">
            <Button
              size="small"
              label={isAttending ? 'Cannot make it' : 'Register attendance'}
              onClick={() => this.toggleAttendance(meetingIndex)}
            />
          </Box>
        </AccordionPanel>
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
                        `${uploadableFile.name} is succesfully uploaded and assigned to this group!`
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
          <Box justify="center" direction="row" margin={{ bottom: 'large' }}>
            <Button
              label={isMember ? 'Leave group' : 'Join group'}
              primary={!isMember}
              onClick={this.openModal}
            />
          </Box>
        )}

        {currentUser && group && group.members && (
          <Fragment>
            <Heading level={4}>Members</Heading>
            <Box margin={{ bottom: 'medium' }}>
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
            </Box>
          </Fragment>
        )}

        <Heading level={4}>Documents</Heading>
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
          <Text size="small" pad="small">
            <em>No document assigned</em>
          </Text>
        )}

        {isAdmin && (
          <ReactDropzone onDrop={this.handleFileDrop} multiple={false}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <Box
                width="medium"
                height="small"
                background="light-1"
                round
                justify="center"
                pad="medium"
                {...getRootProps()}
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
              </Box>
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
    const { group, chatData } = this.props;
    const isAdmin = this.isAdmin();
    const isMember = this.isMember();

    return (
      <div>
        {this.getTitle(group, isAdmin)}

        <Tabs alignSelf="start" justify="start">
          <Tab title="Info">
            <Box
              width="large"
              height="medium"
              margin={{ top: 'small', bottom: 'small' }}
            >
              <Image src={group.imageUrl} fit="contain" fill />
            </Box>
            <div
              dangerouslySetInnerHTML={{
                __html: group.description
              }}
            />
          </Tab>
          <Tab title="Discussion">
            <div>{chatData && this.renderDiscussion()}</div>
          </Tab>
        </Tabs>
      </div>
    );
  };

  renderDiscussion = () => {
    const messages = this.getChatMessages();
    const isMember = this.isMember();

    return (
      <div>
        <Chattery
          messages={messages}
          onNewMessage={this.addNewChatMessage}
          removeNotification={this.removeNotification}
          isMember={isMember}
        />
        {!isMember && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 24
            }}
          >
            <Button label="Join this group" primary onClick={this.openModal} />
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
    const { group, isLoading, places, history } = this.props;

    if (!group || isLoading) {
      return <Loader />;
    }

    const {
      redirectToLogin,
      isFormValid,
      potentialNewAdmin,
      inviteManagerOpen,
      newMeeting,
      modalOpen
    } = this.state;

    if (redirectToLogin) {
      return <Redirect to="/my-profile" />;
    }

    const isMember = this.isMember();
    const isAdmin = this.isAdmin();

    if (group && group.isPrivate && this.isNoAccess()) {
      return null;
    }

    return (
      <div>
        <Box pad="small">
          <Anchor
            onClick={() => history.push('/groups')}
            label={
              <Button gap="none" plain label="Groups" icon={<FormPrevious />} />
            }
          />
        </Box>
        <Template
          leftContent={
            <Visible lg xl>
              {this.renderMembersAndDocuments()}
            </Visible>
          }
          rightContent={
            <Box pad="small">
              <Heading level={4}>Dates</Heading>

              <Text size="small" pad="small">
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
              </Text>

              {group.meetings && isAdmin ? (
                <div>
                  <Accordion animate multiple={false}>
                    {this.renderDates()}
                  </Accordion>
                </div>
              ) : (
                <Accordion>{this.renderMeetings()}</Accordion>
              )}

              {isAdmin && (
                <div>
                  <CreateMeetingForm
                    newMeeting={newMeeting}
                    handleDateChange={date =>
                      this.handleDateAndTimeChange(date, 'startDate')
                    }
                    handleStartTimeChange={time =>
                      this.handleDateAndTimeChange(time, 'startTime')
                    }
                    handleFinishTimeChange={time =>
                      this.handleDateAndTimeChange(time, 'endTime')
                    }
                    places={places}
                    handlePlaceChange={this.handlePlaceChange}
                    handleSubmit={this.addMeeting}
                    buttonDisabled={!isFormValid}
                  />
                </div>
              )}
            </Box>
          }
        >
          {this.renderGroupInfo()}
          <Visible sm md>
            {this.renderMembersAndDocuments()}
          </Visible>
        </Template>
        <ConfirmModal
          visible={modalOpen}
          title={`Confirm ${
            isMember ? 'leaving' : 'participation to'
          } the group`}
          onConfirm={isMember ? this.leaveGroup : this.joinGroup}
          onCancel={this.closeModal}
        >
          <Text>
            Are you sure you want to
            {isMember ? ' leave ' : ' join '}
            this Group?
          </Text>
        </ConfirmModal>
        <ConfirmModal
          visible={Boolean(potentialNewAdmin)}
          title="Are you sure?"
          onConfirm={this.changeAdmin}
          onCancel={() => this.setState({ potentialNewAdmin: null })}
        >
          <Text>
            <b>
              Please confirm you want to make {potentialNewAdmin} the new admin.
            </b>
          </Text>
          <Text>
            There can only be one admin at a time, so your admin priveleges will
            be removed, and you won't be able to regain it again unless{' '}
            {potentialNewAdmin} gives consent.
          </Text>
        </ConfirmModal>

        {group && group.isPrivate && inviteManagerOpen && (
          <Layer full="vertical" position="right">
            <Box fill style={{ maxWidth: '378px' }} pad="medium">
              <Box direction="row" align="start" justify="between">
                <Heading level={3}>Manage Access</Heading>
                <Button
                  flex={{ grow: 0 }}
                  icon={<Close />}
                  onClick={this.handleCloseInviteManager}
                  plain
                />
              </Box>
              <InviteManager group={group} />
            </Box>
          </Layer>
        )}
      </div>
    );
  }
}

const MeetingInfo = ({ meeting, isAttending, places }) => {
  return (
    <div>
      <FancyDate occurence={meeting} places={places} />

      {isAttending && (
        <div style={{ paddingTop: 12, textAlign: 'center' }}>
          <em>You're attending</em>
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
      newMeeting,
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
          marginBottom: 12,
          marginTop: 12
        }}
      >
        <h4>Add a Meeting</h4>
        <div style={{ marginBottom: 6 }}>
          <Calendar
            size="small"
            onSelect={handleDateChange}
            firstDayOfWeek={1}
          />
        </div>

        <div style={{ marginBottom: 6 }}>
          <TimePicker
            value={newMeeting.startTime}
            onChange={handleStartTimeChange}
          />
        </div>

        <div style={{ marginBottom: 6 }}>
          <TimePicker
            value={newMeeting.endTime}
            onChange={handleFinishTimeChange}
          />
        </div>

        <div style={{ marginBottom: 6 }}>
          <CheckBox
            checked={isLocal}
            label={`At ${publicSettings.contextName}?`}
            onChange={() => this.setState({ isLocal: event.target.checked })}
          />
        </div>

        <div style={{ marginBottom: 6 }}>
          {isLocal ? (
            <Select
              size="small"
              plain={false}
              placeholder="Select room"
              name="room"
              options={places.map((part, i) => part.name)}
              onChange={({ option }) => handlePlaceChange(option)}
            />
          ) : (
            <TextArea
              placeholder="Location"
              onChange={event => handlePlaceChange(event.target.value)}
              size="small"
              // style={{ width: 200 }}
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
            label="Add"
            type="submit"
            onClick={handleSubmit}
            disabled={buttonDisabled}
          />
        </div>
      </div>
    );
  }
}

export default Group;
