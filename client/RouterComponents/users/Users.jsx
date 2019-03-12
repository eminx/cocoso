import React from 'react';
import moment from 'moment';
import { Row, Radio, Col, Alert, Input, message, Divider } from 'antd/lib';
import Loader from '../../UIComponents/Loader';

const RadioGroup = Radio.Group;

import NiceList from '../../UIComponents/NiceList';

const compareUsersByDate = (a, b) => {
  const dateA = new Date(a.createdAt);
  const dateB = new Date(b.createdAt);
  return dateB - dateA;
};

class Users extends React.PureComponent {
  state = {
    sortBy: 'join-date',
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

  handleSortChange = event => {
    this.setState({
      sortBy: event.target.value
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

    const usersFiltered =
      users &&
      users.filter(user => {
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

    const sortOptions = [
      {
        label: 'Date joined',
        value: 'join-date'
      },
      {
        label: 'Username',
        value: 'username'
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

    let usersSorted;
    switch (sortBy) {
      case 'username':
        usersSorted = usersFilteredWithType.sort((a, b) =>
          a.username.localeCompare(b.username)
        );
        break;
      case 'join-date':
      default:
        usersSorted = usersFilteredWithType.sort(compareUsersByDate);
        break;
    }

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
            placeholder="filter by username or email address..."
            value={filterWord}
            onChange={e => this.setState({ filterWord: e.target.value })}
          />
          <Divider />
          <h2 style={{ textAlign: 'center' }}>
            {filter} Users ({usersSorted.length}){' '}
          </h2>
          <span style={{ marginRight: 12 }}>sorted by </span>
          <RadioGroup
            options={sortOptions}
            onChange={this.handleSortChange}
            value={sortBy}
            style={{ marginBottom: 12 }}
          />
          <NiceList list={usersSorted}>
            {user => (
              <div key={user.username}>
                <div>
                  <b>{user.username}</b>
                </div>
                <p style={{ fontSize: 12 }}>
                  <em>{user && user.emails ? user.emails[0].address : null}</em>
                </p>
                <div style={{ fontSize: 10, color: '#aaa' }}>
                  joined {moment(user.createdAt).format('Do MMM YYYY')}
                </div>
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
