import { Meteor } from 'meteor/meteor';
import React, { Component, PureComponent, Fragment } from 'react';
import { Redirect, Link } from 'react-router-dom';
import moment from 'moment';
import ReactDropzone from 'react-dropzone';
import { Visible, ScreenClassRender } from 'react-grid-system';
import renderHTML from 'react-render-html';

import {
  Accordion,
  AccordionPanel,
  Anchor,
  Box,
  Button,
  Calendar,
  CheckBox,
  Heading,
  Image,
  Layer,
  List,
  Select,
  Tabs,
  Tab,
  Text,
  TextArea,
} from 'grommet';

import { Close } from 'grommet-icons/icons/Close';

import Chattery from '../../UIComponents/chattery/Chattery.jsx';
import Loader from '../../UIComponents/Loader';
import FancyDate from '../../UIComponents/FancyDate';
import NiceList from '../../UIComponents/NiceList';
import InviteManager from './InviteManager';
import { TimePicker } from '../../UIComponents/DatesAndTimes';
import Template from '../../UIComponents/Template';
import ConfirmModal from '../../UIComponents/ConfirmModal';
import { message } from '../../UIComponents/message';

const publicSettings = Meteor.settings.public;
const defaultMeetingResource = 'Office';

const yesterday = moment(new Date()).add(-1, 'days');

class Process extends Component {
  state = {
    modalOpen: false,
    redirectToLogin: false,
    newMeeting: {
      resource: defaultMeetingResource,
    },
    isFormValid: false,
    isUploading: false,
    droppedDocuments: null,
    potentialNewAdmin: false,
    inviteManagerOpen: false,
  };

  isMember = () => {
    const { currentUser, process } = this.props;
    if (!currentUser || !process) {
      return false;
    }

    const isMember = process.members.some(
      (member) => member.memberId === currentUser._id
    );

    return Boolean(isMember);
  };

  isAdmin = () => {
    const { currentUser, process } = this.props;
    if (!currentUser || !process) {
      return false;
    }

    const isAdmin = process && process.adminId === currentUser._id;

    return Boolean(isAdmin);
  };

  openModal = () => {
    if (!this.props.currentUser) {
      this.setState({
        redirectToLogin: true,
      });
      return;
    }
    this.setState({
      modalOpen: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalOpen: false,
    });
  };

