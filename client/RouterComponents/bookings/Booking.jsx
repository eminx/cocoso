import React from 'react';
import moment from 'moment';
import ReactToPrint from 'react-to-print';
import ReactTable from 'react-table';
import { ScreenClassRender } from 'react-grid-system';
import 'react-table/react-table.css';
import { Divider, Input, message, Modal } from 'antd/lib';

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
  Text
} from 'grommet';

import Chattery from '../../chattery';
import FancyDate from '../../UIComponents/FancyDate';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';
import { call } from '../../functions';

function registrationSuccess() {
  Modal.success({
    title: 'You are set!',
    content: 'You have just successfully registered your attendance. Welcome!'
  });
}

class Booking extends React.Component {
  state = {
    isRsvpCancelModalOn: false,
    rsvpCancelModalInfo: null,
    capacityGotFullByYou: false
  };

  addNewChatMessage = message => {
    Meteor.call(
      'addChatMessage',
      this.props.bookingData._id,
      message,
      'booking',
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
      messages.forEach(message => {
        if (message.senderId === currentUser._id) {
          message.isFromMe = true;
        }
      });
    }

    return messages;
  };

  handleRSVPSubmit = async ({ value, touched }, occurenceIndex) => {
    const { bookingData } = this.props;

    try {
      await call('registerAttendance', bookingData._id, value, occurenceIndex);
      registrationSuccess();
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  openCancelRsvpModal = occurenceIndex => {
    const { currentUser } = this.props;

    this.setState({
      isRsvpCancelModalOn: true,
      rsvpCancelModalInfo: {
        occurenceIndex,
        email: currentUser ? currentUser.emails[0].address : '',
        lastName:
          currentUser && currentUser.lastName ? currentUser.lastName : ''
      }
    });
  };

  findRsvpInfo = () => {
    const { rsvpCancelModalInfo } = this.state;
    const { bookingData } = this.props;
    const theOccurence =
      bookingData.datesAndTimes[rsvpCancelModalInfo.occurenceIndex];

    const attendeeFinder = attendee =>
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
        numberOfPeople: foundAttendee.numberOfPeople
      }
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
        emails: [{ address: rsvpCancelModalInfo.email }]
      };
      return (
        <RsvpForm
          isUpdateMode
          onDelete={this.handleRemoveRSVP}
          currentUser={user}
          onSubmit={event => this.handleChangeRSVPSubmit(event)}
        />
      );
    } else {
      return (
        <div>
          <Input
            placeholder="Last name"
            style={{ marginBottom: 24 }}
            value={rsvpCancelModalInfo && rsvpCancelModalInfo.lastName}
            onChange={e =>
              this.setState({
                rsvpCancelModalInfo: {
                  ...rsvpCancelModalInfo,
                  lastName: e.target.value
                }
              })
            }
          />
          <Input
            placeholder="Email"
            value={rsvpCancelModalInfo && rsvpCancelModalInfo.email}
            onChange={e =>
              this.setState({
                rsvpCancelModalInfo: {
                  ...rsvpCancelModalInfo,
                  email: e.target.value
                }
              })
            }
          />
        </div>
      );
    }
  };

  handleChangeRSVPSubmit = async ({ value, touched }) => {
    const { rsvpCancelModalInfo } = this.state;
    const { bookingData } = this.props;

    try {
      await call(
        'updateAttendance',
        bookingData._id,
        value,
        rsvpCancelModalInfo.occurenceIndex,
        rsvpCancelModalInfo.attendeeIndex
      );
      message.success('You have successfully updated your RSVP');
      this.setState({
        rsvpCancelModalInfo: null,
        isRsvpCancelModalOn: false
      });
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  handleRemoveRSVP = async () => {
    const { rsvpCancelModalInfo } = this.state;
    const { bookingData } = this.props;

    try {
      await call(
        'removeAttendance',
        bookingData._id,
        rsvpCancelModalInfo.occurenceIndex,
        rsvpCancelModalInfo.attendeeIndex,
        rsvpCancelModalInfo.email
      );
      message.success('You have successfully removed your RSVP');
      this.setState({
        rsvpCancelModalInfo: null,
        isRsvpCancelModalOn: false
      });
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  renderDates = () => {
    const { bookingData, currentUser } = this.props;
    const { capacityGotFullByYou } = this.state;

    if (!bookingData) {
      return;
    }

    const isRegisteredMember = this.isRegisteredMember();

    const yesterday = moment(new Date()).add(-1, 'days');

    if (bookingData.isBookingsDisabled) {
      return (
        <div>
          {bookingData.datesAndTimes.map((occurence, occurenceIndex) => (
            <Box pad="small">
              <FancyDate occurence={occurence} />
            </Box>
          ))}
        </div>
      );
    }

    const getTotalNumber = occurence => {
      let counter = 0;
      occurence.attendees.forEach(attendee => {
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
                  <a onClick={() => this.openCancelRsvpModal(occurenceIndex)}>
                    Change/Cancel Existing RSVP
                  </a>
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
                      onSubmit={event =>
                        this.handleRSVPSubmit(event, occurenceIndex)
                      }
                    />
                  </Box>
                )}
              </Box>
            )}
            {isRegisteredMember && (
              <Box>
                <Divider />
                <Heading level={5}>Attendees</Heading>
                <span>Only visible to registered members</span>
                <div
                  style={{
                    paddingBottom: 12,
                    display: 'flex',
                    justifyContent: 'flex-end'
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
                  ref={element => (this.printableElement = element)}
                />
              </Box>
            )}
          </Box>
        );
      }
    };

    return (
      <Accordion animate multiple={false}>
        {bookingData.datesAndTimes.map((occurence, occurenceIndex) => (
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
    const { currentUser, bookingData } = this.props;
    return (
      currentUser && bookingData && currentUser._id === bookingData.authorId
    );
  };

  isRegisteredMember = () => {
    const { currentUser } = this.props;
    return currentUser && currentUser.isRegisteredMember;
  };

  removeNotification = messageIndex => {
    const { bookingData, currentUser } = this.props;
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
      bookingData._id,
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
      bookingData,
      isLoading,
      currentUser,
      chatData,
      history
    } = this.props;

    if (!bookingData || isLoading) {
      return <Loader />;
    }

    const { isRsvpCancelModalOn, rsvpCancelModalInfo } = this.state;

    const messages = this.getChatMessages();
    const isRegisteredMember = this.isRegisteredMember();

    const EditButton = currentUser &&
      bookingData &&
      currentUser._id === bookingData.authorId && (
        <Box
          direction="row"
          justify="center"
          pad="small"
          margin={{ top: 'large' }}
        >
          <Button
            onClick={() => history.push(`/edit-booking/${bookingData._id}`)}
            label="Edit this Activity"
          />
        </Box>
      );

    return (
      <Template
        leftContent={
          <Box pad={{ left: 'small' }}>
            <Heading level={3}>{bookingData.title}</Heading>
            {bookingData.subTitle && (
              <Heading level={4} style={{ fontWeight: 300 }}>
                {bookingData.subTitle}
              </Heading>
            )}
          </Box>
        }
        rightContent={
          <Box width="100%">
            <Heading level={4}>Dates</Heading>
            <Paragraph>
              {bookingData.isBookingsDisabled
                ? 'Bookings are disabled. Please check the practical information.'
                : 'Please click and open the date to RSVP'}
            </Paragraph>
            {this.renderDates()}
            {EditButton}
          </Box>
        }
      >
        <ScreenClassRender
          render={screenClass => (
            <Box width={screenClass === 'sm' ? 'medium' : 'large'}>
              <Image fit="contain" fill src={bookingData.imageUrl} />
            </Box>
          )}
        />
        <Box>
          <div
            style={{
              whiteSpace: 'pre-line',
              color: 'rgba(0,0,0, .85)'
            }}
            dangerouslySetInnerHTML={{
              __html: bookingData.longDescription
            }}
          />
        </Box>

        {bookingData.practicalInfo && bookingData.practicalInfo.length > 0 && (
          <Box>
            <Heading level={4}>Practical information:</Heading>
            <Text size="small">{bookingData.practicalInfo}</Text>
          </Box>
        )}

        {currentUser &&
          currentUser.isRegisteredMember &&
          bookingData &&
          bookingData.internalInfo && (
            <Box>
              <Heading level={4}>Internal information for members:</Heading>
              <Text size="small">{bookingData.internalInfo}</Text>
            </Box>
          )}

        <Box>
          <Text>
            {bookingData.room && bookingData.room + ', '} <br />
            {bookingData.place}
          </Text>
          <Text size="small">{bookingData.address}</Text>
        </Box>

        {bookingData.isPublicActivity &&
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

        <Modal
          title={
            rsvpCancelModalInfo && rsvpCancelModalInfo.isInfoFound
              ? 'Now please continue'
              : 'Please enter the details of your RSVP'
          }
          footer={
            rsvpCancelModalInfo && rsvpCancelModalInfo.isInfoFound && null
          }
          visible={isRsvpCancelModalOn}
          onOk={this.findRsvpInfo}
          onCancel={() => this.setState({ isRsvpCancelModalOn: false })}
        >
          {this.renderCancelRsvpModalContent()}
        </Modal>
      </Template>
    );
  }
}

const fields = [
  {
    name: 'firstName',
    label: 'First name'
  },
  {
    name: 'lastName',
    label: 'Last name'
  },
  {
    name: 'email',
    label: 'Email address'
  },
  {
    name: 'numberOfPeople',
    label: 'Number of people'
  }
];

function RsvpForm({ isUpdateMode, currentUser, onSubmit, onDelete }) {
  return (
    <Form onSubmit={onSubmit}>
      {fields.map(field => (
        <FormField
          key={field.name}
          label={<Text size="small">{field.label}</Text>}
        >
          <TextInput plain={false} name={field.name} />
        </FormField>
      ))}
      <Button
        type="submit"
        size="small"
        // disabled={hasErrors(getFieldsError())}
        label={isUpdateMode ? 'Update' : 'Register'}
      />

      {isUpdateMode && <a onClick={onDelete}>Remove your registration</a>}
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
          accessor: 'firstName'
        },
        {
          Header: 'Last name',
          accessor: 'lastName'
        },
        {
          Header: 'People',
          accessor: 'numberOfPeople'
        },
        {
          Header: 'Email',
          accessor: 'email'
        }
      ]}
    />
  );
}

export default Booking;
