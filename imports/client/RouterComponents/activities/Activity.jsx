import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ReactToPrint from 'react-to-print';
import ReactTable from 'react-table';
import renderHTML from 'react-render-html';
import 'react-table/react-table.css';

import {
  Accordion,
  AccordionPanel,
  Anchor,
  Box,
  Image,
  Form,
  FormField,
  TextInput,
  Button,
  Heading,
  Text,
} from 'grommet';

import { StateContext } from '../../LayoutContainer';
import Chattery from '../../chattery';
import FancyDate from '../../UIComponents/FancyDate';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';
import Tag from '../../UIComponents/Tag';
import ConfirmModal from '../../UIComponents/ConfirmModal';
import { call } from '../../functions';
import { message } from '../../UIComponents/message';

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

  handleRSVPSubmit = async ({ value, touched }, occurenceIndex) => {
    const { activityData } = this.props;

    try {
      await call('registerAttendance', activityData._id, value, occurenceIndex);
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
      const user = {
        ...rsvpCancelModalInfo,
        emails: [{ address: rsvpCancelModalInfo.email }],
      };
      return (
        <RsvpForm
          isUpdateMode
          onDelete={this.handleRemoveRSVP}
          currentUser={user}
          onSubmit={(event) => this.handleChangeRSVPSubmit(event)}
        />
      );
    } else {
      return (
        <Box gap="medium">
          <TextInput
            placeholder="Last name"
            value={rsvpCancelModalInfo && rsvpCancelModalInfo.lastName}
            onChange={(e) =>
              this.setState({
                rsvpCancelModalInfo: {
                  ...rsvpCancelModalInfo,
                  lastName: e.target.value,
                },
              })
            }
            size="small"
          />
          <TextInput
            placeholder="Email"
            value={rsvpCancelModalInfo && rsvpCancelModalInfo.email}
            onChange={(e) =>
              this.setState({
                rsvpCancelModalInfo: {
                  ...rsvpCancelModalInfo,
                  email: e.target.value,
                },
              })
            }
            size="small"
          />
        </Box>
      );
    }
  };

  handleChangeRSVPSubmit = async ({ value, touched }) => {
    const { rsvpCancelModalInfo } = this.state;
    const { activityData } = this.props;

    const values = {
      ...value,
      numberOfPeople: Number(value.numberOfPeople),
    };

    try {
      await call(
        'updateAttendance',
        activityData._id,
        values,
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
      message.success('You have successfully removed your RSVP');
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

    if (activityData.isActivitiesDisabled) {
      return (
        <div>
          {activityData.datesAndTimes.map((occurence, occurenceIndex) => (
            <Box
              key={occurence.startDate + occurence.startTime}
              background="white"
              pad="small"
              margin={{ bottom: 'small' }}
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

    const conditionalRender = (occurence, occurenceIndex) => {
      if (occurence && occurence.attendees) {
        const eventPast = moment(occurence.endDate).isBefore(yesterday);

        return (
          <Box background="white">
            {eventPast ? (
              <Box pad={{ vertical: 'medium', horizontal: 'small' }}>
                <Text color="status-critical">This event has past</Text>
              </Box>
            ) : (
              <Box>
                <Box
                  direction="row"
                  justify="end"
                  margin={{ bottom: 'small', right: 'medium' }}
                >
                  <Anchor
                    size="small"
                    onClick={() => this.openCancelRsvpModal(occurenceIndex)}
                  >
                    Change/Cancel Existing RSVP
                  </Anchor>
                </Box>

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
                    currentUser={currentUser}
                    onSubmit={(event) =>
                      this.handleRSVPSubmit(event, occurenceIndex)
                    }
                  />
                )}
              </Box>
            )}
            {canCreateContent && (
              <Box pad={{ horizontal: 'small' }}>
                <Heading level={5}>Attendees</Heading>
                <span>Only visible to registered members</span>
                <div
                  style={{
                    paddingBottom: 12,
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <ReactToPrint
                    trigger={() => <Button size="small" label="Print" />}
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
      <Accordion animate multiple={false}>
        {activityData.datesAndTimes.map((occurence, occurenceIndex) => (
          <AccordionPanel
            key={occurence.startDate + occurence.startTime}
            header={
              <Box pad="small" background="white">
                <FancyDate occurence={occurence} />
              </Box>
            }
          >
            {conditionalRender(occurence, occurenceIndex)}
          </AccordionPanel>
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
        <Box direction="row" justify="center" margin="medium">
          <Link to={`/edit-activity/${activityData._id}`}>
            <Anchor as="span">Edit this Activity</Anchor>
          </Link>
        </Box>
      );

    return (
      <Template
        leftContent={
          <Box pad="medium">
            <Heading level={3} style={{ marginBottom: 0 }} size="small">
              {activityData.title}
            </Heading>
            {activityData.subTitle && (
              <Heading level={4} style={{ marginTop: 0, fontWeight: 300 }}>
                {activityData.subTitle}
              </Heading>
            )}
          </Box>
        }
        rightContent={
          <Box width="100%" pad="medium">
            <Heading margin={{ bottom: 'small' }} level={5}>
              Dates
            </Heading>
            <Text size="small" margin={{ bottom: 'small' }}>
              {activityData.isActivitiesDisabled
                ? 'RSVP disabled. Please check the practical information.'
                : 'Please click and open the date to RSVP'}
            </Text>
            {this.renderDates()}
          </Box>
        }
      >
        <Box background="white">
          {activityData.isPublicActivity && (
            <Box background="dark-1">
              <Image
                fit="contain"
                fill
                src={activityData.imageUrl}
                style={{ maxHeight: 400 }}
              />
            </Box>
          )}

          {activityData.longDescription && (
            <Box pad="medium">
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

        <Box pad="medium" margin={{ bottom: 'small' }}>
          <Heading level={5} margin={{ bottom: 'small' }}>
            Resource
          </Heading>
          <Tag label={activityData.resource} />
        </Box>
        {activityData.address && (
          <Box pad="medium" margin={{ bottom: 'small' }}>
            <Heading level={5} margin={{ bottom: 'small' }}>
              Address
            </Heading>
            <Text size="small">{activityData.address}</Text>
          </Box>
        )}

        {activityData.isPublicActivity && messages && chatData && (
          <Box pad="medium" background="light-2" border="dark-2">
            <Heading level={4}>Chat Section</Heading>
            <Chattery
              messages={messages}
              onNewMessage={this.addNewChatMessage}
              removeNotification={this.removeNotification}
              isMember
            />
          </Box>
        )}

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
  {
    name: 'numberOfPeople',
    label: 'Number of people',
  },
];

function RsvpForm({ isUpdateMode, currentUser, onSubmit, onDelete }) {
  return (
    <Box background="white" pad="small">
      <Form onSubmit={onSubmit}>
        {fields.map((field) => (
          <FormField
            key={field.name}
            size="small"
            name={field.name}
            label={<Text size="small">{field.label}</Text>}
          >
            <TextInput plain={false} name={field.name} />
          </FormField>
        ))}
        <Box margin={{ top: 'medium' }}>
          <Button
            type="submit"
            size="small"
            // disabled={hasErrors(getFieldsError())}
            label={isUpdateMode ? 'Update' : 'Register'}
            alignSelf="end"
            margin={{ bottom: 'medium' }}
          />

          {isUpdateMode && (
            <Text textAlign="center" size="small">
              <Anchor color="status-critical" onClick={onDelete}>
                Remove your registration
              </Anchor>
            </Text>
          )}
        </Box>
      </Form>
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
