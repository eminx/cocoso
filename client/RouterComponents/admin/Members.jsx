import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Box,
  Anchor,
  Text,
  Heading,
  RadioButtonGroup,
  TextInput
} from 'grommet';

import Loader from '../../UIComponents/Loader';
import NiceList from '../../UIComponents/NiceList';
import Template from '../../UIComponents/Template';
import ListMenu from '../../UIComponents/ListMenu';
import { message, Alert } from '../../UIComponents/message';

const menuRoutes = [
  { label: 'Settings', value: '/admin/settings' },
  { label: 'Members', value: '/admin/members' }
];

const compareUsersByDate = (a, b) => {
  const dateA = new Date(a.createdAt);
  const dateB = new Date(b.createdAt);
  return dateB - dateA;
};
state = {
  sortBy: 'join-date',
  filter: 'all',
  filterWord: ''
};

function Members({ history }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState('join-date');
  const [filter, setFilter] = useState('all');
  const [filterWord, setFilterWord] = useState('');

  const getAndSetUsers = () => {
    setLoading(true);
    Meteor.call('getUsers', (error, respond) => {
      if (error) {
        message.error(error.reason);
        setLoading(false);
        return;
      }
      setUsers(respond);
      setLoading(false);
    });
  };

  useEffect(() => {
    getAndSetUsers();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const toggleVerification = user => {
    if (user.isRegisteredMember) {
      Meteor.call('unVerifyMember', user._id, (error, response) => {
        if (error) {
          message.error(error.reason);
          console.log(error);
          getAndSetUsers();
          return;
        }
        getAndSetUsers();
        message.success('Verification removed');
      });
    } else {
      Meteor.call('verifyMember', user._id, (error, response) => {
        if (error) {
          message.error(error.reason);
          console.log(error);
          getAndSetUsers();
          return;
        }
        getAndSetUsers();
        message.success('User is now verified');
      });
    }
  };

  const currentUser = Meteor.user();

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
        handleClick: () => toggleVerification(user),
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
      user.emails[0].address.toLowerCase().indexOf(filterWord.toLowerCase()) !==
        -1
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

  const pathname = history && history.location.pathname;

  return (
    <Template
      heading="Members"
      leftContent={
        <ListMenu list={menuRoutes}>
          {datum => (
            <Anchor
              onClick={() => history.push(datum.value)}
              key={datum.value}
              label={
                <Text weight={pathname === datum.value ? 'bold' : 'normal'}>
                  {datum.label}
                </Text>
              }
            />
          )}
        </ListMenu>
      }
    >
      <Box
        margin={{ bottom: 'large' }}
        align="center"
        background="light-1"
        pad="small"
      >
        <Box flex={{ grow: 1 }} pad="small">
          <RadioButtonGroup
            name="filter"
            options={filterOptions}
            value={filter}
            onChange={event => setFilter(event.target.value)}
            direction="row"
          />
        </Box>
        <Box flex={{ grow: 1 }}>
          <TextInput
            plain={false}
            placeholder="filter by username or email address..."
            value={filterWord}
            onChange={event => setFilterWord(event.target.value)}
            style={{ backgroundColor: 'white' }}
          />
        </Box>
      </Box>

      <Box direction="row" alignSelf="center" justify="center">
        <Text size="small" textAlign="center" margin="small">
          sort by:
        </Text>
        <RadioButtonGroup
          name="sort"
          options={sortOptions}
          value={sortBy}
          onChange={event => setSortBy(event.target.value)}
          direction="row"
        />
      </Box>

      <Box pad="medium">
        <Heading level={4} alignSelf="center">
          {filter} members ({usersSorted.length}){' '}
        </Heading>
      </Box>

      <NiceList list={usersSorted}>
        {user => (
          <div key={user.username}>
            <Text size="large" weight="bold">
              {user.username}
            </Text>
            <Text as="div" size="small">
              {user && user.emails ? user.emails[0].address : null}
            </Text>
            <Text
              as="div"
              size="xsmall"
              style={{ fontSize: 10, color: '#aaa' }}
            >
              joined {moment(user.createdAt).format('Do MMM YYYY')}
            </Text>
          </div>
        )}
      </NiceList>
    </Template>
  );
}

export default Members;
