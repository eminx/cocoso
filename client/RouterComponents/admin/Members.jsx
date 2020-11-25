import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
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

function Members({ history, members, isLoading }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState('join-date');
  const [filter, setFilter] = useState('all');
  const [filterWord, setFilterWord] = useState('');

  const { currentUser, role } = useContext(StateContext);

  // const getAndSetUsers = async () => {
  //   setLoading(true);
  //   try {
  //     const users = await call('getUsers');
  //     setUsers(users);
  //     setLoading(false);
  //   } catch (error) {
  //     message.error(error.error);
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getAndSetUsers();
  // }, []);

  if (isLoading) {
    return <Loader />;
  }

  const setAsParticipant = async (user) => {
    try {
      await call('setAsParticipant', user.id);
      message.success(`${user.username} is now set back as a participant`);
      // getAndSetUsers();
    } catch (error) {
      console.log(error);
      message.error(error.reason || error.error);
    }
  };

  const setAsContributor = async (user) => {
    try {
      await call('setAsContributor', user.id);
      message.success(`${user.username} is now set as a contributor`);
    } catch (error) {
      console.log(error);
      message.error(error.reason || error.error);
    }
  };

  if (
    !currentUser ||
    (role !== 'admin' && role !== 'contributor' && !currentUser.isSuperAdmin)
  ) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <Alert
          message="You are not allowed to view this content"
          type="warning"
        />
      </div>
    );
  }

  const membersFiltered =
    members &&
    members.filter((member) => {
      if (filter === 'all') {
        return true;
      } else if (filter === 'participant') {
        return member.role === 'participant';
      } else if (filter === 'contributor') {
        return member.role === 'contributor';
      } else if (filter === 'admin') {
        return member.role === 'admin';
      }
    });

  const membersList = membersFiltered.map((member) => ({
    ...member,
    actions: [
      {
        content: 'Set as a Contributor',
        handleClick: () => setAsContributor(member),
        isDisabled:
          ['admin', 'contributor'].includes(member.role) ||
          !['admin', 'contributor'].includes(role),
      },
      {
        content: 'Revert back as a Participant',
        handleClick: () => setAsParticipant(member),
        isDisabled:
          !['contributor'].includes(member.role) || !['admin'].includes(role),
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
    {
      label: 'Admins',
      value: 'admin',
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

  const membersFilteredWithType = membersList.filter((member) => {
    const lowerCaseFilterWord = filterWord ? filterWord.toLowerCase() : '';
    if (!member.username || !member.email) {
      return false;
    }
    return (
      member.username.toLowerCase().indexOf(lowerCaseFilterWord) !== -1 ||
      member.email.toLowerCase().indexOf(lowerCaseFilterWord) !== -1
    );
  });

  let membersSorted;
  switch (sortBy) {
    case 'username':
      membersSorted = membersFilteredWithType.sort((a, b) =>
        a.username.localeCompare(b.username)
      );
      break;
    case 'join-date':
    default:
      membersSorted = membersFilteredWithType.sort(compareUsersByDate);
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
          {filter} members ({membersSorted.length}){' '}
        </Heading>
      </Box>
      <Box pad="small" background="white" margin={{ bottom: 'large' }}>
        <NiceList list={membersSorted} border="horizontal" pad="small">
          {(member) => (
            <div key={member.username}>
              <Text size="large" weight="bold">
                {member.username}
              </Text>
              <Text as="div" size="small">
                {member && member.email}
              </Text>
              <Text as="div" size="small">
                {member.role}
              </Text>
              <Text
                as="div"
                size="xsmall"
                style={{ fontSize: 10, color: '#aaa' }}
              >
                joined {moment(member.createdAt).format('Do MMM YYYY')} <br />
              </Text>
            </div>
          )}
        </NiceList>
      </Box>
    </Template>
  );
}

export default MembersContainer = withTracker((props) => {
  const membersSubscription = Meteor.subscribe('members');
  const currentHost = Hosts.findOne();
  const isLoading = !membersSubscription.ready();
  const currentUser = Meteor.user();
  const members = currentHost.members ? currentHost.members.reverse() : [];

  return {
    isLoading,
    currentUser,
    members,
  };
})(Members);
