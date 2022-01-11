import { Meteor } from 'meteor/meteor';
import React, { Component, useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import moment from 'moment';
import ReactDropzone from 'react-dropzone';
import { Visible, ScreenClassRender } from 'react-grid-system';
import renderHTML from 'react-render-html';
import { formatDate } from '../../@/shared.js';
import DatePicker from '../../components/DatePicker.jsx';

import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Link as CLink,
  List,
  Select,
  Switch,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Text,
  Textarea,
} from '@chakra-ui/react';

import Drawer from '../../components/Drawer.jsx';
import Chattery from '../../components/chattery/Chattery.jsx';
import Loader from '../../components/Loader';
import FancyDate from '../../components/FancyDate';
import NiceList from '../../components/NiceList';
import InviteManager from './InviteManager';
import { TimePicker } from '../../components/DatesAndTimes';
import Template from '../../components/Template';
import ConfirmModal from '../../components/ConfirmModal';
import { message } from '../../components/message';

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
      <Flex>
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
        <Box flexGrow={1} mb="2" p="4">
          <Heading
            mb="2"
            size="lg"
            style={{ overflowWrap: 'anywhere', lineBreak: 'anywhere' }}
          >
            {process.title}
          </Heading>
          <Text fontWeight="light">{process.readingMaterial}</Text>
        </Box>

        {isAdmin && process.isPrivate ? (
          <Flex align="flex-end" direction="row" p="4">
            <CLink onClick={this.handleOpenInviteManager} ml="4">
              Manage Access
            </CLink>
          </Flex>
        ) : (
          <Box alignSelf="end" p="4">
            {process.adminUsername}
          </Box>
        )}
      </Flex>
    );
  };

  joinProcess = () => {
    const { process, currentUser } = this.props;
    this.closeModal();

    if (!process || !currentUser) {
      return;
    }

    const alreadyMember = process.members.some((m) => {
      return m.memberId === currentUser._id;
    });

    if (alreadyMember) {
      message.error('You are already a member!');
      return;
    }

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
    newerMeeting[entity] = dateOrTime;

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
        <AccordionItem
          key={`${meeting.startTime} ${meeting.endTime} ${meetingIndex}`}
          bg="white"
          mb="2"
          style={{
            display: isFutureMeeting(meeting) ? 'block' : 'none',
          }}
        >
          <AccordionButton _expanded={{ bg: 'green.100' }}>
            <Box flex="1" textAlign="left">
              <FancyDate occurence={meeting} resources={resources} />
            </Box>
          </AccordionButton>
          <AccordionPanel>
            <Heading size="sm">Attendees</Heading>
            {meeting.attendees && (
              <List>
                {meeting.attendees.map((attendee) => (
                  <Box key={attendee.memberUsername}>
                    {attendee.memberUsername}
                  </Box>
                ))}
              </List>
            )}
            <Center py="2" mt="2">
              <Button
                size="xs"
                colorScheme="red"
                onClick={() => this.deleteMeeting(meetingIndex)}
              >
                Delete this meeting
              </Button>
            </Center>
          </AccordionPanel>
        </AccordionItem>
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
        <AccordionItem
          key={`${meeting.startTime} ${meeting.endTime} ${meetingIndex}`}
          bg="white"
          mb="2"
          style={{
            display: isFutureMeeting(meeting) ? 'block' : 'none',
          }}
        >
          <AccordionButton _expanded={{ bg: 'green.100' }}>
            <Box flex="1" textAlign="left">
              <MeetingInfo
                isSmallViewport
                isAttending={isAttending}
                meeting={meeting}
                isFutureMeeting={isFutureMeeting(meeting)}
                resources={resources}
              />
            </Box>
          </AccordionButton>

          <AccordionPanel>
            <Center p="2" bg="white">
              <Button
                size="sm"
                colorScheme={isAttending ? 'gray' : 'green'}
                onClick={() => this.toggleAttendance(meetingIndex)}
              >
                {isAttending ? 'Cannot make it' : 'Register attendance'}
              </Button>
            </Center>
          </AccordionPanel>
        </AccordionItem>
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
          <Center mb="6">
            <Button
              colorScheme={isMember ? 'gray' : 'green'}
              onClick={this.openModal}
            >
              {isMember ? 'Leave process' : 'Join process'}
            </Button>
          </Center>
        )}

        {process?.members && (
          <Box mb="8">
            <Heading mb="2" size="sm">
              Members
            </Heading>
            <Box mb="4" bg="white">
              <NiceList
                actionsDisabled={!isAdmin}
                keySelector="username"
                list={membersList}
                spacing="0"
              >
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
          </Box>
        )}

        <Heading mb="2" size="sm">
          Documents
        </Heading>
        {process && process.documents && process.documents.length > 0 ? (
          <NiceList
            actionsDisabled={!isAdmin}
            keySelector="downloadUrl"
            list={documentsList}
          >
            {(document) => (
              <div style={{ width: '100%' }}>
                <a href={document.downloadUrl} target="_blank">
                  {document.name}
                </a>
              </div>
            )}
          </NiceList>
        ) : (
          <Text size="small" pad="2" margin={{ bottom: 'small' }}>
            <em>No document assigned</em>
          </Text>
        )}

        {isAdmin && (
          <Center p="2">
            <ReactDropzone onDrop={this.handleFileDrop} multiple={false}>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <Box
                  bg="white"
                  cursor="grab"
                  h="180px"
                  p="4"
                  w="240px"
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
          </Center>
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
            <Tabs variant="enclosed">
              <TabList pl="4">
                <Tab>Info</Tab>
                <Tab>Discussion</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box>
                    <Image src={process.imageUrl} fit="contain" fill />
                  </Box>
                  <Box pt="4">
                    <div className="text-content">
                      {renderHTML(process.description)}
                    </div>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <div>{chatData && this.renderDiscussion()}</div>
                </TabPanel>
              </TabPanels>
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
      <Box p="4">
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
              <Box p="4">{this.renderMembersAndDocuments()}</Box>
            </Visible>
          }
          rightContent={
            <Box p="2">
              <Heading size="sm">Dates</Heading>

              <Text fontSize="sm" mb="4">
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

              <Accordion allowToggle>
                {process.meetings && isAdmin
                  ? this.renderDates()
                  : this.renderMeetings()}
              </Accordion>

              {isAdmin && (
                <div>
                  <CreateMeetingForm
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
          <Box bg="white" mb="4">
            {this.renderProcessInfo()}
          </Box>
          <Visible xs sm md>
            <Box p="4">{this.renderMembersAndDocuments()}</Box>
          </Visible>
          {isAdmin && (
            <Center p="4" mb="6">
              <Link to={`/edit-process/${process._id}`}>
                <Button as="span" variant="ghost">
                  Edit
                </Button>
              </Link>
            </Center>
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

        {process && process.isPrivate && (
          <Drawer
            title="Manage Access"
            isOpen={inviteManagerOpen}
            onClose={this.handleCloseInviteManager}
          >
            <InviteManager process={process} />
          </Drawer>
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

function CreateMeetingForm({
  handleDateChange,
  handleStartTimeChange,
  handleFinishTimeChange,
  resources,
  handlePlaceChange,
  handleSubmit,
  buttonDisabled,
}) {
  const [isLocal, setIsLocal] = useState(true);

  return (
    <Box p="2" bg="white" my="2">
      <Heading ml="2" mt="2" size="xs">
        Add a Meeting
      </Heading>
      <Box py="4">
        <DatePicker noTime onChange={handleDateChange} />
      </Box>
      <HStack spacing="2" mb="6">
        <DatePicker
          onlyTime
          placeholder="Start time"
          onChange={handleStartTimeChange}
        />
        <DatePicker
          onlyTime
          placeholder="Finish time"
          onChange={handleFinishTimeChange}
        />
      </HStack>

      <FormControl alignItems="center" display="flex" mb="2" ml="2" mt="4">
        <Switch
          id="is-local-switch"
          isChecked={isLocal}
          onChange={({ target: { checked } }) => setIsLocal(checked)}
        />
        <FormLabel htmlFor="is-local-switch" mb="1" ml="2">
          {`At ${publicSettings.name}?`}
        </FormLabel>
      </FormControl>

      {isLocal ? (
        <Select
          size="sm"
          placeholder="Select resource"
          name="resource"
          onChange={({ target: { value } }) => handlePlaceChange(value)}
        >
          {resources.map((part, i) => (
            <option key={part.label}>{part.label}</option>
          ))}
        </Select>
      ) : (
        <Textarea
          placeholder="Location"
          size="sm"
          onChange={(event) => handlePlaceChange(event.target.value)}
        />
      )}

      <Flex justify="flex-end" my="4">
        <Button
          colorScheme="green"
          disabled={buttonDisabled}
          size="sm"
          onClick={handleSubmit}
        >
          Add Meeting
        </Button>
      </Flex>
    </Box>
  );
}

export default Process;
