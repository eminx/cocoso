import React from 'react';
import {
  Row,
  Dropdown,
  Col,
  Icon,
  Alert,
  List,
  Card,
  Menu,
  message
} from 'antd/lib';
import Loader from '../../UIComponents/Loader';

const ListItem = List.Item;
const MenuItem = Menu.Item;

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
      return <Loader />;
    }

    const usersSorted =
      users && users.sort((a, b) => a.username.localeCompare(b.username));

    return (
      <Row gutter={24}>
        <Col md={8} />

        <Col md={14} style={{ padding: 24 }}>
          <h2>Members </h2>
          <List
            dataSource={usersSorted}
            renderItem={user => (
              <ListItem
                actions={[
                  <Dropdown
                    trigger={['click']}
                    placement="bottomRight"
                    overlay={
                      <Menu>
                        {!user.isSuperAdmin && (
                          <MenuItem>
                            <a onClick={() => this.toggleVerification(user)}>
                              {user.isRegisteredMember
                                ? 'Remove user membership'
                                : 'Verify this user'}
                            </a>
                          </MenuItem>
                        )}
                      </Menu>
                    }
                  >
                    <div>
                      <Icon type="ellipsis" />
                    </div>
                  </Dropdown>
                ]}
              >
                <div>
                  <div>
                    <b>{user.username}</b>
                  </div>
                  <p style={{ fontSize: 12 }}>
                    <em>
                      {user && user.emails ? user.emails[0].address : null}
                    </em>
                  </p>
                </div>
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