  addNewChatMessage = (message) => {
    Meteor.call(
      'addChatMessage',
      this.props.process._id,
      message,
      (error, respond) => {
        if (error) {
          console.log('error', error);
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
      messages.forEach((message) => {
        if (message.senderId === currentUser._id) {
          message.isFromMe = true;
        }
      });
    }

    return messages;
  };

  getTitle = (process, isAdmin) => {
    const { history } = this.props;

    return (
      <Box>
        {process.isPrivate && (
          <div style={{ textAlign: 'right' }}>
            {/* <Tooltip
              placement="topRight"
              trigger={['hover', 'click', 'focus']}
              title={
                <span style={{ fontSize: 12 }}>
                  Private processes are only visible by their members, and
                  participation is possible only via invites by their admins.
                </span>
              }
            >
              <em style={{ fontSize: 12 }}>This is a private process</em>
            </Tooltip> */}
          </div>
        )}
        <Box pad="medium">
          <Heading
            level={3}
            style={{ overflowWrap: 'anywhere', lineBreak: 'anywhere' }}
            size="small"
          >
            {process.title}
          </Heading>
          <Text weight={300}>{process.readingMaterial}</Text>
        </Box>

        {isAdmin && process.isPrivate ? (
          <Box alignSelf="end" direction="row" pad="medium">
            <Anchor
              onClick={this.handleOpenInviteManager}
              style={{ marginLeft: 12 }}
              label="Manage Access"
            />
          </Box>
        ) : (
          <Box alignSelf="end" pad={{ right: 'medium' }}>
            {process.adminUsername}
          </Box>
        )}
      </Box>
    );
  };

  getExtra = (process, isAdmin) => {
    const { history } = this.props;

    if (isAdmin) {
      return (
        <Box alignSelf>
          <Anchor
            onClick={() => history.push(`/edit-process/${process._id}`)}
            label="Edit"
          />
        </Box>
      );
    } else {
      return <div>{process.adminUsername}</div>;
    }
  };

  joinProcess = () => {
    const { process } = this.props;

    this.closeModal();

    Meteor.call('joinProcess', process._id, (error, response) => {
      if (error) {
        message.error(error.error);
      } else {
        message.success('You are added to the process');
      }
    });
  };

  leaveProcess = () => {
    const { process } = this.props;

    this.closeModal();

    Meteor.call('leaveProcess', process._id, (error, response) => {
      if (error) {
        message.error(error.error);
      } else {
        message.info('You are removed from the process');
      }
    });
  };

  removeNotification = (messageIndex) => {
    const { process, currentUser } = this.props;
    const shouldRun = currentUser.notifications.find((notification) => {
      if (!notification.unSeenIndexes) {
        return false;
      }
      return notification.unSeenIndexes.some((unSeenIndex) => {
        return unSeenIndex === messageIndex;
      });
    });
    if (!shouldRun) {
      return;
    }

    Meteor.call(
      'removeNotification',
      process._id,
      messageIndex,
      (error, respond) => {
        if (error) {
          console.log('error', error);
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
    newerMeeting[entity] = dateOrTime.substring(0, 10);

    this.setState({
      newMeeting: newerMeeting,
      isFormValid: this.isFormValid(),
    });
  };

  handlePlaceChange = (place) => {
    const { newMeeting } = this.state;
    newMeeting.resource = place;
    this.setState({ newMeeting, isFormValid: this.isFormValid() });
  };

  addMeeting = () => {
    const { newMeeting } = this.state;
    const { process } = this.props;
    newMeeting.endDate = newMeeting.startDate;

    Meteor.call(
      'addProcessMeeting',
      newMeeting,
      process._id,
      (error, respond) => {
        if (error) {
          console.log('error', error);
          message.error(error.error);
        } else {
          message.success('Your process meeting is added!');
        }
      }
    );
  };

  toggleAttendance = (meetingIndex) => {
    const { process, currentUser } = this.props;

    if (!currentUser) {
      message.error('Please login and join the process to attend the meeting');
      return;
    }
    if (!this.isMember()) {
      message.error('Please join the process to attend the meeting');
      return;
    }

    const isAttending = process.meetings[meetingIndex].attendees
      .map((attendee) => attendee.memberId)
      .includes(currentUser._id);

    if (isAttending) {
      Meteor.call(
        'unAttendMeeting',
        process._id,
        meetingIndex,
        (error, respond) => {
          if (error) {
            console.log('error', error);
            message.error(error.error);
          } else {
            message.success('Your are successfully removed from the list!');
          }
        }
      );
    } else {
      Meteor.call(
        'attendMeeting',
        process._id,
        meetingIndex,
        (error, respond) => {
          if (error) {
            console.log('error', error);
            message.error(error.error);
          } else {
            message.success('Your attendance is successfully registered!');
          }
        }
      );
    }
  };

  deleteMeeting = (meetingIndex) => {
    const { process } = this.props;
    if (!process || !process.meetings) {
      return;
    }

    if (process.meetings[meetingIndex].attendees.length > 0) {
      message.error(
        'Sorry. Currently you can not delete meetings which have attendees registered to attend'
      );
      return;
    }

    Meteor.call(
      'deleteMeeting',
      process._id,
      meetingIndex,
      (error, respond) => {
        if (error) {
          console.log(error);
          message.error(error.error);
        } else {
          message.success('The meeting is successfully removed');
        }
      }
    );
  };

  renderDates = () => {
    const { process, resources } = this.props;
    if (!process) {
      return;
    }

    const isFutureMeeting = (meeting) =>
      moment(meeting.endDate).isAfter(yesterday);

    return (
      process &&
      process.meetings.map((meeting, meetingIndex) => (
        <AccordionPanel
          key={`${meeting.startTime} ${meeting.endTime} ${meetingIndex}`}
          header={
            <Box pad="small" background="white">
              <FancyDate occurence={meeting} resources={resources} />
            </Box>
          }
          style={{
            display: isFutureMeeting(meeting) ? 'block' : 'none',
          }}
        >
          <Box pad="small" background="white">
            <h4>Attendees ({meeting.attendees && meeting.attendees.length})</h4>
            {meeting.attendees && (
              <List data={meeting.attendees}>
                {(attendee) => (
                  <Box
                    key={attendee.memberUsername}
                    style={{
                      position: 'relative',
                      paddingTop: 6,
                      paddingBottom: 6,
                    }}
                  >
                    {attendee.memberUsername}
                  </Box>
                )}
              </List>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Anchor onClick={() => this.deleteMeeting(meetingIndex)}>
                Delete this meeting
              </Anchor>
            </div>
          </Box>
        </AccordionPanel>
      ))
    );
  };

  renderMeetings = () => {
    const { process, currentUser, resources } = this.props;
    if (!process || !process.meetings) {
      return;
    }

    const isFutureMeeting = (meeting) =>
      moment(meeting.endDate).isAfter(yesterday);

    return process.meetings.map((meeting, meetingIndex) => {
      const isAttending =
        currentUser &&
        meeting.attendees &&
        meeting.attendees
          .map((attendee) => attendee.memberId)
          .includes(currentUser._id);

      return (
        <AccordionPanel
          key={`${meeting.startTime} ${meeting.endTime} ${meetingIndex}`}
          header={
            <Box pad="small" background="white">
              <MeetingInfo
                isSmallViewport
                isAttending={isAttending}
                meeting={meeting}
                isFutureMeeting={isFutureMeeting(meeting)}
                resources={resources}
              />
            </Box>
          }
          style={{
            display: isFutureMeeting(meeting) ? 'block' : 'none',
          }}
        >
          <Box pad="small" justify="center" direction="row" background="white">
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

  handleFileDrop = (files) => {
    if (files.length !== 1) {
      message.error('Please drop only one file at a time.');
      return;
    }

    const { process } = this.props;
    this.setState({ isUploading: true });

    const closeLoader = () => this.setState({ isUploading: false });

    const upload = new Slingshot.Upload('processDocumentUpload');
    files.forEach((file) => {
      const parsedName = file.name.replace(/\s+/g, '-').toLowerCase();
      const uploadableFile = new File([file], parsedName, {
        type: file.type,
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
            'process',
            process._id,
            (error, respond) => {
              if (error) {
                message.error(error);
                console.log(error);
                closeLoader();
              } else {
                console.log(respond);
                Meteor.call(
                  'addProcessDocument',
                  { name: uploadableFile.name, downloadUrl },
                  process._id,
                  (error, respond) => {
                    if (error) {
                      message.error(error);
                      console.log(error);
                      closeLoader();
                    } else {
                      console.log(respond);
                      message.success(
                        `${uploadableFile.name} is succesfully uploaded and assigned to this process!`
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

    const { process } = this.props;
    Meteor.call(
      'changeAdmin',
      process._id,
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

  handleOpenInviteManager = (event) => {
    event.preventDefault();
    this.setState({
      inviteManagerOpen: true,
    });
  };

  handleCloseInviteManager = () => {
    this.setState({
      inviteManagerOpen: false,
    });
  };

  renderMembersAndDocuments = () => {
    const { process, currentUser } = this.props;

    const { isUploading } = this.state;

    const isMember = this.isMember();
    const isAdmin = this.isAdmin();

    const documentsList =
      process &&
      process.documents &&
      process.documents.map((document) => ({
        ...document,
        actions: [
          {
            content: 'Remove',
            handleClick: () => this.removeProcessDocument(document.name),
          },
        ],
      }));

    const membersList =
      process &&
      process.members &&
      process.members.map((member) => ({
        ...member,
        actions: [
          {
            content: 'Make admin',
            handleClick: () =>
              this.setState({
                potentialNewAdmin: member.username,
              }),
            isDisabled: member.username === process.adminUsername,
          },
        ],
      }));

    return (
      <Box>
        {!isAdmin && (
          <Box justify="center" direction="row" margin={{ bottom: 'large' }}>
            <Button
              label={isMember ? 'Leave process' : 'Join process'}
              primary={!isMember}
              onClick={this.openModal}
            />
          </Box>
        )}

        {currentUser && process && process.members && (
          <Fragment>
            <Heading level={5}>Members</Heading>
            <Box margin={{ bottom: 'medium' }}>
              <NiceList list={membersList} actionsDisabled={!isAdmin}>
                {(member) => (
                  <span
                    style={{
                      fontWeight:
                        process.adminId === member.memberId ? 700 : 400,
                    }}
                  >
                    {member.username}
                  </span>
                )}
              </NiceList>
            </Box>
          </Fragment>
        )}

        <Heading level={5}>Documents</Heading>
        {process && process.documents && process.documents.length > 0 ? (
          <NiceList list={documentsList} actionsDisabled={!isAdmin}>
            {(document) => (
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
          <Box>
            <ReactDropzone onDrop={this.handleFileDrop} multiple={false}>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <Box
                  width="medium"
                  height="small"
                  background="white"
                  round="4px"
                  justify="center"
                  pad="medium"
                  {...getRootProps()}
                >
                  {isUploading ? (
                    <div style={{ textAlign: 'center' }}>
                      <Loader />
                      uploading
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <b>Drop documents to upload</b>
                    </div>
                  )}
                  <input {...getInputProps()} />
                </Box>
              )}
            </ReactDropzone>
          </Box>
        )}
      </Box>
    );
  };

  removeProcessDocument = (documentName) => {
    if (!this.isAdmin()) {
      return;
    }

    Meteor.call(
      'removeProcessDocument',
      documentName,
      this.props.process._id,
      (error, respond) => {
        if (error) {
          console.log('error', error);
          message.error(error.error);
        } else {
          message.success('The manual is successfully removed');
        }
      }
    );
  };

  renderProcessInfo = () => {
    const { process, chatData } = this.props;
    const isAdmin = this.isAdmin();
    const isMember = this.isMember();

    return (
      <div>
        {this.getTitle(process, isAdmin)}
        <ScreenClassRender
          render={(screenClass) => (
            <Tabs alignSelf="start" justify="start">
              <Tab title="Info" style={{ marginLeft: 12 }}>
                <Box
                  alignSelf="center"
                  width={screenClass === 'xs' ? 'medium' : 'large'}
                  height={screenClass === 'xs' ? 'small' : 'medium'}
                  margin={{ top: 'small', bottom: 'small' }}
                  pad={{ top: 'medium' }}
                >
                  <Image src={process.imageUrl} fit="contain" fill />
                </Box>
                <Box pad="medium">
                  <div className="text-content">
                    {renderHTML(process.description)}
                  </div>
                </Box>
              </Tab>
              <Tab title="Discussion" style={{ marginLeft: 12 }}>
                <div>{chatData && this.renderDiscussion()}</div>
              </Tab>
            </Tabs>
          )}
        />
      </div>
    );
  };

  renderDiscussion = () => {
    const messages = this.getChatMessages();
    const isMember = this.isMember();

    return (
      <Box pad="medium">
        <Box background="light-2">
          <Chattery
            messages={messages}
            onNewMessage={this.addNewChatMessage}
            removeNotification={this.removeNotification}
            isMember={isMember}
          />
        </Box>
        {!isMember && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 24,
            }}
          >
            <Button
              label="Join this process"
              primary
              onClick={this.openModal}
              margin="medium"
            />
          </div>
        )}
      </Box>
    );
  };

  isInvited = () => {
    const { process, currentUser } = this.props;

    if (!currentUser || !process) {
      return false;
    }

    const isInvited = process.peopleInvited.some(
      (person) => person.email === currentUser.emails[0].address
    );

    return Boolean(isInvited);
  };

  isNoAccess = () => {
    return !this.isMember() && !this.isAdmin() && !this.isInvited();
  };

  render() {
    const { process, isLoading, resources, history } = this.props;

    if (!process || isLoading) {
      return <Loader />;
    }

    const {
      redirectToLogin,
      isFormValid,
      potentialNewAdmin,
      inviteManagerOpen,
      newMeeting,
      modalOpen,
    } = this.state;

    if (redirectToLogin) {
      return <Redirect to="/my-profile" />;
    }

    const isMember = this.isMember();
    const isAdmin = this.isAdmin();

    if (process && process.isPrivate && this.isNoAccess()) {
      return null;
    }

    return (
      <div>
        <Template
          leftContent={
            <Visible lg xl>
              <Box pad="medium">{this.renderMembersAndDocuments()}</Box>
            </Visible>
          }
          rightContent={
            <Box pad="medium">
              <Heading level={5}>Dates</Heading>

              <Text size="small" pad="small" margin={{ bottom: 'medium' }}>
                <em>
                  {process.meetings &&
                  process.meetings.filter((meeting) =>
                    moment(meeting.endDate).isAfter(yesterday)
                  ).length > 0
                    ? isAdmin
                      ? 'Open the dates to see the attendees'
                      : 'Click and open the date to RSVP'
                    : 'No meeting scheduled yet'}
                </em>
              </Text>

              {process.meetings && isAdmin ? (
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
                    handleDateChange={(date) =>
                      this.handleDateAndTimeChange(date, 'startDate')
                    }
                    handleStartTimeChange={(time) =>
                      this.handleDateAndTimeChange(time, 'startTime')
                    }
                    handleFinishTimeChange={(time) =>
                      this.handleDateAndTimeChange(time, 'endTime')
                    }
                    resources={resources}
                    handlePlaceChange={this.handlePlaceChange}
                    handleSubmit={this.addMeeting}
                    buttonDisabled={!isFormValid}
                  />
                </div>
              )}
            </Box>
          }
        >
          <Box background="white">{this.renderProcessInfo()}</Box>
          <Visible sm md>
            {this.renderMembersAndDocuments()}
          </Visible>
          {isAdmin && (
            <Box
              direction="row"
              justify="center"
              pad="medium"
              margin={{ bottom: 'large' }}
            >
              <Link to={`/edit-process/${process._id}`}>
                <Anchor label="Edit this Process" />
              </Link>
            </Box>
          )}
        </Template>
        <ConfirmModal
          visible={modalOpen}
          title={`Confirm ${
            isMember ? 'leaving' : 'participation to'
          } the process`}
          onConfirm={isMember ? this.leaveProcess : this.joinProcess}
          onCancel={this.closeModal}
        >
          <Text>
            Are you sure you want to
            {isMember ? ' leave ' : ' join '}
            this Process?
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

        {process && process.isPrivate && inviteManagerOpen && (
          <Layer full="vertical" position="right">
            <Box fill style={{ maxWidth: '378px' }} pad="medium">
              <Box direction="row" align="start" justify="between">
                <Heading level={5}>Manage Access</Heading>
                <Button
                  flex={{ grow: 0 }}
                  icon={<Close />}
                  onClick={this.handleCloseInviteManager}
                  plain
                />
              </Box>
              <InviteManager process={process} />
            </Box>
          </Layer>
        )}
      </div>
    );
  }
}

const MeetingInfo = ({ meeting, isAttending, resources }) => {
  return (
    <Box>
      <FancyDate occurence={meeting} resources={resources} />

      {isAttending && (
        <div style={{ paddingTop: 12, textAlign: 'center' }}>
          <em>You're attending</em>
        </div>
      )}
    </Box>
  );
};

class CreateMeetingForm extends PureComponent {
  state = {
    isLocal: true,
  };

  render() {
    const {
      newMeeting,
      handleDateChange,
      handleStartTimeChange,
      handleFinishTimeChange,
      resources,
      handlePlaceChange,
      handleSubmit,
      buttonDisabled,
    } = this.props;

    const { isLocal } = this.state;

    return (
      <Box pad="small" background="white" margin={{ vertical: 'small' }}>
        <h4>Add a Meeting</h4>
        <div style={{ marginBottom: 6 }}>
          <Calendar
            size="small"
            date={
              newMeeting.startDate
                ? newMeeting.startDate + 'T00:00:00.000Z'
                : new Date().toISOString()
            }
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
            label={`At ${publicSettings.name}?`}
            onChange={() => this.setState({ isLocal: event.target.checked })}
          />
        </div>

        <div style={{ marginBottom: 6 }}>
          {isLocal ? (
            <Select
              size="small"
              plain={false}
              placeholder="Select resource"
              name="resource"
              options={resources.map((part, i) => part.label)}
              onChange={({ option }) => handlePlaceChange(option)}
            />
          ) : (
            <TextArea
              placeholder="Location"
              onChange={(event) => handlePlaceChange(event.target.value)}
              size="small"
            />
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 0,
          }}
        >
          <Button
            label="Add"
            type="submit"
            onClick={handleSubmit}
            disabled={buttonDisabled}
          />
        </div>
      </Box>
    );
  }
}

export default Process;
