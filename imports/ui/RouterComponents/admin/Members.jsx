import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useState, useContext } from 'react';
import moment from 'moment';

import {
  Box,
  Center,
  Heading,
  Input,
  Tabs,
  Tab,
  TabPanel,
  TabPanels,
  TabList,
  Text,
  useToast,
} from '@chakra-ui/react';

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
  const toast = useToast();
  const [sortBy, setSortBy] = useState('join-date');
  const [filter, setFilter] = useState('all');
  const [filterWord, setFilterWord] = useState('');

  const { currentUser, role } = useContext(StateContext);

  if (isLoading) {
    return <Loader />;
  }

  const setAsParticipant = async (user) => {
    try {
      await call('setAsParticipant', user.id);
      toast({
        title: `${user.username} is now set back as a participant`,
        status: 'success',
      });
    } catch (error) {
      console.log(error);
      toast({
        title: error.reason || error.error,
        status: 'error',
      });
    }
  };

  const setAsContributor = async (user) => {
    try {
      await call('setAsContributor', user.id);
      toast({
        title: `${user.username} is now set as a contributor`,
        status: 'success',
      });
    } catch (error) {
      console.log(error);
      toast({
        title: error.reason || error.error,
        status: 'error',
      });
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
        <Box p="4">
          <ListMenu pathname={pathname} list={adminMenu} />
        </Box>
      }
    >
      <Center p="1">
        <Tabs w="100%">
          <Center>
            <TabList flexWrap="wrap">
              {filterOptions.map((item) => (
                <Tab key={item.value} onClick={() => setFilter(item.value)}>
                  {item.label}
                </Tab>
              ))}
            </TabList>
          </Center>

          <Center p="4">
            <Box>
              <Input
                bg="white"
                placeholder="username or email"
                value={filterWord}
                onChange={(event) => setFilterWord(event.target.value)}
              />
            </Box>
          </Center>

          <TabPanels>
            {filterOptions.map((item, index) =>
              item.value === filter ? (
                <TabPanel key={item.value} p="1" mb="3">
                  <NiceList
                    itemBg="white"
                    keySelector="email"
                    list={membersSorted}
                  >
                    {(member) => (
                      <Box key={member.username}>
                        <Heading size="md" fontWeight="bold">
                          {member.username}
                        </Heading>
                        <Text>{member && member.email}</Text>
                        <Text fontStyle="italic">{member.role}</Text>
                        <Text fontSize="xs" color="gray.500">
                          joined {moment(member.date).format('Do MMM YYYY')}{' '}
                          <br />
                        </Text>
                      </Box>
                    )}
                  </NiceList>
                </TabPanel>
              ) : (
                <TabPanel key={index} />
              )
            )}
          </TabPanels>
        </Tabs>
      </Center>
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
