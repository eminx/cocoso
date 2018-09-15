import React from 'react';
import { Link } from 'react-router-dom';
import Chattery from '../../chattery';
import {
  Row,
  Col,
  Spin,
  Button,
  Divider,
  List,

} from 'antd/lib';

const ListItem = List.Item;

import CardArticle from '../../UIComponents/CardArticle';

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

  render() {
    const { bookingData, isLoading, currentUser, chatData } = this.props;

    const EditButton =
      currentUser && bookingData && currentUser._id === bookingData.authorId ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            top: 20,
            right: 30
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
        {!isLoading && bookingData ? (
          <Row gutter={24}>
            <Col sm={24} md={16} style={{ position: 'relative' }}>
              <CardArticle
                item={bookingData}
                isLoading={isLoading}
                currentUser={currentUser}
              />
              {EditButton}
            </Col>
          </Row>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spin size="large" />
          </div>
        )}
        <Divider />
        <Row gutter={24}>
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
        </Row>
      </div>
    );
  }
}

export default Booking;
