import React from 'react';
import moment from 'moment';
import ReactToPrint from 'react-to-print';
import ReactTable from 'react-table';
import { ScreenClassRender } from 'react-grid-system';
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
  Paragraph,
  Text,
} from 'grommet';

import { StateContext } from '../../LayoutContainer';
import Chattery from '../../chattery';
import FancyDate from '../../UIComponents/FancyDate';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';
import ConfirmModal from '../../UIComponents/ConfirmModal';
import { call } from '../../functions';
import { message } from '../../UIComponents/message';

class Activity extends React.Component {
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

    if (!activityData) {
      return;
    }

    const isRegisteredMember = this.isRegisteredMember();

    const yesterday = moment(new Date()).add(-1, 'days');

    if (activityData.isActivitiesDisabled) {
      return (
        <div>
          {activityData.datesAndTimes.map((occurence, occurenceIndex) => (
            <Box>
              <FancyDate occurence={occurence} />
            </Box>
          ))}
        </div>
      );
    }

    const getTotalNumber = (occurence) => {
      let counter = 0;
      occurence.attendees.forEach((attendee) => {
        counter += attendee.numberOfPeople;
      });
      return counter;
    };

    const conditionalRender = (occurence, occurenceIndex) => {
      if (occurence && occurence.attendees) {
        const eventPast = moment(occurence.endDate).isBefore(yesterday);

        return (
          <Box pad={{ bottom: 'medium' }}>
            {eventPast ? (
              <p>This event has past</p>
            ) : (
              <Box>
                <Box direction="row" justify="end" margin={{ bottom: 'small' }}>
                  <Anchor
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
                  <Box pad="medium" background="light-1">
                    <RsvpForm
                      currentUser={currentUser}
                      onSubmit={(event) =>
                        this.handleRSVPSubmit(event, occurenceIndex)
                      }
                    />
                  </Box>
                )}
              </Box>
            )}
            {isRegisteredMember && (
              <Box>
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
              <Box pad="small">
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

  isRegisteredMember = () => {
    const { currentUser, currentHost } = this.context;

    return (
      currentUser &&
      currentHost &&
      currentHost.members &&
      currentHost.members.some((member) => member.userId === currentUser._id)
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
    const {
      activityData,
      isLoading,
      currentUser,
      chatData,
      history,
    } = this.props;

    if (!activityData || isLoading) {
      return <Loader />;
    }

    const { isRsvpCancelModalOn, rsvpCancelModalInfo } = this.state;

    const messages = this.getChatMessages();
    const isRegisteredMember = this.isRegisteredMember();

    const EditButton = currentUser &&
      activityData &&
      currentUser._id === activityData.authorId && (
        <Box
          direction="row"
          justify="center"
          pad="small"
          margin={{ top: 'large' }}
        >
          <Button
            onClick={() => history.push(`/edit-activity/${activityData._id}`)}
            label="Edit this Activity"
          />
        </Box>
      );

    return (
      <Template
        leftContent={
          <Box pad="small">
            <Heading level={2} style={{ marginBottom: 0 }}>
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
          <Box width="100%" pad="small">
            <Heading style={{ marginTop: 0, marginBottom: 0 }} level={4}>
              Dates
            </Heading>
            <Paragraph>
              {activityData.isActivitiesDisabled
                ? 'Activities are disabled. Please check the practical information.'
                : 'Please click and open the date to RSVP'}
            </Paragraph>
            {this.renderDates()}
            {EditButton}
          </Box>
        }
      >
        <Box>
          <Image fit="contain" fill src={activityData.imageUrl} />
        </Box>
        <Box pad="small">
          <Box>
            <div
              style={{
                whiteSpace: 'pre-line',
                color: 'rgba(0,0,0, .85)',
              }}
              dangerouslySetInnerHTML={{
                __html: activityData.longDescription,
              }}
            />
          </Box>

          {activityData.practicalInfo && activityData.practicalInfo.length > 0 && (
            <Box>
              <Heading level={4}>Practical information:</Heading>
              <Text size="small">{activityData.practicalInfo}</Text>
            </Box>
          )}

          {currentUser &&
            currentUser.isRegisteredMember &&
            activityData &&
            activityData.internalInfo && (
              <Box>
                <Heading level={4}>Internal information for members:</Heading>
                <Text size="small">{activityData.internalInfo}</Text>
              </Box>
            )}

          <Box>
            <Text>
              {activityData.room && activityData.room + ', '} <br />
              {activityData.place}
            </Text>
            <Text size="small">{activityData.address}</Text>
          </Box>

          {activityData.isPublicActivity &&
            messages &&
            isRegisteredMember &&
            chatData && (
              <Box>
                <Heading level={4}>Chat Section</Heading>
                <Chattery
                  messages={messages}
                  onNewMessage={this.addNewChatMessage}
                  removeNotification={this.removeNotification}
                  isMember
                />
              </Box>
            )}
        </Box>

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
    <Form onSubmit={onSubmit}>
      {fields.map((field) => (
        <FormField
          name={field.name}
          key={field.name}
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
