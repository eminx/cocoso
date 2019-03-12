import React from 'react';
import {
  Row,
  Radio,
  Col,
  Icon,
  Alert,
  List,
  Card,
  Menu,
  Input,
  message,
  Divider
} from 'antd/lib';
import Loader from '../../UIComponents/Loader';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

import NiceList from '../../UIComponents/NiceList';

class Users extends React.PureComponent {
  state = {
    sortBy: '',
    filter: 'all',
    filterWord: ''
  };

  toggleVerification = user => {
    if (user.isRegisteredMember) {
      Meteor.call('unVerifyMember', user._id, (error, response) => {
        if (error) {
          message.error(error.error);
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

  handleFilterChange = event => {
    this.setState({
      filter: event.target.value
    });
  };

  render() {
    const { isLoading, currentUser, users } = this.props;
    const { filter, filterWord, sortBy } = this.state;

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

    const usersFiltered =
      usersSorted &&
      usersSorted.filter(user => {
        if (filter === 'all') {
          return true;
        } else if (filter === 'verified') {
          return user.isRegisteredMember;
        } else if (filter === 'unverified') {
          return !Boolean(user.isRegisteredMember);
        }
      });

    const usersList = usersFiltered.map(user => ({
      ...user,
      actions: [
        {
          content: user.isRegisteredMember
            ? 'Remove user membership'
            : 'Verify this user',
          handleClick: () => this.toggleVerification(user),
          isDisabled: user.isSuperAdmin
        }
      ]
    }));

    const filterOptions = [
      {
        label: 'All',
        value: 'all'
      },
      {
        label: 'Verified',
        value: 'verified'
      },
      {
        label: 'Unverified',
        value: 'unverified'
      }
    ];

    const usersFilteredWithType = usersList.filter(user => {
      return (
        user.username.toLowerCase().indexOf(filterWord.toLowerCase()) !== -1 ||
        user.emails[0].address
          .toLowerCase()
          .indexOf(filterWord.toLowerCase()) !== -1
      );
    });

    return (
      <Row gutter={24}>
        <Col md={8} />

        <Col md={8} style={{ padding: 24 }}>
          <RadioGroup
            options={filterOptions}
            onChange={this.handleFilterChange}
            value={filter}
            style={{ marginBottom: 12 }}
          />

          <Input
            placeholder="filter username or email address..."
            value={filterWord}
            onChange={e => this.setState({ filterWord: e.target.value })}
          />

          <Divider />

          <h2>{filter} Users </h2>

          <NiceList list={usersFilteredWithType}>
            {user => (
              <div key={user.username}>
                <div>
                  <b>{user.username}</b>
                </div>
                <p style={{ fontSize: 12 }}>
                  <em>{user && user.emails ? user.emails[0].address : null}</em>
                </p>
              </div>
            )}
          </NiceList>
        </Col>

        <Col md={8} />
      </Row>
    );
  }
}

export default Users;
