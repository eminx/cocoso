import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Alert, List, Card, Spin, Button, message } from 'antd/lib';

const ListItem = List.Item;
const { Meta } = Card;

class Users extends React.PureComponent {
  toggleVerification = user => {
    if (user.isRegisteredMember) {
      Meteor.call('unVerifyMember', user._id, (error, response) => {
        if (error) {
          message.error('It did not work :/');
          console.log(error);
        } else {
          message.success('Verification removed');
        }
      });
    } else {
      Meteor.call('verifyMember', user._id, (error, response) => {
        if (error) {
          message.error('It did not work :/');
          console.log(error);
        } else {
          message.success('User is now verified');
        }
      });
    }
  };

  render() {
    const { isLoading, currentUser, users } = this.props;

    if (isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Spin size="large" />
        </div>
      );
    }

    if (!currentUser || !currentUser.isSuperAdmin) {
      return (
        <Row gutter={48}>
          <Col>
            <Alert
              title="Not allowed"
              message="You are not allowed to view this content"
              type="warning"
            />
          </Col>
        </Row>
      );
    }

    return (
      <Row gutter={24}>
        <Col md={8} />

        <Col md={14}>
          <h2 style={{ paddingLeft: 24 }}>Members </h2>
          <List
            dataSource={users}
            renderItem={user => (
              <ListItem style={{ paddingBottom: 0 }}>
                <Card
                  title={user.username}
                  bordered
                  hoverable
                  extra={user.emails[0].address}
                  style={{ width: '100%', marginBottom: 0 }}
                >
                  <Button
                    onClick={() => this.toggleVerification(user)}
                    disabled={user.isSuperAdmin}
                  >
                    {user.isRegisteredMember
                      ? 'Remove user membership'
                      : 'Verify this user'}
                  </Button>
                </Card>
              </ListItem>
            )}
          />
        </Col>

        <Col md={16} />
      </Row>
    );
  }
}

export default Users;
