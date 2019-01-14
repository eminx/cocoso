import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Chattery from '../../chattery';
import {
  Row,
  Col,
  Button,
  Divider,
  Collapse,
  List,
  Form,
  Input,
  InputNumber,
  message,
  Modal
} from 'antd/lib';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import CardArticle from '../../UIComponents/CardArticle';
import { PulseLoader } from 'react-spinners';

const Panel = Collapse.Panel;

const yesterday = moment(new Date()).add(-1, 'days');

class Booking extends React.Component {
  state = {
    isRsvpCancelModalOn: false,
    rsvpCancelModalInfo: null
  };

  addNewChatMessage = message => {
    Meteor.call(
      'addChatMessage',
      this.props.bookingData._id,
      message,
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

  renderPublicActivity = () => {};

  getEventTimes = event => {
    if (event) {
      if (event.isMultipleDay || event.isFullDay) {
        return (
          moment(event.startDate).format('DD MMM') +
          ' ' +
          event.startTime +
          ' – ' +
          moment(event.endDate).format('DD MMM') +
          ' ' +
          event.endTime
        );
      } else if (event.startTime) {
        return `${moment(event.startDate).format('DD MMM')} ${
          event.startTime
        }–${event.endTime}`;
      } else {
        return '';
      }
    }
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
              message.success(
                'You have successfully registered your attendance'
              );
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

    if (!bookingData) {
      return;
    }

    const isAdmin = this.isAdmin();

    const customPanelStyle = {
      marginBottom: 24,
      border: '1px solid #030303',
      overflow: 'hidden'
    };

    const conditionalRender = (occurence, occurenceIndex) => {
      if (
        isAdmin &&
        occurence &&
        occurence.attendees &&
        occurence.attendees.length > 0
      ) {
        return <RsvpList attendees={occurence.attendees} />;
      } else if (!isAdmin) {
        if (moment(occurence.endDate).isBefore(yesterday)) {
          return <p>This event has past</p>;
        }
        return (
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
            <RsvpForm
              currentUser={currentUser}
              form={form}
              handleSubmit={event =>
                this.handleRSVPSubmit(event, occurenceIndex)
              }
            />
          </div>
        );
      } else {
        return 'no data';
      }
    };

    return (
      <Collapse bordered={false} accordion defaultActiveKey={['1']}>
        {bookingData.datesAndTimes.map((occurence, occurenceIndex) => (
          <Panel
            key={occurence.startDate + occurence.startTime}
            header={
              <h3 style={{ margin: 0 }}>{this.getEventTimes(occurence)}</h3>
            }
            style={customPanelStyle}
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

  render() {
    const { bookingData, isLoading, currentUser, chatData } = this.props;
    const { isRsvpCancelModalOn, rsvpCancelModalInfo } = this.state;

    const EditButton =
      currentUser && bookingData && currentUser._id === bookingData.authorId ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            right: 12
          }}
        >
          <Link to={`/edit-booking/${bookingData._id}`}>
            <Button>Edit</Button>
          </Link>
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
            <Col
              sm={24}
              md={14}
              style={{ position: 'relative', marginBottom: 24 }}
            >
              <CardArticle
                item={bookingData}
                isLoading={isLoading}
                currentUser={currentUser}
              />
              {EditButton}
            </Col>
            <Col
              sm={24}
              md={10}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              {/* <Button type="primary">RSVP</Button> */}
              <Row style={{ width: '100%' }}>
                <h4>Dates</h4>
                <h6>please click to RSVP</h6>
                {this.renderDates()}
              </Row>
            </Col>
          </Row>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PulseLoader loading />
          </div>
        )}

        <Divider />

        {/* <Row gutter={24}>
          <Col sm={24} md={20} lg={16}>
            {chatData ? (
              <div>
                <h2>Chat Section</h2>
                <Chattery
                  messages={messages}
                  onNewMessage={this.addNewChatMessage}
                />
              </div>
            ) : null}
          </Col>
        </Row> */}

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
      <Form.Item>
        {getFieldDecorator('firstName', {
          rules: [{ required: true, message: 'Please enter your first name' }],
          initialValue: props.currentUser && props.currentUser.firstName
        })(<Input placeholder="First name" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('lastName', {
          rules: [{ required: true, message: 'Please enter your last name' }],
          initialValue: props.currentUser && props.currentUser.lastName
        })(<Input placeholder="Last name" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('email', {
          rules: [
            {
              required: true,
              message: 'Please enter your email address'
            }
          ],
          initialValue: props.currentUser && props.currentUser.emails[0].address
        })(<Input placeholder="Email addresss" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('numberOfPeople', {
          rules: [
            {
              required: true,
              message: 'Please enter the number of people in your party'
            }
          ],
          initialValue:
            (props.currentUser && props.currentUser.numberOfPeople) || 1
        })(<InputNumber min={1} max={5} placeholder="Number of people" />)}
      </Form.Item>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 24
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

const RsvpList = ({ attendees }) => {
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
        }
      ]}
    />
  );
};

export default Form.create()(Booking);
