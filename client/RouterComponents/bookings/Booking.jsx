import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import Chattery from '../../chattery';
import FancyDate from '../../UIComponents/FancyDate';

import {
  Row,
  Col,
  Button,
  Divider,
  Collapse,
  Form,
  Input,
  InputNumber,
  message,
  Modal
} from 'antd/lib';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import CardArticle from '../../UIComponents/CardArticle';
import Loader from '../../UIComponents/Loader';

const Panel = Collapse.Panel;
const FormItem = Form.Item;

function registrationSuccess() {
  Modal.success({
    title: 'You are set!',
    content: 'You have just successfully registered your attendance. Welcome!',
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

  handleRSVPSubmit = (event, occurenceIndex) => {
    event.preventDefault();
    const { bookingData } = this.props;
    const { resetFields } = this.props.form;
    this.props.form.validateFields((error, values) => {
      if (!error) {
        Meteor.call(
          'registerAttendance',
          bookingData._id,
          values,
          occurenceIndex,
          (error, respond) => {
            if (error) {
              console.log(error);
              message.error(error.reason);
            } else {
              registrationSuccess();
              // message.success(
              //   'You have successfully registered your attendance'
              // );
              resetFields();
            }
          }
        );
      }
    });
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
          handleDelete={this.handleRemoveRSVP}
          currentUser={user}
          form={this.props.form}
          handleSubmit={event => this.handleChangeRSVPSubmit(event)}
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

  handleChangeRSVPSubmit = event => {
    event.preventDefault();
    const { rsvpCancelModalInfo } = this.state;
    const { bookingData, form } = this.props;
    const { resetFields } = this.props.form;

    form.validateFields((error, values) => {
      if (error) {
        message.error(error.reason);
        return;
      }

      Meteor.call(
        'updateAttendance',
        bookingData._id,
        values,
        rsvpCancelModalInfo.occurenceIndex,
        rsvpCancelModalInfo.attendeeIndex,
        (error, respond) => {
          if (error) {
            console.log(error);
            message.error(error.reason);
          } else {
            message.success('You have successfully updated your RSVP');
            resetFields();
            this.setState({
              rsvpCancelModalInfo: null,
              isRsvpCancelModalOn: false
            });
          }
        }
      );
    });
  };

  handleRemoveRSVP = () => {
    const { rsvpCancelModalInfo } = this.state;
    const { bookingData, form } = this.props;
    const { resetFields } = this.props.form;

    Meteor.call(
      'removeAttendance',
      bookingData._id,
      rsvpCancelModalInfo.occurenceIndex,
      rsvpCancelModalInfo.attendeeIndex,
      rsvpCancelModalInfo.email,
      (error, respond) => {
        if (error) {
          console.log(error);
          message.error(error.reason);
        } else {
          message.success('You have successfully removed your RSVP');
          resetFields();
          this.setState({
            rsvpCancelModalInfo: null,
            isRsvpCancelModalOn: false
          });
        }
      }
    );
  };

  renderDates = () => {
    const { bookingData, form, currentUser } = this.props;
    const { capacityGotFullByYou } = this.state;

    if (!bookingData) {
      return;
    }

    const isRegisteredMember = this.isRegisteredMember();

    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginBottom: 12,
      border: 0,
      overflow: 'hidden'
    };

    const yesterday = moment(new Date()).add(-1, 'days');

    if (bookingData.isBookingsDisabled) {
      return (
        <div>
          {bookingData.datesAndTimes.map((occurence, occurenceIndex) => (
            <div style={{ ...customPanelStyle, padding: 12 }}>
              <FancyDate occurence={occurence} />
            </div>
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
          <div>
            {eventPast ? (
              <p>This event has past</p>
            ) : (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: 12
                  }}
                >
                  <a onClick={() => this.openCancelRsvpModal(occurenceIndex)}>
                    Change/Cancel Existing RSVP
                  </a>
                </div>
                {occurence.capacity &&
                occurence.attendees &&
                getTotalNumber(occurence) >= occurence.capacity ? (
                    <p>
                      {capacityGotFullByYou && 'Congrats! You just filled the last space!'}
                      Capacity is full now.
                    </p>
                ) : (
                  <RsvpForm
                    currentUser={currentUser}
                    form={form}
                    handleSubmit={event =>
                      this.handleRSVPSubmit(event, occurenceIndex)
                    }
                  />
                )}
              </div>
            )}
            {isRegisteredMember && (
              <div style={{ paddingLeft: 12 }}>
                <Divider />
                <h4>Attendees</h4>
                <span>Only visible to registered Skogen members</span>
                <div
                  style={{
                    paddingBottom: 12,
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}
                >
                  <ReactToPrint
                    trigger={() => <Button>Print</Button>}
                    content={() => this.printableElement}
                    pageStyle={{ margin: 144 }}
                  />
                </div>
                <RsvpList
                  attendees={occurence.attendees}
                  ref={element => (this.printableElement = element)}
                />
              </div>
            )}
          </div>
        );
      }
    };

    return (
      <Collapse bordered={false} accordion defaultActiveKey={['1']}>
        {bookingData.datesAndTimes.map((occurence, occurenceIndex) => (
          <Panel
            key={occurence.startDate + occurence.startTime}
            header={<FancyDate occurence={occurence} />}
            style={{ ...customPanelStyle, paddingRight: 12 }}
          >
            {conditionalRender(occurence, occurenceIndex)}
          </Panel>
        ))}
      </Collapse>
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
    const { bookingData, isLoading, currentUser, chatData } = this.props;
    const { isRsvpCancelModalOn, rsvpCancelModalInfo } = this.state;

    const messages = this.getChatMessages();
    const isRegisteredMember = this.isRegisteredMember();

    const EditButton =
      currentUser && bookingData && currentUser._id === bookingData.authorId ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            top: -36,
            right: 12
          }}
        >
          <Link to={`/edit-booking/${bookingData._id}`}>Edit</Link>
        </div>
      ) : null;

    // const messages = this.getChatMessages();

    return (
      <div style={{ padding: 24 }}>
        <div style={{ paddingBottom: 24 }}>
          <Link to="/">
            <Button icon="arrow-left">Program</Button>
          </Link>
        </div>

        {!isLoading && bookingData ? (
          <Row gutter={24}>
            <Col lg={5}>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ marginBottom: 0 }}>{bookingData.title}</h2>
                {bookingData.subTitle && (
                  <h4 style={{ fontWeight: 300 }}>{bookingData.subTitle}</h4>
                )}
              </div>
            </Col>

            <Col lg={11} style={{ position: 'relative', marginBottom: 24 }}>
              <CardArticle
                item={bookingData}
                isLoading={isLoading}
                currentUser={currentUser}
              />
              {EditButton}
            </Col>
            <Col lg={8} style={{ display: 'flex', justifyContent: 'center' }}>
              {/* <Button type="primary">RSVP</Button> */}

              <Row style={{ width: '100%' }}>
                <h3>Dates</h3>
                <p>
                  {bookingData.isBookingsDisabled
                    ? 'Bookings are disabled. Please check the practical information.'
                    : 'Please click and open the date to RSVP'}
                </p>
                {this.renderDates()}
              </Row>
            </Col>
          </Row>
        ) : (
          <Loader />
        )}

        <Divider />

        {bookingData &&
          bookingData.isPublicActivity &&
          messages &&
          isRegisteredMember && (
            <Row gutter={24}>
              <Col lg={5} />
              <Col lg={11}>
                {chatData && (
                  <div>
                    <h2>Chat Section</h2>
                    <Chattery
                      messages={messages}
                      onNewMessage={this.addNewChatMessage}
                      removeNotification={this.removeNotification}
                      isMember
                    />
                  </div>
                )}
              </Col>
            </Row>
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
      </div>
    );
  }
}

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const RsvpForm = props => {
  const { isUpdateMode, handleSubmit, handleDelete, form } = props;

  const {
    getFieldDecorator,
    getFieldsError,
    getFieldError,
    isFieldTouched
  } = form;

  return (
    <Form layout="inline" onSubmit={handleSubmit} style={{ paddingLeft: 12 }}>
      <FormItem>
        {getFieldDecorator('firstName', {
          rules: [{ required: true, message: 'Please enter your first name' }],
          initialValue: props.currentUser && props.currentUser.firstName
        })(<Input placeholder="First name" />)}
      </FormItem>
      <FormItem>
        {getFieldDecorator('lastName', {
          rules: [{ required: true, message: 'Please enter your last name' }],
          initialValue: props.currentUser && props.currentUser.lastName
        })(<Input placeholder="Last name" />)}
      </FormItem>
      <FormItem>
        {getFieldDecorator('email', {
          rules: [
            {
              required: true,
              message: 'Please enter your email address'
            }
          ],
          initialValue: props.currentUser && props.currentUser.emails[0].address
        })(<Input placeholder="Email addresss" />)}
      </FormItem>
      <FormItem style={{ width: '100%' }}>
        {getFieldDecorator('numberOfPeople', {
          rules: [
            {
              required: true,
              message: 'Please enter the number of people in your party'
            }
          ],
          initialValue:
            (props.currentUser && props.currentUser.numberOfPeople) || 1
        })(<InputNumber min={1} max={20} placeholder="Number of people" />)}
      </FormItem>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          disabled={hasErrors(getFieldsError())}
        >
          {isUpdateMode ? 'Update' : 'Register'}
        </Button>

        {isUpdateMode && <a onClick={handleDelete}>Remove your registration</a>}
      </div>
    </Form>
  );
};

class RsvpList extends React.PureComponent {
  render() {
    const { attendees } = this.props;

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
}

export default Form.create()(Booking);
