import { Meteor } from 'meteor/meteor';
import React, { Component, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import moment from 'moment';
import i18n from 'i18next';
import ReactDropzone from 'react-dropzone';
import renderHTML from 'react-render-html';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Center,
  Code,
  Flex,
  Link as CLink,
  List,
  ListItem,
  Select,
  Text,
  Textarea,
} from '@chakra-ui/react';

import DateTimePicker from '../../components/DateTimePicker.jsx';
import { ConflictMarker } from '../../components/DatesAndTimes.jsx';
import InviteManager from './InviteManager.jsx';
import Drawer from '../../components/Drawer.jsx';
import Chattery from '../../components/chattery/Chattery.jsx';
import Loader from '../../components/Loader.jsx';
import FancyDate, { DateJust } from '../../components/FancyDate.jsx';
import NiceList from '../../components/NiceList.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { Alert, message } from '../../components/message.jsx';
import TablyCentered from '../../components/TablyCentered.jsx';
import {
  call,
  checkAndSetBookingsWithConflict,
  getAllBookingsWithSelectedResource,
  parseAllBookingsWithResources,
} from '../../utils/shared.js';
import { StateContext } from '../../LayoutContainer.jsx';
import { DocumentUploadHelper } from '../../components/UploadHelpers.jsx';
import { MainLoader } from '../../components/SkeletonLoaders.jsx';

moment.locale(i18n.language);

const yesterday = moment(new Date()).add(-1, 'days');

const today = new Date().toISOString().substring(0, 10);
const emptyDateAndTime = {
  startDate: today,
  endDate: today,
  startTime: '00:00',
  endTime: '23:59',
  attendees: [],
  capacity: 40,
  isRange: false,
  conflict: null,
};

class Group extends Component {
  state = {
    modalOpen: false,
    redirectToLogin: false,
    newMeeting: emptyDateAndTime,
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
    const { currentUser, group } = this.props;
    if (!currentUser || !group) {
      return false;
    }

    const isMember = group.members.some((member) => member.memberId === currentUser._id);

    return Boolean(isMember);
  };

