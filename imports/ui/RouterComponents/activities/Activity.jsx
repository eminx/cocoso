import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ReactToPrint from 'react-to-print';
import ReactTable from 'react-table';
import renderHTML from 'react-render-html';
import 'react-table/react-table.css';
import { useForm } from 'react-hook-form';

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
} from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
// import Chattery from '../../UIComponents/chattery/Chattery';
import FancyDate from '../../UIComponents/FancyDate';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';
import Tag from '../../UIComponents/Tag';
import ConfirmModal from '../../UIComponents/ConfirmModal';
import { call } from '../../functions';
import { message } from '../../UIComponents/message';
import FormField from '../../UIComponents/FormField';

class Activity extends PureComponent {
  state = {
    isRsvpCancelModalOn: false,
    rsvpCancelModalInfo: null,
    capacityGotFullByYou: false,
  };

  addNewChatMessage = (message) => {
    Meteor.call(
      'addChatMessage',
      this.props.activityData._id,
      message,
      'activity',
      (error, respond) => {
        if (error) {
          console.log('error', error);
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

  handleRSVPSubmit = async (values, occurenceIndex) => {
    const { activityData } = this.props;

    const isEmailAlreadyRegistered = activityData.datesAndTimes[
      occurenceIndex
    ].attendees.some(
      (attendee) => attendee.email.toLowerCase() === values.email.toLowerCase()
    );

    if (isEmailAlreadyRegistered) {
      message.error('Email already registered. Please update instead.');
      return;
    }

    try {
      await call(
        'registerAttendance',
        activityData._id,
        values,
        occurenceIndex
      );
      message.success(
        'You have just successfully registered your attendance. Welcome!'
      );
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  openCancelRsvpModal = (occurenceIndex) => {
    const { currentUser } = this.props;

    this.setState({
      isRsvpCancelModalOn: true,
      rsvpCancelModalInfo: {
        occurenceIndex,
        email: currentUser ? currentUser.emails[0].address : '',
        lastName:
          currentUser && currentUser.lastName ? currentUser.lastName : '',
      },
    });
  };

  findRsvpInfo = () => {
    const { rsvpCancelModalInfo } = this.state;
    const { activityData } = this.props;
    const theOccurence =
      activityData.datesAndTimes[rsvpCancelModalInfo.occurenceIndex];

    const attendeeFinder = (attendee) =>
      attendee.lastName === rsvpCancelModalInfo.lastName &&
      attendee.email === rsvpCancelModalInfo.email;

    const foundAttendee = theOccurence.attendees.find(attendeeFinder);
    const foundAttendeeIndex = theOccurence.attendees.findIndex(attendeeFinder);

    if (!foundAttendee) {
      message.error(
        'Sorry we could not find your registration. Please double check the date and spellings, and try again'
      );
      return;
    }

    this.setState({
      rsvpCancelModalInfo: {
        ...rsvpCancelModalInfo,
        attendeeIndex: foundAttendeeIndex,
        isInfoFound: true,
        firstName: foundAttendee.firstName,
        numberOfPeople: foundAttendee.numberOfPeople,
      },
    });
  };

  renderCancelRsvpModalContent = () => {
    const { rsvpCancelModalInfo } = this.state;
    if (!rsvpCancelModalInfo) {
      return;
    }

    if (rsvpCancelModalInfo.isInfoFound) {
      const defaultValues = {
        ...rsvpCancelModalInfo,
      };
      return (
        <RsvpForm
          isUpdateMode
          onDelete={this.handleRemoveRSVP}
          defaultValues={defaultValues}
          onSubmit={(values) => this.handleChangeRSVPSubmit(values)}
        />
      );
    } else {
      return (
        <Box>
          <FormControl id="lastname" mb="3" size="sm">
            <FormLabel>Last name</FormLabel>
            <Input
              value={rsvpCancelModalInfo && rsvpCancelModalInfo.lastName}
              onChange={(e) =>
                this.setState({
                  rsvpCancelModalInfo: {
                    ...rsvpCancelModalInfo,
                    lastName: e.target.value,
                  },
                })
              }
              // size="sm"
            />
          </FormControl>

          <FormControl id="email" size="sm">
            <FormLabel>Email</FormLabel>
            <Input
              value={rsvpCancelModalInfo && rsvpCancelModalInfo.email}
              onChange={(e) =>
                this.setState({
                  rsvpCancelModalInfo: {
                    ...rsvpCancelModalInfo,
                    email: e.target.value,
                  },
                })
              }
            />
          </FormControl>
        </Box>
      );
    }
  };

  handleChangeRSVPSubmit = async (values) => {
    const { rsvpCancelModalInfo } = this.state;
    const { activityData } = this.props;

    const parsedValues = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      numberOfPeople: Number(values.numberOfPeople),
    };

    try {
      await call(
        'updateAttendance',
        activityData._id,
        parsedValues,
        rsvpCancelModalInfo.occurenceIndex,
        rsvpCancelModalInfo.attendeeIndex
      );
      message.success('You have successfully updated your RSVP');
      this.setState({
        rsvpCancelModalInfo: null,
        isRsvpCancelModalOn: false,
      });
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  handleRemoveRSVP = async () => {
    const { rsvpCancelModalInfo } = this.state;
    const { activityData } = this.props;

    try {
      await call(
        'removeAttendance',
        activityData._id,
        rsvpCancelModalInfo.occurenceIndex,
        rsvpCancelModalInfo.attendeeIndex,
        rsvpCancelModalInfo.email
      );
      message.success('You have successfully removed your registration');
      this.setState({
        rsvpCancelModalInfo: null,
        isRsvpCancelModalOn: false,
      });
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  renderDates = () => {
    const { activityData, currentUser } = this.props;
    const { capacityGotFullByYou } = this.state;
    const { canCreateContent } = this.context;

    if (!activityData) {
      return;
    }

    const yesterday = moment(new Date()).add(-1, 'days');

    if (activityData.isRegistrationDisabled) {
      return (
        <div>
          {activityData.datesAndTimes.map((occurence, occurenceIndex) => (
            <Box
              bg="white"
              key={occurence.startDate + occurence.startTime}
              p="2"
              mb="2"
            >
              <FancyDate occurence={occurence} />
            </Box>
          ))}
        </div>
      );
    }

    const getTotalNumber = (occurence) => {
      let counter = 0;
      occurence.attendees.forEach((attendee) => {
        counter += Number(attendee.numberOfPeople);
      });
      return counter;
    };

    const defaultRsvpValues = {
      firstName: currentUser ? currentUser.firstName : '',
      lastName: currentUser ? currentUser.lastName : '',
      email: currentUser ? currentUser.emails[0].address : '',
      numberOfPeople: 1,
    };
    const conditionalRender = (occurence, occurenceIndex) => {
      if (occurence && occurence.attendees) {
        const eventPast = moment(occurence.endDate).isBefore(yesterday);

        return (
          <Box bg="white">
            {eventPast ? (
              <Box p="2">
                <Text color="gray">This event has past</Text>
              </Box>
            ) : (
              <Box>
                <Center m="2">
                  <Button
                    colorScheme="red"
                    size="sm"
                    variant="ghost"
                    onClick={() => this.openCancelRsvpModal(occurenceIndex)}
                  >
                    Change/cancel existing registration
                  </Button>
                </Center>

                {occurence.capacity &&
                occurence.attendees &&
                getTotalNumber(occurence) >= occurence.capacity ? (
                  <p>
                    {capacityGotFullByYou &&
                      'Congrats! You just filled the last space!'}
                    Capacity is full now.
                  </p>
                ) : (
                  <RsvpForm
                    defaultValues={defaultRsvpValues}
                    onSubmit={(values) =>
                      this.handleRSVPSubmit(values, occurenceIndex)
                    }
                  />
                )}
              </Box>
            )}
            {canCreateContent && (
              <Box px="1">
                <Heading mb="1" as="h4" size="sm">
                  Attendees
                </Heading>
                <span>Only visible to registered members</span>
                <div
                  style={{
                    paddingBottom: 12,
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <ReactToPrint
                    trigger={() => <Button size="sm">Print</Button>}
                    content={() => this.printableElement}
                    pageStyle={{ margin: 144 }}
                  />
                </div>
                <RsvpList
                  attendees={occurence.attendees}
                  ref={(element) => (this.printableElement = element)}
                />
              </Box>
            )}
          </Box>
        );
      }
    };

    return (
      <Accordion allowToggle>
        {activityData.datesAndTimes.map((occurence, occurenceIndex) => (
          <AccordionItem
            key={occurence.startDate + occurence.startTime}
            bg="white"
            mb="2"
          >
            <AccordionButton _expanded={{ bg: 'green.100' }}>
              <Box flex="1" textAlign="left">
                <FancyDate occurence={occurence} />
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <Heading size="sm">Register</Heading>
              {conditionalRender(occurence, occurenceIndex)}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  isAdmin = () => {
    const { activityData } = this.props;
    const { currentUser } = this.context;
    return (
      currentUser && activityData && currentUser._id === activityData.authorId
    );
  };

  removeNotification = (messageIndex) => {
    const { activityData, currentUser } = this.props;
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
      activityData._id,
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

  render() {
    const { activityData, isLoading, currentUser, chatData, history } =
      this.props;

    if (!activityData || isLoading) {
      return <Loader />;
    }

    const { isRsvpCancelModalOn, rsvpCancelModalInfo } = this.state;

    const messages = this.getChatMessages();

    const EditButton = currentUser &&
      activityData &&
      currentUser._id === activityData.authorId && (
        <Center m="2">
          <Link to={`/edit-activity/${activityData._id}`}>
            <Button variant="ghost" as="span">
              Edit
            </Button>
          </Link>
        </Center>
      );

    return (
      <Template
        leftContent={
          <Box p="2">
            <Heading as="h3" size="lg">
              {activityData.title}
            </Heading>
            {activityData.subTitle && (
              <Heading as="h4" size="md" fontWeight="light">
                {activityData.subTitle}
              </Heading>
            )}
          </Box>
        }
        rightContent={
          <Box width="100%" p="2">
            <Heading mb="1" as="h5" size="md">
              Dates
            </Heading>
            <Text size="sm" mb="1">
              {activityData.isRegistrationDisabled
                ? 'RSVP disabled. Please check the practical information.'
                : 'Please click and open the date to RSVP'}
            </Text>
            {this.renderDates()}
          </Box>
        }
      >
        <Box bg="white" mb="4">
          {activityData.isPublicActivity && (
            <Box bg="gray.900">
              <Image
                fit="contain"
                src={activityData.imageUrl}
                // style={{ maxHeight: 400 }}
                htmlHeight={400}
              />
            </Box>
          )}

          {activityData.longDescription && (
            <Box p="4">
              <div
                style={{
                  whiteSpace: 'pre-line',
                  color: 'rgba(0,0,0, .85)',
                }}
                className="text-content"
              >
                {renderHTML(activityData.longDescription)}
              </div>
            </Box>
          )}
        </Box>

        <Box p="2" mb="1">
          <Heading mb="1" as="h5" size="md">
            Resource
          </Heading>
          <Tag label={activityData.resource} />
        </Box>
        {activityData.address && (
          <Box p="2" mb="1">
            <Heading mb="1" as="h5" size="md">
              Address
            </Heading>
            <Text size="sm">{activityData.address}</Text>
          </Box>
        )}

        {/* {activityData.isPublicActivity && messages && chatData && (
          <Box pad="medium" background="light-2" border="dark-2">
            <Heading mb="1" as="h5" size="md">Chat Section</Heading>
            <Chattery
              messages={messages}
              onNewMessage={this.addNewChatMessage}
              removeNotification={this.removeNotification}
              isMember
            />
          </Box>
        )} */}

        {EditButton}

        <ConfirmModal
          visible={isRsvpCancelModalOn}
          title={
            rsvpCancelModalInfo && rsvpCancelModalInfo.isInfoFound
              ? 'Now please continue'
              : 'Please enter the details of your RSVP'
          }
          onConfirm={this.findRsvpInfo}
          onCancel={() => this.setState({ isRsvpCancelModalOn: false })}
          hideFooter={rsvpCancelModalInfo && rsvpCancelModalInfo.isInfoFound}
          onClickOutside={() => this.setState({ isRsvpCancelModalOn: false })}
        >
          {this.renderCancelRsvpModalContent()}
        </ConfirmModal>
      </Template>
    );
  }
}

Activity.contextType = StateContext;

const fields = [
  {
    name: 'firstName',
    label: 'First name',
  },
  {
    name: 'lastName',
    label: 'Last name',
  },
  {
    name: 'email',
    label: 'Email address',
  },
  // {
  //   name: 'numberOfPeople',
  //   label: 'Number of people',
  // },
];

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  numberOfPeople: 1,
};

function RsvpForm({ isUpdateMode, defaultValues, onSubmit, onDelete }) {
  const { handleSubmit, register, formState } = useForm({
    defaultValues,
  });

  const { isDirty, isSubmitting } = formState;

  return (
    <Box bg="white" p="1" mb="8">
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <Stack spacing={2}>
          {fields.map((field) => (
            <FormField key={field.name} label={field.label}>
              <Input {...register(field.name)} size="sm" />
            </FormField>
          ))}
          <FormField label="Number of Attendees">
            <NumberInput size="sm">
              <NumberInputField {...register('numberOfPeople')} />
            </NumberInput>
          </FormField>
          <Box pt="2" w="100%">
            <Button
              colorScheme="green"
              isDisabled={isUpdateMode && !isDirty}
              isLoading={isSubmitting}
              loadingText="Submitting"
              size="sm"
              type="submit"
              w="100%"
            >
              {isUpdateMode ? 'Update' : 'Register'}
            </Button>
          </Box>
          {isUpdateMode && (
            <Button
              colorScheme="red"
              size="sm"
              variant="ghost"
              onClick={onDelete}
            >
              Remove your registration
            </Button>
          )}
        </Stack>
      </form>
    </Box>
  );
}

function RsvpList({ attendees }) {
  return (
    <ReactTable
      data={attendees}
      columns={[
        {
          Header: 'First name',
          accessor: 'firstName',
        },
        {
          Header: 'Last name',
          accessor: 'lastName',
        },
        {
          Header: 'People',
          accessor: 'numberOfPeople',
        },
        {
          Header: 'Email',
          accessor: 'email',
        },
      ]}
    />
  );
}

export default Activity;
