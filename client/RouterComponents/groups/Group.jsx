import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Chattery from '../../chattery';
import {
  Row,
  Col,
  Spin,
  Button,
  Icon,
  Divider,
  Modal,
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

class Group extends React.PureComponent {
  state = {
    modalOpen: false,
    redirectToLogin: false
  };

  isMember = () => {
    const { currentUser, group } = this.props;
    if (!currentUser || !group) {
      return false;
    }

    const isMember = group.members.some(
      member => member.memberId === currentUser._id
    );

    return Boolean(isMember);
  };

  isAdmin = () => {
    const { currentUser, group } = this.props;
    if (!currentUser || !group) {
      return false;
    }

    const isAdmin = group && group.adminId === currentUser._id;

    return Boolean(isAdmin);
  };

  openModal = () => {
    if (!this.props.currentUser) {
      this.setState({
        redirectToLogin: true
      });
      return;
    }
    this.setState({
      modalOpen: true
    });
  };

  closeModal = () => {
    this.setState({
      modalOpen: false
    });
  };

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
          created by {group.adminUsername}
        </div>
      );
    }
  };

  joinGroup = () => {
    const { group } = this.props;

    Meteor.call('joinGroup', group._id, (error, response) => {
      if (error) {
        message.error('error.reason');
      } else {
        message.success('You are added to the group');
      }
      this.closeModal();
    });
  };

  leaveGroup = () => {
    const { group } = this.props;

    Meteor.call('leaveGroup', group._id, (error, response) => {
      if (error) {
        message.error(error.reason);
      } else {
        message.info('You are removed from the group');
      }
      this.closeModal();
    });
  };

  render() {
    if (this.state.redirectToLogin) {
      return <Redirect to="/my-profile" />;
    }

    const { group, isLoading, currentUser, chatData } = this.props;
    const messages = this.getChatMessages();

    const isMember = this.isMember();
    const isAdmin = this.isAdmin();

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
                cover={
                  group.imageUrl ? (
                    <img alt="group-image" src={group.imageUrl} />
                  ) : null
                }
              >
                <Meta description={group.description} />
              </Card>
            </Col>

            <Col sm={24} md={8} style={{ padding: 24 }}>
              {isAdmin ? (
                <div>
                  <h4>Members of this Study Group:</h4>
                  <List
                    dataSource={group.members}
                    bordered
                    renderItem={member => (
                      <ListItem>
                        <b>
                          {member.username +
                            (member.username === currentUser.username &&
                              ' (you)')}
                        </b>
                      </ListItem>
                    )}
                  />
                </div>
              ) : (
                <Button
                  type={isMember ? null : 'primary'}
                  onClick={this.openModal}
                  block
                >
                  {isMember ? 'Leave this group' : 'Join this Group'}
                </Button>
              )}
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

        <Modal
          title={`Confirm ${
            isMember ? 'leaving' : 'participation to'
          } the group`}
          visible={this.state.modalOpen}
          onOk={isMember ? this.leaveGroup : this.joinGroup}
          onCancel={this.closeModal}
        >
          <p>
            Are you sure you want to
            {isMember ? 'leave' : 'join'}
            this Study Group?
          </p>
        </Modal>
      </div>
    );
  }
}

export default Group;
