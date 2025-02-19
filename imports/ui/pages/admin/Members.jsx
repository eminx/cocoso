import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Heading, Input, Select, Text } from '@chakra-ui/react';

import Loader from '../../generic/Loader';
import NiceList from '../../generic/NiceList';
import { message } from '../../generic/message';
import Alert from '../../generic/Alert';
import { StateContext } from '../../LayoutContainer';
import { call } from '../../utils/shared';
import UsageReport from '../../admin/UsageReport';
import Boxling from './Boxling';
import TablyRouter from '../../generic/TablyRouter';

const compareUsersByDate = (a, b) => {
  const dateA = new Date(a.createdAt);
  const dateB = new Date(b.createdAt);
  return dateA - dateB;
};

function MemberItem({ member, t }) {
  return (
    <Box p="4">
      <Heading size="md" fontWeight="bold">
        {member.username}
      </Heading>
      <Text>{member && member.email}</Text>
      <Text fontSize="sm" fontStyle="italic">
        {t(`roles.${member.role}`).toLowerCase()}
      </Text>
      <Text fontSize="xs" color="gray.500">
        {t('joinedAt', {
          date: dayjs(member.date).format('D MMM YYYY'),
        })}
        <br />
      </Text>
    </Box>
  );
}

function MemberList({ members, t }) {
  return (
    <NiceList actionsDisabled={false} itemBg="white" keySelector="email" list={members}>
      {(member) => <MemberItem key={member.username} t={t} member={member} />}
    </NiceList>
  );
}

export default function Members() {
  const [members, setMembers] = useState(null);
  const [sortBy, setSortBy] = useState('join-date');
  const [filterWord, setFilterWord] = useState('');
  const [userForUsageReport, setUserForUsageReport] = useState(null);
  const [t] = useTranslation('members');
  const [tc] = useTranslation('common');
  const { currentUser, isDesktop, role } = useContext(StateContext);
  const location = useLocation();

  const getMembers = async () => {
    try {
      const respond = await call('getHostMembersForAdmin');
      setMembers(respond);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMembers();
  }, []);

  if (!members) {
    return <Loader />;
  }

  const setAsParticipant = async (user) => {
    try {
      await call('setAsParticipant', user.id);
      getMembers();
      message.success(t('message.success.participant', { username: user.username }));
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
      getMembers();
      message.success(t('message.success.contributor', { username: user.username }));
    } catch (error) {
      console.log(error);
      message.error({
        title: error.reason || error.error,
        status: 'error',
      });
    }
  };

  const setAsAdmin = async (user) => {
    try {
      await call('setAsAdmin', user.id);
      getMembers();
      message.success(t('message.success.admin', { username: user.username }));
    } catch (error) {
      console.log(error);
      message.error({
        title: error.reason || error.error,
        status: 'error',
      });
    }
  };

  if (!currentUser || role !== 'admin') {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <Alert message={tc('message.access.deny')} type="warning" />
      </div>
    );
  }

  const membersList = members.map((member) => ({
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
        content: t('actions.admin'),
        handleClick: () => setAsAdmin(member),
        isDisabled: member.role === 'admin',
      },
      {
        content: t('actions.participant'),
        handleClick: () => setAsParticipant(member),
        isDisabled: !['contributor'].includes(member.role) || !['admin'].includes(role),
      },
      {
        content: t('actions.usageReport'),
        handleClick: () => setUserForUsageReport(member),
        isDisabled: member.role === 'participant',
      },
    ],
  }));

  const filterOptions = [
    {
      label: t('all'),
      value: 'all',
    },
    {
      label: t('roles.participant'),
      value: 'participant',
    },
    {
      label: t('roles.contributor'),
      value: 'contributor',
    },
    {
      label: t('roles.admin'),
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
      membersSorted = membersFilteredWithType.sort((a, b) => a.username.localeCompare(b.username));
      break;
    case 'join-date':
    default:
      membersSorted = membersFilteredWithType.sort(compareUsersByDate).reverse();
      break;
  }

  const { pathname } = location;
  const pathParts = pathname.split('/');
  const filterInPath = pathParts[pathParts.length - 1];

  const membersRendered = membersSorted.filter(
    (m) => filterInPath === 'all' || filterInPath === m.role
  );

  const tabs = filterOptions.map((item) => ({
    title: item.label,
    path: item.value,
    content: <MemberList members={membersRendered} t={t} />,
  }));

  return (
    <>
      <TablyRouter tabs={tabs}>
        <Boxling mb="4" mt="8">
          <Box mb="2">
            <Text fontSize="sm">{tc('labels.filterAndSort')}</Text>
          </Box>

          <Flex flexDirection={isDesktop ? 'row' : 'column'} w="100%">
            <Box pr={isDesktop ? '4' : '0'} pb={isDesktop ? '0' : '2'} flexBasis="60%">
              <Input
                placeholder={t('form.holder')}
                value={filterWord}
                onChange={(event) => setFilterWord(event.target.value)}
              />
            </Box>
            <Box flexBasis="40%">
              <Select name="sorter" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Box>
          </Flex>
        </Boxling>
      </TablyRouter>

      <UsageReport
        isOpen={Boolean(userForUsageReport)}
        user={userForUsageReport}
        onClose={() => setUserForUsageReport(null)}
      />
    </>
  );
}
