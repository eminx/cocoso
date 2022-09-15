import { Meteor } from 'meteor/meteor';
import React, { Component, useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import moment from 'moment';
import i18n from 'i18next';
import ReactDropzone from 'react-dropzone';
import renderHTML from 'react-render-html';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

import DatePicker from '../../components/DatePicker';
import { ConflictMarker } from '../../components/DatesAndTimes';

import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Image,
  Link as CLink,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
  Switch,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tooltip,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { ChevronDownIcon, LockIcon } from '@chakra-ui/icons';

import InviteManager from './InviteManager';
import Drawer from '../../components/Drawer.jsx';
import Chattery from '../../components/chattery/Chattery.jsx';
import Loader from '../../components/Loader';
import FancyDate from '../../components/FancyDate';
import NiceList from '../../components/NiceList';
import Template from '../../components/Template';
import Breadcrumb from '../../components/Breadcrumb';
import ConfirmModal from '../../components/ConfirmModal';
import { Alert, message } from '../../components/message';
import Tably from '../../components/Tably';
import {
  call,
  checkAndSetBookingsWithConflict,
  getAllBookingsWithSelectedResource,
  parseAllBookingsWithResources,
} from '../../utils/shared';

moment.locale(i18n.language);

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
    resources: [],
    conflictingBooking: null,
  };

  componentDidMount() {
    this.getResources();
  }

  getResources = async () => {
    try {
      const resources = await call('getResources');
      this.setState({ resources });
    } catch (error) {
      message.error(error.error || error.reason);
    }
  };

  isMember = () => {
    const { currentUser, process } = this.props;
    if (!currentUser || !process) {
      return false;
    }

    const isMember = process.members.some((member) => member.memberId === currentUser._id);

    return Boolean(isMember);
  };

  isAdmin = () => {
    const { currentUser, process } = this.props;
    if (!currentUser || !process) {
      return false;
    }

    const isAdmin =
      process &&
      process.members.some((member) => member.memberId === currentUser._id && member.isAdmin);

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

  addNewChatMessage = async (messageContent) => {
    const { process } = this.props;
    const values = {
      context: 'processes',
      contextId: process._id,
      message: messageContent,
    };

    try {
      await call('addChatMessage', values);
    } catch (error) {
      console.log('error', error);
    }
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

  archiveProcess = () => {
    const { process, t } = this.props;
    const processId = process._id;

    Meteor.call('archiveProcess', processId, (error, respond) => {
      if (error) {
        message.error(error.error);
      } else {
        message.success(t('message.archived'));
      }
    });
  };

  unarchiveProcess = () => {
    const { process, t } = this.props;
    const processId = process._id;

    Meteor.call('unarchiveProcess', processId, (error, respond) => {
      if (error) {
        message.error(error.reason);
      } else {
        message.success(t('message.unarchived'));
      }
    });
  };

  getTitle = (process, isAdmin) => {
    const { t } = this.props;

    const isArchived = process.isArchived;

    return (
      <Flex>
        <Box flexGrow={1} mb="2" p="4">
          <Heading mb="2" size="lg" style={{ overflowWrap: 'anywhere', lineBreak: 'anywhere' }}>
            {process.title}
            {process.isPrivate && (
              <Badge ml="2" mb="3">
                <Tooltip label={t('private.info')}>
                  <Text fontSize="sm">{t('private.title')}</Text>
                </Tooltip>
              </Badge>
            )}
            {process.isArchived && (
              <Badge ml="2" mb="3">
                <Text fontSize="sm">{t('labels.archived')}</Text>
              </Badge>
            )}
          </Heading>
          <Text fontWeight="light">{process.readingMaterial}</Text>
        </Box>

        <Flex p="4" direction="column">
          <Center alignSelf="end">
            <Link to={`/@${process.authorUsername}`}>
              <Flex direction="column" align="center">
                <Avatar name={process.authorUsername} src={process.authorAvatar} />
                <CLink as="span" fontSize="sm" textAlign="center">
                  {process.authorUsername}
                </CLink>
              </Flex>
            </Link>
          </Center>
        </Flex>

        {isAdmin && (
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<ChevronDownIcon />}
              variant="ghost"
            />
            <MenuList>
              {process.isPrivate && isAdmin && (
                <MenuItem onClick={this.handleOpenInviteManager}>{t('labels.invite')}</MenuItem>
              )}
              <MenuItem onClick={isArchived ? this.unarchiveProcess : this.archiveProcess}>
                {isArchived ? t('actions.unarchive') : t('actions.archive')}
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
    );
  };

  joinProcess = () => {
    const { process, currentUser, t } = this.props;
    this.closeModal();

    if (!process || !currentUser) {
      return;
    }

    const alreadyMember = process.members.some((m) => m.memberId === currentUser._id);

    if (alreadyMember) {
      message.error(t('message.joined'));
      return;
    }

    Meteor.call('joinProcess', process._id, (error, response) => {
      if (error) {
        message.error(error.error);
      } else {
        message.success(t('message.added'));
      }
    });
  };

  leaveProcess = () => {
    const { process, t } = this.props;

    this.closeModal();

    Meteor.call('leaveProcess', process._id, (error, response) => {
      if (error) {
        message.error(error.error);
      } else {
        message.info(t('message.removed'));
      }
    });
  };

  removeNotification = (messageIndex) => {
    const { process, currentUser } = this.props;
    const shouldRun = currentUser.notifications?.find((notification) => {
      if (!notification.unSeenIndexes) {
        return false;
      }
      return notification.unSeenIndexes.some((unSeenIndex) => unSeenIndex === messageIndex);
    });
    if (!shouldRun) {
      return;
    }

    Meteor.call('removeNotification', process._id, messageIndex, (error, respond) => {
      if (error) {
        console.log('error', error);
        message.error(error.error);
      }
    });
  };

  handleDateAndTimeChange = (dateOrTime, entity) => {
    const { newMeeting } = this.state;
    const newerMeeting = { ...newMeeting };
    newerMeeting[entity] = dateOrTime;

    this.setState(
      {
        newMeeting: newerMeeting,
      },
      () => {
        this.validateBookings();
      }
    );
  };

  handleResourceChange = (resourceLabel) => {
    const { newMeeting, resources } = this.state;
    const selectedResource = resources.find((r) => r.label === resourceLabel);
    this.setState(
      {
        newMeeting: {
          ...newMeeting,
          resource: resourceLabel,
          resourceId: selectedResource._id,
          resourceIndex: selectedResource.resourceIndex,
        },
      },
      () => {
        this.validateBookings();
      }
    );
  };

  createActivity = async () => {
    const { newMeeting, isFormValid } = this.state;
    const { process, tc } = this.props;

    if (!isFormValid) {
      return;
    }

    const activityValues = {
      title: process.title,
      subTitle: process.readingMaterial,
      longDescription: process.description,
      imageUrl: process.imageUrl,
      resource: newMeeting.resource,
      resourceId: newMeeting.resourceId,
      resourceIndex: newMeeting.resourceIndex,
      datesAndTimes: [
        {
          startDate: newMeeting.startDate,
          endDate: newMeeting.startDate,
          startTime: newMeeting.startTime,
          endTime: newMeeting.endTime,
          attendees: [],
          capacity: process.capacity,
        },
      ],
      isPublicActivity: false,
      isRegistrationDisabled: false,
      isProcessMeeting: true,
      isProcessPrivate: process.isPrivate,
      processId: process._id,
    };

    try {
      await call('createActivity', activityValues);
      message.success(
        tc('message.success.create', {
          domain: `${tc('domains.your')} ${tc('domains.activity').toLowerCase()}`,
        })
      );
    } catch (error) {
      message.error(error.reason);
    }
  };

  toggleAttendance = (activityId, meetingIndex) => {
    const { processMeetings, currentUser, t } = this.props;

    if (!currentUser) {
      message.error(t('meeting.access.logged'));
      return;
    }
    if (!this.isMember()) {
      message.error(t('meeting.access.join'));
      return;
    }

    const isAttending = processMeetings[meetingIndex].attendees
      .map((attendee) => attendee.username)
      .includes(currentUser.username);

    const meetingAttendence = {
      email: currentUser.emails[0].address,
      username: currentUser.username,
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || '',
      numberOfPeople: 1,
    };

    if (isAttending) {
      const attendeeIndex = processMeetings[meetingIndex].attendees.findIndex(
        (attendee) => attendee.username === currentUser.username
      );
      Meteor.call('removeAttendance', activityId, 0, attendeeIndex, (error, respond) => {
        if (error) {
          console.log('error', error);
          message.error(error.error);
        } else {
          message.success(t('meeting.attends.remove'));
        }
      });
    } else {
      Meteor.call('registerAttendance', activityId, meetingAttendence, (error, respond) => {
        if (error) {
          console.log('error', error);
          message.error(error.error);
        } else {
          message.success(t('meeting.attends.register'));
        }
      });
    }
  };

  deleteActivity = (activityId, meetingIndex) => {
    const { process, processMeetings, t } = this.props;
    if (!process || !processMeetings) {
      return;
    }

    if (processMeetings[meetingIndex].attendees.length > 0) {
      message.error(t('meeting.access.remove'));
      return;
    }

    Meteor.call('deleteActivity', activityId, (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.error);
      } else {
        message.success(t('meeting.success.remove'));
      }
    });
  };

  renderDates = () => {
    const { process, processMeetings, t } = this.props;
    const { conflictingBooking, isFormValid, resources } = this.state;

    if (!process) {
      return;
    }

    const isFutureMeeting = (meeting) => moment(meeting.endDate).isAfter(yesterday);

    return (
      <Box>
        {process &&
          processMeetings.map((meeting, meetingIndex) => (
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
                      <ListItem key={attendee.username}>
                        <Text as="span" fontWeight="bold">
                          {attendee.username}
                        </Text>
                        <Text as="span"> ({attendee.firstName + ' ' + attendee.lastName})</Text>
                      </ListItem>
                    ))}
                  </List>
                )}
                <Center py="2" mt="2">
                  <Button
                    size="xs"
                    colorScheme="red"
                    onClick={() => this.deleteActivity(meeting._id, meetingIndex)}
                  >
                    {t('meeting.actions.remove')}
                  </Button>
                </Center>
              </AccordionPanel>
            </AccordionItem>
          ))}
        <CreateMeetingForm
          handleDateChange={(date) => this.handleDateAndTimeChange(date, 'startDate')}
          handleStartTimeChange={(time) => this.handleDateAndTimeChange(time, 'startTime')}
          handleFinishTimeChange={(time) => this.handleDateAndTimeChange(time, 'endTime')}
          resources={resources}
          handleResourceChange={this.handleResourceChange}
          handleSubmit={this.createActivity}
          buttonDisabled={!isFormValid}
          conflictingBooking={conflictingBooking}
        />
      </Box>
    );
  };

  renderMeetings = () => {
    const { process, processMeetings, currentUser, t } = this.props;
    const { resources } = this.state;
    if (!process || !processMeetings) {
      return;
    }

    const isFutureMeeting = (meeting) => moment(meeting.endDate).isAfter(yesterday);

    return processMeetings.map((meeting, meetingIndex) => {
      const isAttending =
        currentUser &&
        meeting.attendees &&
        meeting.attendees.map((attendee) => attendee.username).includes(currentUser.username);

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
                onClick={() => this.toggleAttendance(meeting._id, meetingIndex)}
              >
                {isAttending ? t('meeting.isAttending.false') : t('meeting.isAttending.true')}
              </Button>
            </Center>
          </AccordionPanel>
        </AccordionItem>
      );
    });
  };

  handleFileDrop = (files) => {
    const { process, t, tc } = this.props;

    if (files.length !== 1) {
      message.error(tc('plugins.fileDropper.single'));
      return;
    }
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
                      message.success(`${uploadableFile.name} ${tc('documents.fileDropper')}`);
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

  setAsAProcessAdmin = () => {
    const { process, t } = this.props;
    const { potentialNewAdmin } = this.state;

    const closeModal = () => this.setState({ potentialNewAdmin: false });
    Meteor.call('setAsAProcessAdmin', process._id, potentialNewAdmin, (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.error);
        closeModal();
      } else {
        message.success(t('meeting.success.admin'));
        closeModal();
      }
    });
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

  renderMembers = () => {
    const { process, t } = this.props;

    const isMember = this.isMember();
    const isAdmin = this.isAdmin();

    const membersList =
      process &&
      process.members &&
      process.members.map((member) => ({
        ...member,
        actions: [
          {
            content: t('meeting.actions.makeAdmin'),
            handleClick: () =>
              this.setState({
                potentialNewAdmin: member.username,
              }),
            isDisabled: member.isAdmin,
          },
        ],
      }));

    return (
      <Box>
        {!isAdmin && (
          <Center mb="6">
            <Button colorScheme={isMember ? 'gray' : 'green'} onClick={this.openModal}>
              {isMember ? t('actions.leave') : t('actions.join')}
            </Button>
          </Center>
        )}

        {process?.members && (
          <Box mb="8">
            <Box mb="4" bg="white">
              <NiceList
                actionsDisabled={!isAdmin}
                keySelector="username"
                list={membersList}
                spacing="0"
              >
                {(member) => (
                  <Link to={`/@${member.username}`}>
                    <Flex align="center">
                      <Avatar mr="2" name={member.username} size="sm" src={member.avatar} />
                      <CLink as="span" fontWeight={member.isAdmin ? 700 : 400}>
                        {member.username}
                      </CLink>
                      <Text fontSize="sm" ml="1">
                        {member.isAdmin && '(admin)'}
                      </Text>
                    </Flex>
                  </Link>
                )}
              </NiceList>
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  renderDocuments = () => {
    const { process, tc } = this.props;
    const { isUploading } = this.state;
    const isAdmin = this.isAdmin();

    const documentsList =
      process &&
      process.documents &&
      process.documents.map((document) => ({
        ...document,
        actions: [
          {
            content: tc('labels.remove'),
            handleClick: () => this.removeProcessDocument(document.name),
          },
        ],
      }));

    return (
      <Box>
        {process && process.documents && process.documents.length > 0 ? (
          <NiceList actionsDisabled={!isAdmin} keySelector="downloadUrl" list={documentsList}>
            {(document) => (
              <div style={{ width: '100%' }}>
                <a href={document.downloadUrl} target="_blank" rel="noreferrer">
                  {document.name}
                </a>
              </div>
            )}
          </NiceList>
        ) : (
          <Text size="small" pad="2" margin={{ bottom: 'small' }}>
            <em>{tc('documents.empty')}</em>
          </Text>
        )}

        {isAdmin && (
          <Center p="2">
            <ReactDropzone onDrop={this.handleFileDrop} multiple={false}>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <Box bg="white" cursor="grab" h="180px" p="4" w="240px" {...getRootProps()}>
                  {isUploading ? (
                    <div style={{ textAlign: 'center' }}>
                      <Loader />
                      {tc('documents.up')}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <b>{tc('documents.drop')}</b>
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
    const { t } = this.props;
    if (!this.isAdmin()) {
      return;
    }

    Meteor.call('removeProcessDocument', documentName, this.props.process._id, (error, respond) => {
      if (error) {
        console.log('error', error);
        message.error(error.error);
      } else {
        message.success(tc('documents.remove'));
      }
    });
  };

  renderProcessInfo = () => {
    const { process, chatData, currentUser, t } = this.props;
    const notificationCount = currentUser?.notifications?.find((n) => n.contextId === process._id)
      ?.unSeenIndexes?.length;

    return (
      <div>
        <Tabs variant="enclosed-colored">
          <TabList pl="4">
            <Tab>{t('tabs.process.info')}</Tab>
            <Tab>
              {t('tabs.process.discuss')}{' '}
              {notificationCount && <Badge colorScheme="red">{notificationCount}</Badge>}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Center bg="gray.900">
                <Image src={process.imageUrl} fit="contain" fill />
              </Center>
              <Box pt="4">
                <div className="text-content">{renderHTML(process.description)}</div>
              </Box>
            </TabPanel>
            <TabPanel>
              <div>{chatData && this.renderDiscussion()}</div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    );
  };

  renderDiscussion = () => {
    const { t } = this.props;
    const messages = this.getChatMessages();
    const isMember = this.isMember();

    return (
      <Box p="4">
        <Box bg="light-2">
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
            <Button colorScheme={isMember ? 'gray' : 'green'} onClick={this.openModal}>
              {isMember ? t('actions.leave') : t('actions.join')}
            </Button>
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

  isNoAccess = () => !this.isMember() && !this.isAdmin() && !this.isInvited();

  validateBookings = () => {
    const { allActivities } = this.props;
    const { newMeeting, resources } = this.state;

    if (
      !newMeeting ||
      !newMeeting.resourceId ||
      !newMeeting.startDate ||
      !newMeeting.startTime ||
      !newMeeting.endTime
    ) {
      this.setState({
        conflictingBooking: null,
        isFormValid: false,
      });
      return;
    }

    const selectedResource = resources.find((r) => r._id === newMeeting.resourceId);

    const allBookingsParsed = parseAllBookingsWithResources(allActivities, resources);

    const allBookingsWithSelectedResource = getAllBookingsWithSelectedResource(
      selectedResource,
      allBookingsParsed
    );

    const selectedBookingsWithConflict = checkAndSetBookingsWithConflict(
      [
        {
          startDate: newMeeting.startDate,
          endDate: newMeeting.startDate,
          startTime: newMeeting.startTime,
          endTime: newMeeting.endTime,
        },
      ],
      allBookingsWithSelectedResource
    );

    if (
      selectedBookingsWithConflict &&
      selectedBookingsWithConflict[0] &&
      selectedBookingsWithConflict[0].conflict
    ) {
      this.setState({
        conflictingBooking: selectedBookingsWithConflict && selectedBookingsWithConflict[0],
        isFormValid: false,
      });
    } else {
      this.setState({
        conflictingBooking: null,
        isFormValid: true,
      });
    }
  };

  render() {
    const { process, processMeetings, isLoading, history, t, tc, currentUser } = this.props;
    const { resources } = this.state;

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
      conflictingBooking,
    } = this.state;

    if (redirectToLogin) {
      return <Redirect to="/login" />;
    }

    const isMember = this.isMember();
    const isAdmin = this.isAdmin();

    if (process && process.isPrivate && this.isNoAccess()) {
      return <Alert message={tc('message.access.deny')} />;
    }

    const tabs = [
      {
        title: 'Info',
        content: <div className="text-content">{renderHTML(process.description)}</div>,
        path: `/processes/${process._id}/info`,
      },
      {
        title: t('labels.member'),
        content: this.renderMembers(),
        path: `/processes/${process._id}/members`,
      },
      {
        title: tc('documents.label'),
        content: this.renderDocuments(),
        path: `/processes/${process._id}/documents`,
      },
      {
        title: t('labels.date'),
        content: (
          <Accordion allowToggle>
            {processMeetings && isAdmin ? this.renderDates() : this.renderMeetings()}
          </Accordion>
        ),
        path: `/processes/${process._id}/meetings`,
      },
      {
        title: 'Discussion',
        content: this.renderDiscussion(),
        path: `/processes/${process._id}/discussion`,
      },
    ];

    return (
      <Tably
        images={[process.imageUrl]}
        subTitle={process.readingMaterial}
        tabs={tabs}
        title={process.title}
      />
    );

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
              <Heading size="sm">{t('labels.date')}</Heading>

              <Text fontSize="sm" mb="4">
                <em>
                  {processMeetings &&
                  processMeetings.filter((meeting) => moment(meeting.endDate).isAfter(yesterday))
                    .length > 0
                    ? isAdmin
                      ? t('meeting.info.admin')
                      : t('meeting.info.member')
                    : t('meeting.info.empty')}
                </em>
              </Text>

              <Accordion allowToggle>
                {processMeetings && isAdmin ? this.renderDates() : this.renderMeetings()}
              </Accordion>

              {isAdmin && (
                <div>
                  <CreateMeetingForm
                    handleDateChange={(date) => this.handleDateAndTimeChange(date, 'startDate')}
                    handleStartTimeChange={(time) =>
                      this.handleDateAndTimeChange(time, 'startTime')
                    }
                    handleFinishTimeChange={(time) => this.handleDateAndTimeChange(time, 'endTime')}
                    resources={resources}
                    handleResourceChange={this.handleResourceChange}
                    handleSubmit={this.createActivity}
                    buttonDisabled={!isFormValid}
                    conflictingBooking={conflictingBooking}
                  />
                </div>
              )}
            </Box>
          }
        >
          <Breadcrumb context={process} contextKey="title" />
          <Box bg="white" mb="4">
            {this.renderProcessInfo()}
          </Box>
          <Visible xs sm md>
            <Box p="4">{this.renderMembersAndDocuments()}</Box>
          </Visible>
          {isAdmin && (
            <Center p="4" mb="6">
              <Link to={`/processes/${process._id}/edit`}>
                <Button as="span" variant="ghost">
                  {tc('actions.update')}
                </Button>
              </Link>
            </Center>
          )}
        </Template>

        <Helmet>
          <title>{process.title}</title>
        </Helmet>

        <ConfirmModal
          visible={modalOpen}
          title={t('confirm.title.text', {
            opt: isMember ? t('confirm.title.opts.leave') : t('confirm.title.opts.join'),
          })}
          onConfirm={isMember ? this.leaveProcess : this.joinProcess}
          onCancel={this.closeModal}
        >
          <Text>
            {t('confirm.body.text', {
              opt: isMember ? t('confirm.body.opts.leave') : t('confirm.body.opts.join'),
            })}
          </Text>
        </ConfirmModal>
        <ConfirmModal
          visible={Boolean(potentialNewAdmin)}
          title={t('confirm.check')}
          onConfirm={this.setAsAProcessAdmin}
          onCancel={() => this.setState({ potentialNewAdmin: null })}
        >
          <Text>
            <b>{t('confirm.admin.title', { admin: potentialNewAdmin })}</b>
          </Text>
          <Text>{t('confirm.admin.body', { admin: potentialNewAdmin })}</Text>
        </ConfirmModal>

        {process && process.isPrivate && (
          <Drawer
            title={t('labels.invite')}
            isOpen={inviteManagerOpen}
            onClose={this.handleCloseInviteManager}
          >
            <InviteManager process={process} t={t} />
          </Drawer>
        )}
      </div>
    );
  }
}

function MeetingInfo({ meeting, isAttending, resources }) {
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
}

function CreateMeetingForm({
  buttonDisabled,
  conflictingBooking,
  handleDateChange,
  handleStartTimeChange,
  handleFinishTimeChange,
  handleResourceChange,
  handleSubmit,
  resources,
}) {
  const [isLocal, setIsLocal] = useState(true);
  const [t] = useTranslation('processes');
  const [ta] = useTranslation('activities');

  return (
    <Box p="2" bg="white" my="2">
      <Heading ml="2" mt="2" size="xs">
        {t('meeting.form.label')}
      </Heading>
      <Box py="4">
        <DatePicker noTime onChange={handleDateChange} />
      </Box>
      <HStack spacing="2" mb="6">
        <DatePicker
          onlyTime
          placeholder={t('meeting.form.time.start')}
          onChange={handleStartTimeChange}
        />
        <DatePicker
          onlyTime
          placeholder={t('meeting.form.time.end')}
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
          {t('meeting.form.switch', { place: publicSettings.name })}
        </FormLabel>
      </FormControl>

      {isLocal ? (
        <Select
          size="sm"
          placeholder={t('meeting.form.resource')}
          name="resource"
          onChange={({ target: { value } }) => handleResourceChange(value)}
        >
          {resources.map((part, i) => (
            <option key={part.label}>{part.label}</option>
          ))}
        </Select>
      ) : (
        <Textarea
          placeholder={t('meeting.form.location')}
          size="sm"
          onChange={(event) => handleResourceChange(event.target.value)}
        />
      )}

      <Flex justify="flex-end" my="4">
        <Button colorScheme="green" disabled={buttonDisabled} size="sm" onClick={handleSubmit}>
          {t('meeting.form.submit')}
        </Button>
      </Flex>

      {conflictingBooking && <ConflictMarker recurrence={conflictingBooking} t={ta} />}
    </Box>
  );
}

export default Process;
