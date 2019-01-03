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
  message
} from 'antd/lib';

import CardArticle from '../../UIComponents/CardArticle';
import { PulseLoader } from 'react-spinners';

const Panel = Collapse.Panel;

class Booking extends React.Component {
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
        console.log('Received values of form: ', values);
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

  renderDates = () => {
    const { bookingData, form } = this.props;

    if (!bookingData) {
      return;
    }

    const customPanelStyle = {
      // background: 'rgba(251, 213, 208, .2)',
      // borderRadius: 4,
      marginBottom: 24,
      border: '1px solid #030303',
      overflow: 'hidden'
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
            <RsvpForm
              form={form}
              handleSubmit={event =>
                this.handleRSVPSubmit(event, occurenceIndex)
              }
            />
          </Panel>
        ))}
      </Collapse>
    );
  };

  render() {
    const { bookingData, isLoading, currentUser, chatData } = this.props;

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

    const messages = this.getChatMessages();

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
      </div>
    );
  }
}

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const RsvpForm = props => {
  const {
    getFieldDecorator,
    getFieldsError,
    getFieldError,
    isFieldTouched
  } = props.form;

  return (
    <Form
      layout="inline"
      onSubmit={props.handleSubmit}
      style={{ paddingLeft: 12 }}
    >
      <Form.Item>
        {getFieldDecorator('firstName', {
          rules: [{ required: true, message: 'Please enter your first name' }]
        })(<Input placeholder="First name" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('lastName', {
          rules: [{ required: true, message: 'Please enter your last name' }]
        })(<Input placeholder="Last name" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('email', {
          rules: [
            {
              required: true,
              message: 'Please enter your email address'
            }
          ]
        })(<Input placeholder="Email addresss" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('numberOfPeople', {
          rules: [
            {
              required: true,
              message: 'Please enter the number of people in your party'
            }
          ]
        })(<Input placeholder="Number of people" />)}
      </Form.Item>
      <Form.Item style={{ width: '100%' }}>
        <Button
          type="primary"
          htmlType="submit"
          disabled={hasErrors(getFieldsError())}
        >
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(Booking);