  isAdmin = () => {
    const { currentUser, group } = this.props;
    if (!currentUser || !group) {
      return false;
    }

    const isAdmin =
      group &&
      group.members.some((member) => member.memberId === currentUser._id && member.isAdmin);

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
    const { group } = this.props;
    const values = {
      context: 'groups',
      contextId: group._id,
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

  archiveGroup = () => {
    const { group, t } = this.props;
    const groupId = group._id;

    Meteor.call('archiveGroup', groupId, (error, respond) => {
      if (error) {
        message.error(error.error);
      } else {
        message.success(t('message.archived'));
      }
    });
  };

  unarchiveGroup = () => {
    const { group, t } = this.props;
    const groupId = group._id;

    Meteor.call('unarchiveGroup', groupId, (error, respond) => {
      if (error) {
        message.error(error.reason);
      } else {
        message.success(t('message.unarchived'));
      }
    });
  };

  joinGroup = () => {
    const { group, currentUser, t } = this.props;
    this.closeModal();

    if (!group || !currentUser) {
      return;
    }

    const alreadyMember = group.members.some((m) => m.memberId === currentUser._id);

    if (alreadyMember) {
      message.error(t('message.joined'));
      return;
    }

    Meteor.call('joinGroup', group._id, (error, response) => {
      if (error) {
        message.error(error.reason);
      } else {
        message.success(t('message.added'));
      }
    });
  };

  leaveGroup = () => {
    const { group, t } = this.props;

    this.closeModal();

    Meteor.call('leaveGroup', group._id, (error, response) => {
      if (error) {
        message.error(error.error);
      } else {
        message.info(t('message.removed'));
      }
    });
  };

  removeNotification = (messageIndex) => {
    const { group, currentUser } = this.props;
    const shouldRun = currentUser?.notifications?.find((notification) => {
      if (!notification.unSeenIndexes) {
        return false;
      }
      return notification.unSeenIndexes.some((unSeenIndex) => unSeenIndex === messageIndex);
    });
    if (!shouldRun) {
      return;
    }

    Meteor.call('removeNotification', group._id, messageIndex, (error, respond) => {
      if (error) {
        console.log('error', error);
        message.error(error.error);
      }
    });
  };

  handleDateAndTimeChange = (date) => {
    this.setState(
      {
        newMeeting: date,
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
    const { group, tc } = this.props;

    if (!isFormValid) {
      return;
    }

    const activityValues = {
      title: group.title,
      subTitle: group.readingMaterial,
      longDescription: group.description,
      images: [group.imageUrl],
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
          capacity: group.capacity,
        },
      ],
      isPublicActivity: false,
      isRegistrationDisabled: false,
      isGroupMeeting: true,
      isGroupPrivate: group.isPrivate,
      groupId: group._id,
    };

    try {
      await call('createActivity', activityValues);
      message.success(tc('message.success.create'));
    } catch (error) {
      message.error(error.reason);
    }
  };

  toggleAttendance = (activityId, meetingIndex) => {
    const { groupMeetings, currentUser, t } = this.props;

    if (!currentUser) {
      message.error(t('meeting.access.logged'));
      return;
    }
    if (!this.isMember()) {
      message.error(t('meeting.access.join'));
      return;
    }

    const isAttending = groupMeetings[meetingIndex].attendees
      .map((attendee) => attendee.username)
      .includes(currentUser.username);

    const meetingAttendee = {
      email: currentUser.emails[0].address,
      username: currentUser.username,
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || '',
      numberOfPeople: 1,
    };

    if (isAttending) {
      Meteor.call(
        'removeAttendance',
        activityId,
        0,
        meetingAttendee.email,
        meetingAttendee.lastName,
        (error, respond) => {
          if (error) {
            console.log('error', error);
            message.error(error.error);
          } else {
            message.success(t('meeting.attends.remove'));
          }
        }
      );
    } else {
      Meteor.call('registerAttendance', activityId, meetingAttendee, (error, respond) => {
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
    const { group, groupMeetings, t } = this.props;
    if (!group || !groupMeetings) {
      return;
    }

    if (groupMeetings[meetingIndex].attendees.length > 0) {
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
    const { group, groupMeetings, t } = this.props;
    const { resources } = this.state;

    if (!group) {
      return;
    }

    const isFutureMeeting = (meeting) => moment(meeting.endDate).isAfter(yesterday);

    return (
      <Box>
        {group &&
          groupMeetings.map((meeting, meetingIndex) => (
            <AccordionItem
              key={`${meeting.startTime} ${meeting.endTime} ${meetingIndex}`}
              mb="4"
              style={{
                display: isFutureMeeting(meeting) ? 'block' : 'none',
              }}
            >
              <AccordionButton
                _hover={{ bg: 'brand.50' }}
                _expanded={{ bg: 'brand.500', color: 'white' }}
                bg="white"
                border="1px solid"
                borderColor="brand.500"
                color="brand.800"
              >
                <Box flex="1" textAlign="left">
                  <FancyDate occurence={meeting} resources={resources} />
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel bg="brand.50" border="1px solid" borderColor="brand.500">
                <Text fontWeight="bold">{t('labels.attendees')}</Text>
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
      </Box>
    );
  };

  renderMeetings = () => {
    const { group, groupMeetings, currentUser, t } = this.props;
    const { resources } = this.state;
    if (!group || !groupMeetings) {
      return;
    }

    const isFutureMeeting = (meeting) => moment(meeting.endDate).isAfter(yesterday);

    return groupMeetings.map((meeting, meetingIndex) => {
      const isAttending =
        currentUser &&
        meeting.attendees &&
        meeting.attendees.map((attendee) => attendee.username).includes(currentUser.username);

      return (
        <AccordionItem
          key={`${meeting.startTime} ${meeting.endTime} ${meetingIndex}`}
          mb="2"
          style={{
            display: isFutureMeeting(meeting) ? 'block' : 'none',
          }}
        >
          <AccordionButton
            _hover={{ bg: 'brand.50' }}
            _expanded={{ bg: 'brand.500', color: 'white' }}
            bg="white"
            border="1px solid"
            borderColor="brand.500"
            color="brand.800"
          >
            <Box flex="1" textAlign="left">
              <MeetingInfo isAttending={isAttending} meeting={meeting} resources={resources} />
            </Box>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel bg="brand.100">
            <Center p="2">
              <Button
                size="sm"
                colorScheme={isAttending ? 'green' : 'brand'}
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
    const { group, t, tc } = this.props;

    if (files.length !== 1) {
      message.error(tc('plugins.fileDropper.single'));
      return;
    }
    this.setState({ isUploading: true });

    const closeLoader = () => this.setState({ isUploading: false });

    const upload = new Slingshot.Upload('groupDocumentUpload');
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
            'group',
            group._id,
            (error, respond) => {
              if (error) {
                message.error(error);
                console.log(error);
                closeLoader();
              } else {
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

  setAsAGroupAdmin = () => {
    const { group, t } = this.props;
    const { potentialNewAdmin } = this.state;

    const closeModal = () => this.setState({ potentialNewAdmin: false });
    Meteor.call('setAsAGroupAdmin', group._id, potentialNewAdmin, (error, respond) => {
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
    const { group, t } = this.props;

    const isAdmin = this.isAdmin();
    const isMember = this.isMember();

    const membersList =
      group &&
      group.members &&
      group.members.map((member) => ({
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
        {group?.members && (
          <Box mb="8">
            <Box mb="4">
              <NiceList
                actionsDisabled={!isAdmin}
                keySelector="username"
                list={membersList}
                spacing="0"
              >
                {(member) => (
                  <Link to={`/@${member.username}`}>
                    <Flex align="center">
                      <Avatar
                        borderRadius="8px"
                        mr="2"
                        name={member.username}
                        size="md"
                        src={member.avatar}
                      />
                      <CLink as="span" fontWeight={member.isAdmin ? 700 : 400}>
                        {member.username}
                      </CLink>
                      <Text ml="1">{member.isAdmin && '(admin)'}</Text>
                    </Flex>
                  </Link>
                )}
              </NiceList>
            </Box>
          </Box>
        )}

        {!isAdmin && isMember && (
          <Center>
            <Button colorScheme="red" onClick={() => this.openModal()}>
              {t('actions.leave')}
            </Button>
          </Center>
        )}
      </Box>
    );
  };

  renderDocuments = () => {
    const { group, tc } = this.props;
    const { isUploading } = this.state;
    const isAdmin = this.isAdmin();

    const documentsList =
      group &&
      group.documents &&
      group.documents
        .map((document) => ({
          ...document,
          actions: [
            {
              content: tc('labels.remove'),
              handleClick: () => this.removeGroupDocument(document.name),
            },
          ],
        }))
        .reverse();

    return (
      <Box>
        {group && group.documents && group.documents.length > 0 ? (
          <NiceList actionsDisabled={!isAdmin} keySelector="downloadUrl" list={documentsList}>
            {(document) => (
              <Box style={{ width: '100%' }}>
                <Code bg="white" fontWeight="bold">
                  <CLink
                    color="blue.600"
                    href={document.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {document.name}
                  </CLink>
                </Code>
              </Box>
            )}
          </NiceList>
        ) : (
          <Text fontSize="sm" mb="4" textAlign="center">
            {tc('documents.empty')}
          </Text>
        )}

        {isAdmin && (
          <Box>
            <Center my="2">
              <ReactDropzone onDrop={this.handleFileDrop} multiple={false}>
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <Box
                    bg={isDragActive ? 'gray.300' : 'white'}
                    border="2px dashed"
                    borderColor="brand.500"
                    cursor="grab"
                    h="180px"
                    p="4"
                    w="100%"
                    {...getRootProps()}
                  >
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
            <DocumentUploadHelper />
          </Box>
        )}
      </Box>
    );
  };

  removeGroupDocument = (documentName) => {
    const { tc } = this.props;
    if (!this.isAdmin()) {
      return;
    }

    Meteor.call('removeGroupDocument', documentName, this.props.group._id, (error, respond) => {
      if (error) {
        console.log('error', error);
        message.error(error.error);
      } else {
        message.success(tc('documents.remove'));
      }
    });
  };

  renderDiscussion = () => {
    const { t } = this.props;
    const messages = this.getChatMessages();
    const isMember = this.isMember();

    return (
      <Box>
        <Box>
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
    const { group, currentUser } = this.props;

    if (!currentUser || !group) {
      return false;
    }

    const isInvited = group.peopleInvited.some(
      (person) => person.email === currentUser.emails[0].address
    );

    return Boolean(isInvited);
  };

  isNoAccess = () => !this.isMember() && !this.isAdmin() && !this.isInvited();

  validateBookings = () => {
    const { allActivities } = this.props;
    const { newMeeting, resources } = this.state;

    if (!newMeeting || !newMeeting.startDate || !newMeeting.startTime || !newMeeting.endTime) {
      this.setState({
        conflictingBooking: null,
        isFormValid: false,
      });
      return;
    }

    if (!newMeeting.resourceId) {
      this.setState({
        conflictingBooking: null,
        isFormValid: true,
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

  renderAction = () => {
    const { group, groupMeetings, t } = this.props;

    const isAdmin = this.isAdmin();
    const isMember = this.isMember();

    if (!isAdmin && !isMember) {
      return (
        <Center p="4" mt="2" bg="green.100">
          <Button colorScheme="green" onClick={this.openModal}>
            {t('actions.join')}
          </Button>
        </Center>
      );
    } else {
      const futureMeetings = groupMeetings?.filter((meeting) =>
        moment(meeting.endDate).isAfter(yesterday)
      );
      if (!futureMeetings || futureMeetings.length === 0) {
        return null;
      }

      const futureMeetingsSorted = futureMeetings.sort(
        (a, b) => moment(a.startDate) - moment(b.startDate)
      );

      return (
        <Flex pt="4">
          {futureMeetingsSorted.map((m) => (
            <Link key={m.startDate} to={`/groups/${group._id}/meetings`}>
              <Box pr="6" color="brand.700">
                <DateJust>{m.startDate}</DateJust>
              </Box>
            </Link>
          ))}
        </Flex>
      );
    }
  };

  render() {
    const { currentUser, group, groupMeetings, isLoading, t, tc } = this.props;
    const { currentHost } = this.context;

    if (!group || isLoading) {
      return <MainLoader />;
    }

    const {
      conflictingBooking,
      inviteManagerOpen,
      isFormValid,
      modalOpen,
      newMeeting,
      potentialNewAdmin,
      redirectToLogin,
      resources,
    } = this.state;

    if (!group) {
      return <Loader />;
    }

    if (redirectToLogin) {
      return <Navigate to="/login" />;
    }

    const isMember = this.isMember();
    const isAdmin = this.isAdmin();

    if (group && group.isPrivate && this.isNoAccess()) {
      return <Alert message={tc('message.access.deny')} />;
    }

    const notificationCount = currentUser?.notifications?.find((n) => n.contextId === group._id)
      ?.unSeenIndexes?.length;

    const isFutureMeetings =
      groupMeetings?.filter((meeting) => moment(meeting.endDate).isAfter(yesterday)).length > 0;

    const tabs = [
      {
        title: tc('labels.info'),
        content: (
          <Box bg="white" className="text-content" p="6">
            {group && renderHTML(group.description)}
          </Box>
        ),
        path: 'info',
      },
      {
        title: t('labels.member'),
        content: this.renderMembers(),
        path: 'members',
      },
      {
        title: tc('documents.label'),
        content: this.renderDocuments(),
        path: 'documents',
      },
      {
        title: t('labels.meetings'),
        content: (
          <Box>
            {!isFutureMeetings && (
              <Text fontSize="sm" mb="4" textAlign="center">
                {t('meeting.info.empty')}
              </Text>
            )}
            {isFutureMeetings && isAdmin && (
              <Text fontSize="sm" mb="4">
                {t('meeting.info.admin')}
              </Text>
            )}
            {isFutureMeetings && !isAdmin && isMember && (
              <Text fontSize="sm" mb="4">
                {t('meeting.info.member')}
              </Text>
            )}
            {isFutureMeetings && (
              <Accordion allowToggle>
                {groupMeetings && isAdmin ? this.renderDates() : this.renderMeetings()}
              </Accordion>
            )}
            {isAdmin && (
              <CreateMeetingForm
                buttonDisabled={!isFormValid}
                conflictingBooking={conflictingBooking}
                hostname={currentHost?.settings?.name}
                newMeeting={newMeeting}
                resources={resources.filter((r) => r.isBookable)}
                handleDateChange={(date) => this.handleDateAndTimeChange(date)}
                handleResourceChange={this.handleResourceChange}
                handleSubmit={this.createActivity}
              />
            )}
          </Box>
        ),
        path: 'meetings',
      },
      {
        title: t('tabs.group.discuss'),
        content: this.renderDiscussion(),
        path: 'discussion',
        badge: notificationCount,
      },
    ];

    const adminMenu = {
      label: tc('labels.admin.actions'),
      items: [
        {
          label: tc('actions.update'),
          link: 'edit',
        },
        {
          label: group?.isArchived ? t('actions.unarchive') : t('actions.archive'),
          onClick: group?.isArchived ? this.unarchiveGroup : this.archiveGroup,
        },
      ],
    };

    const isPrivate = group && group.isPrivate;

    if (isPrivate) {
      adminMenu.items.push({
        label: t('labels.invite'),
        onClick: this.handleOpenInviteManager,
      });
    }

    const tags = [];
    if (isPrivate) {
      tags.push(t('private.title'));
    }
    if (group?.isArchived) {
      tags.push(t('labels.archived'));
    }

    const groupsInMenu = currentHost?.settings?.menu?.find((item) => item.name === 'groups');
    const backLink = {
      value: '/groups',
      label: groupsInMenu?.label,
    };

    return (
      <>
        <Helmet>
          <title>{group?.title}</title>
        </Helmet>

        <TablyCentered
          action={this.renderAction()}
          adminMenu={isAdmin ? adminMenu : null}
          backLink={backLink}
          // author={{
          //   src: group.authorAvatar,
          //   username: group.authorUsername,
          //   link: `/@${group.authorUsername}`,
          // }}
          images={[group?.imageUrl]}
          subTitle={group?.readingMaterial}
          tabs={tabs}
          tags={tags}
          title={group?.title}
        />

        <ConfirmModal
          visible={modalOpen}
          title={isMember ? t('modal.leave.title') : t('modal.join.title')}
          onConfirm={isMember ? this.leaveGroup : this.joinGroup}
          onCancel={this.closeModal}
        >
          <Text>
            {isMember
              ? t('modal.leave.body', {
                  title: group?.title,
                })
              : t('modal.join.body', {
                  title: group?.title,
                })}
          </Text>
        </ConfirmModal>
        <ConfirmModal
          visible={Boolean(potentialNewAdmin)}
          title={t('confirm.check')}
          onConfirm={this.setAsAGroupAdmin}
          onCancel={() => this.setState({ potentialNewAdmin: null })}
        >
          <Text>
            <b>{t('confirm.admin.title', { admin: potentialNewAdmin })}</b>
          </Text>
          <Text>{t('confirm.admin.body', { admin: potentialNewAdmin })}</Text>
        </ConfirmModal>

        {isPrivate && (
          <Drawer
            title={t('labels.invite')}
            isOpen={inviteManagerOpen}
            onClose={this.handleCloseInviteManager}
          >
            <InviteManager group={group} t={t} />
          </Drawer>
        )}
      </>
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
  hostname,
  newMeeting,
  resources,
  handleDateChange,
  handleResourceChange,
  handleSubmit,
}) {
  const [isLocal, setIsLocal] = useState(true);
  const [t] = useTranslation('groups');
  const [ta] = useTranslation('activities');

  return (
    <Box bg="brand.50" border="1px solid" borderColor="brand.500" p="4" my="4">
      <Text fontWeight="bold">{t('meeting.form.label')}</Text>
      <Box py="2" mb="8">
        <DateTimePicker
          placeholder={t('meeting.form.time.start')}
          value={newMeeting}
          onChange={handleDateChange}
        />
      </Box>

      {/* <FormControl alignItems="center" display="flex" mb="2" ml="2" mt="4">
        <Switch
          id="is-local-switch"
          isChecked={isLocal}
          onChange={({ target: { checked } }) => setIsLocal(checked)}
        />
        <FormLabel htmlFor="is-local-switch" mb="1" ml="2">
          {t('meeting.form.switch', { place: hostname })}
        </FormLabel>
      </FormControl> */}

      {isLocal ? (
        <Select
          name="resource"
          placeholder={t('meeting.form.resource')}
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
        <Button isDisabled={buttonDisabled} size="sm" onClick={handleSubmit}>
          {t('meeting.form.submit')}
        </Button>
      </Flex>

      {conflictingBooking && <ConflictMarker recurrence={conflictingBooking} t={ta} />}
    </Box>
  );
}

Group.contextType = StateContext;

export default Group;
