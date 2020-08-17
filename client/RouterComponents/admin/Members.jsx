import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import {
  Box,
  Anchor,
  Text,
  Heading,
  RadioButtonGroup,
  TextInput,
} from 'grommet';

import Loader from '../../UIComponents/Loader';
import NiceList from '../../UIComponents/NiceList';
import Template from '../../UIComponents/Template';
import ListMenu from '../../UIComponents/ListMenu';
import { message, Alert } from '../../UIComponents/message';
import { StateContext } from '../../LayoutContainer';
import { call } from '../../functions';
import { adminMenu } from '../../constants/general';

const compareUsersByDate = (a, b) => {
  const dateA = new Date(a.createdAt);
  const dateB = new Date(b.createdAt);
  return dateB - dateA;
};

function Members({ history }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState('join-date');
  const [filter, setFilter] = useState('all');
  const [filterWord, setFilterWord] = useState('');

  const { currentUser } = useContext(StateContext);

  const getAndSetUsers = async () => {
    setLoading(true);
    try {
      const users = await call('getUsers');
      setUsers(users);
      setLoading(false);
    } catch (error) {
      message.error(error.error);
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAndSetUsers();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const toggleVerification = (user) => {
    if (user.role === 'contributor') {
      Meteor.call('unVerifyAsContributor', user.id, (error, response) => {
        if (error) {
          message.error(error.reason);
          console.log(error);
          getAndSetUsers();
          return;
        }
        getAndSetUsers();
        message.success(
          `${user.username} is now reverted back to being a participant`
        );
      });
    } else if (user.role === 'participant') {
      Meteor.call('verifyAsContributor', user.id, (error, response) => {
        if (error) {
          message.error(error.reason);
          console.log(error);
          getAndSetUsers();
          return;
        }
        getAndSetUsers();
        message.success(`${user.username} is now verified as a contributor`);
      });
    }
  };

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
    users.filter((user) => {
      if (filter === 'all') {
        return true;
      } else if (filter === 'participant') {
        return user.role === 'participant';
      } else if (filter === 'contributor') {
        return user.role === 'contributor';
      }
    });

  const usersList = usersFiltered.map((user) => ({
    ...user,
    actions: [
      {
        content:
          user.role === 'contributor'
            ? 'Revert back to participant role'
            : 'Verify this user as a contributor',
        handleClick: () => toggleVerification(user),
        isDisabled: user.isSuperAdmin,
      },
    ],
  }));

  const filterOptions = [
    {
      label: 'All',
      value: 'all',
    },
    {
      label: 'Participants',
      value: 'participant',
    },
    {
      label: 'Contributors',
      value: 'contributor',
    },
  ];

  const sortOptions = [
    {
      label: 'Date joined',
      value: 'join-date',
    },
    {
      label: 'Username',
      value: 'username',
    },
  ];

  const usersFilteredWithType = usersList.filter((user) => {
    const lowerCaseFilterWord = filterWord ? filterWord.toLowerCase() : '';
    return (
      user.username.toLowerCase().indexOf(lowerCaseFilterWord) !== -1 ||
      user.email.toLowerCase().indexOf(lowerCaseFilterWord) !== -1
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
        <Box pad="medium">
          <ListMenu list={adminMenu}>
            {(datum) => (
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
        </Box>
      }
    >
      <Box align="center" pad="small">
        <Text size="small" margin="small" weight="bold">
          Filter
        </Text>
        <Box flex={{ grow: 1 }} margin={{ bottom: 'small' }}>
          <RadioButtonGroup
            name="filter"
            options={filterOptions}
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            direction="row"
          />
        </Box>
        <Box flex={{ grow: 1 }}>
          <TextInput
            plain={false}
            placeholder="username or email"
            value={filterWord}
            onChange={(event) => setFilterWord(event.target.value)}
            style={{ backgroundColor: 'white' }}
          />
        </Box>
      </Box>

      <Box align="center">
        <Text size="small" margin="small" weight="bold">
          Sort
        </Text>
        <RadioButtonGroup
          name="sort"
          options={sortOptions}
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          direction="row"
        />
      </Box>

      <Box pad="medium">
        <Heading level={4} alignSelf="center">
          {filter} members ({usersSorted.length}){' '}
        </Heading>
      </Box>
      <Box pad="small" elevation="small" background="white">
        <NiceList list={usersSorted} border="horizontal" pad="small">
          {(user) => (
            <div key={user.username}>
              <Text size="large" weight="bold">
                {user.username}
              </Text>
              <Text as="div" size="small">
                {user && user.email}
              </Text>
              <Text as="div" size="small">
                {user.role}
              </Text>
              <Text
                as="div"
                size="xsmall"
                style={{ fontSize: 10, color: '#aaa' }}
              >
                joined {moment(user.createdAt).format('Do MMM YYYY')} <br />
              </Text>
            </div>
          )}
        </NiceList>
      </Box>
    </Template>
  );
}

export default Members;
