import React from 'react';
import { Row, Col, Alert, List, Card, Spin, Button, message } from 'antd/lib';
import { PulseLoader } from 'react-spinners';

const ListItem = List.Item;

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

    if (!currentUser || !currentUser.isSuperAdmin) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You are not allowed to view this content"
            type="warning"
          />
        </div>
      );
    }

    if (isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PulseLoader color="#ea3924" loading />
        </div>
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
