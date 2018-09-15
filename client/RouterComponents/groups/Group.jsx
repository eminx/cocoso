import React from 'react';
import { Link } from 'react-router-dom';
import Chattery from '../../chattery';
import {
  Row,
  Col,
  Spin,
  Button,
  Icon,
  Divider,
  Checkbox,
  List,
  Avatar,
  Affix,
  Popconfirm,
  Card,
  Anchor,
  message
} from 'antd/lib';
const ListItem = List.Item;
const { Meta } = Card;

class Group extends React.Component {
  addNewChatMessage = message => {
    Meteor.call(
      'addChatMessage',
      this.props.group._id,
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

  getTitle = group => {
    return (
      <div>
        <h1>{group.title}</h1>
        <h3 style={{ fontWeight: 300 }}>
          <em>
            reading: <b>{group.readingMaterial}</b>
          </em>
        </h3>
      </div>
    );
  };

  getExtra = (group, isAdmin) => {
    if (isAdmin) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <b>{group.members.length + ' / ' + group.capacity}</b>
          <Divider type="vertical" />
          <Link to={`/edit-group/${group._id}`}>Edit</Link>
        </div>
      );
    } else {
      return (
        <div>
          <b>{group.members.length + ' / ' + group.capacity}</b>
          <br />
          created by {group.authorName}
        </div>
      );
    }
  };

  render() {
    const { group, isLoading, currentUser, chatData } = this.props;
    const isAdmin = currentUser && group && currentUser._id === group.authorId;
    const messages = this.getChatMessages();

    const titleStyle = {
      marginLeft: 24,
      fontWeigth: 300,
      color: '#0g0g0g'
    };

    return (
      <div>
        {!isLoading && group ? (
          <Row gutter={24}>
            <Col sm={24} md={16}>
              <Card
                title={this.getTitle(group)}
                bordered
                extra={this.getExtra(group, isAdmin)}
                style={{ width: '100%', marginBottom: 0 }}
              >
                <Meta description={group.description} />
              </Card>
            </Col>

            <Col sm={24} md={8}>
              <Button type="primary" onClick={null} block>
                Join this Group
              </Button>
            </Col>
          </Row>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spin size="large" />
          </div>
        )}
        <Divider />
        <Row gutter={24}>
          <Col sm={24} md={16}>
            <h4 style={titleStyle}>Chat Section</h4>
            {chatData && (
              <div>
                <h4 style={titleStyle}>Chat Section</h4>
                <Chattery
                  messages={messages}
                  onNewMessage={this.addNewChatMessage}
                />
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Group;
