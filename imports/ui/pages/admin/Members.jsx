import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { Trans, useTranslation } from 'react-i18next';
import {
  Alert,
  Badge,
  Box,
  Code,
  Flex,
  Heading,
  Input,
  Loader,
  Select,
  Text,
} from '/imports/ui/core';

import NiceList from '../../generic/NiceList';
import UsageReport from './UsageReport';
import Boxling from './Boxling';
import TablyRouter from '../../generic/TablyRouter';
import { StateContext } from '../../LayoutContainer';
import { message } from '../../generic/message';
import { call } from '../../utils/shared';

const compareUsersByDate = (a, b) => {
  const rawA = a.date || a.createdAt;
  const rawB = b.date || b.createdAt;
  const dateA = rawA ? new Date(rawA) : new Date(0);
  const dateB = rawB ? new Date(rawB) : new Date(0);
  return dateA - dateB;
};

function MemberItem({ member, t }) {
  return (
    <Box p="6">
      <Heading size="md" fontWeight="bold" mb="1">
        {member.username}
        <Badge size="sm" css={{ marginTop: '-1rem', marginLeft: '0.5rem' }}>
          {t(`roles.${member.role}`).toLowerCase()}
        </Badge>
      </Heading>
      <Code size="sm">{member && member.email}</Code>
      <br />
      <br />
      <Text size="xs" color="gray.500" fontStyle="italic">
        {t('joinedAt', {
          date: dayjs(member.date).format('D MMM YYYY'),
        })}
      </Text>
    </Box>
  );
}

function MemberList({ members, t }) {
  return (
    <NiceList
      actionsDisabled={false}
      itemBg="white"
      keySelector="email"
      list={members}
      virtual
    >
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

  // Keep hooks order stable; avoid early returns. Use conditional rendering below.

  const setAsParticipant = async (user) => {
    try {
      await call('setAsParticipant', user.id);
      getMembers();
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
      getMembers();
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

  const safeMembers = members || [];

  const membersList = useMemo(
    () =>
      safeMembers.map((member) => ({
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
            isDisabled:
              !['contributor'].includes(member.role) ||
              !['admin'].includes(role),
          },
          {
            content: t('actions.usageReport'),
            handleClick: () => setUserForUsageReport(member),
            isDisabled: member.role === 'participant',
          },
        ],
      })),
    [safeMembers, role, t]
  );

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

  const membersFilteredWithType = useMemo(() => {
    const lowerCaseFilterWord = filterWord ? filterWord.toLowerCase() : '';
    if (!lowerCaseFilterWord) return membersList;
    return membersList.filter((member) => {
      if (!member.username || !member.email) {
        return false;
      }
      return (
        member.username.toLowerCase().indexOf(lowerCaseFilterWord) !== -1 ||
        member.email.toLowerCase().indexOf(lowerCaseFilterWord) !== -1
      );
    });
  }, [membersList, filterWord]);

  const membersSorted = useMemo(() => {
    const copy = [...membersFilteredWithType];
    switch (sortBy) {
      case 'username':
        return copy.sort((a, b) => a.username.localeCompare(b.username));
      case 'join-date':
      default:
        return copy.sort(compareUsersByDate).reverse();
    }
  }, [membersFilteredWithType, sortBy]);

  const { pathname } = location;
  const pathParts = pathname.split('/');
  const filterInPath = pathParts[pathParts.length - 1];

  const membersRendered = useMemo(
    () =>
      membersSorted.filter(
        (m) => filterInPath === 'all' || filterInPath === m.role
      ),
    [membersSorted, filterInPath]
  );

  const tabs = useMemo(
    () =>
      filterOptions.map((item) => ({
        title: item.label,
        path: item.value,
        content: <MemberList members={membersRendered} t={t} />,
      })),
    [filterOptions, membersRendered, t]
  );

  return (
    <>
      {!currentUser || role !== 'admin' ? (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert message={tc('message.access.deny')} type="warning" />
        </div>
      ) : !members ? (
        <Loader />
      ) : (
        <TablyRouter tabs={tabs}>
          <Boxling mb="4" mt="8">
            <Heading color="gray.600" mb="2" size="md">
              <span
                style={{
                  fontSize: '150%',
                }}
              >
                {membersRendered.length}
              </span>{' '}
              <Trans
                i18nKey={`admin:users.${
                  membersRendered.length > 1 ? 'usersListed' : 'userListed'
                }`}
              />
            </Heading>

            <Box mb="2">
              <Text fontSize="sm">{tc('labels.filterAndSort')}</Text>
            </Box>

            <Flex flexDirection={isDesktop ? 'row' : 'column'} w="100%">
              <Box
                pr={isDesktop ? '4' : '0'}
                pb={isDesktop ? '0' : '2'}
                flexBasis="60%"
              >
                <Input
                  placeholder={t('form.holder')}
                  value={filterWord}
                  onChange={(event) => setFilterWord(event.target.value)}
                />
              </Box>
              <Box flexBasis="40%">
                <Select
                  name="sorter"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
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
      )}

      <UsageReport
        isOpen={Boolean(userForUsageReport)}
        user={userForUsageReport}
        onClose={() => setUserForUsageReport(null)}
      />
    </>
  );
}
