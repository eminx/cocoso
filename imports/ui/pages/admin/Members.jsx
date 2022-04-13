import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useState, useContext } from 'react';
import moment from 'moment';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
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
} from '@chakra-ui/react';

import Loader from '../../components/Loader';
import NiceList from '../../components/NiceList';
import Template from '../../components/Template';
import ListMenu from '../../components/ListMenu';
import { message, Alert } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import { call } from '../../@/shared';
import { adminMenu } from '../../@/constants/general';
import Hosts from '../../../api/@hosts/host';

moment.locale(i18n.language);

const compareUsersByDate = (a, b) => {
  const dateA = new Date(a.createdAt);
  const dateB = new Date(b.createdAt);
  return dateB - dateA;
};

function Members({ history, members, isLoading }) {
  const [sortBy, setSortBy] = useState('join-date');
  const [filter, setFilter] = useState('all');
  const [filterWord, setFilterWord] = useState('');
  const [t] = useTranslation('members');
  const [tc] = useTranslation('common');

  const { currentUser, role } = useContext(StateContext);

  if (isLoading) {
    return <Loader />;
  }

  const setAsParticipant = async (user) => {
    try {
      await call('setAsParticipant', user.id);
      message.success(
        t('message.success.participant', { username: user.username })
      );
    } catch (error) {
      console.log(error);
      message.error({
        title: error.reason || error.error,
        status: 'error',
      });
    }
  };

  const setAsContributor = async (user) => {
    try {
      await call('setAsContributor', user.id);
      message.success(
        t('message.success.contributor', { username: user.username })
      );
    } catch (error) {
      console.log(error);
      message.error({
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
        <Alert message={tc('message.access.deny')} type="warning" />
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
        content: t('actions.contributor'),
        handleClick: () => setAsContributor(member),
        isDisabled:
          ['admin', 'contributor'].includes(member.role) ||
          !['admin', 'contributor'].includes(role),
      },
      {
        content: t('actions.participant'),
        handleClick: () => setAsParticipant(member),
        isDisabled:
          !['contributor'].includes(member.role) || !['admin'].includes(role),
      },
    ],
  }));

  const filterOptions = [
    {
      label: t('all'),
      value: 'all',
    },
    {
      label: t('roles.plural.participants'),
      value: 'participant',
    },
    {
      label: t('roles.plural.contributors'),
      value: 'contributor',
    },
    {
      label: t('roles.plural.admins'),
      value: 'admin',
    },
  ];

  const sortOptions = [
    {
      label: t('form.sort.date'),
      value: 'join-date',
    },
    {
      label: t('form.sort.user'),
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
      heading={t('label')}
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
                placeholder={t('form.holder')}
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
                      <Box key={member.username} p="2">
                        <Heading size="md" fontWeight="bold">
                          {member.username}
                        </Heading>
                        <Text>{member && member.email}</Text>
                        <Text fontStyle="italic">{member.role}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {t('joinedAt', {
                            date: moment(member.date).format('D MMM YYYY'),
                          })}
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
