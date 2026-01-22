import React, { useEffect, useMemo, useState } from 'react';
import {
  useLoaderData,
  useLocation,
  useRevalidator,
  useSearchParams,
} from 'react-router';
import dayjs from 'dayjs';
import { Trans, useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

import {
  Alert,
  Badge,
  Box,
  Center,
  Code,
  Flex,
  Heading,
  Input,
  Loader,
  Select,
  Tabs,
  Text,
} from '/imports/ui/core';

import NiceList from '/imports/ui/generic/NiceList';
import { currentUserAtom, isDesktopAtom, roleAtom } from '/imports/state';
import { call } from '../../../api/_utils/shared';
import { message } from '/imports/ui/generic/message';

import UsageReport from './UsageReport';
import Boxling from './Boxling';

const compareUsersByDate = (a, b) => {
  const rawA = a.date || a.createdAt;
  const rawB = b.date || b.createdAt;
  const dateA = rawA ? new Date(rawA) : new Date(0);
  const dateB = rawB ? new Date(rawB) : new Date(0);
  return dateA - dateB;
};

function MemberItem({ member }) {
  const [t] = useTranslation('members');

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

function MemberList({ members }) {
  return (
    <NiceList
      actionsDisabled={false}
      itemBg="white"
      keySelector="email"
      list={members}
      virtual
    >
      {(member) => <MemberItem key={member.username} member={member} />}
    </NiceList>
  );
}

const filterOptions = [
  {
    label: <Trans i18nKey="members:all" />,
    value: 'all',
  },
  {
    label: <Trans i18nKey="members:roles.participant" />,
    value: 'participant',
  },
  {
    label: <Trans i18nKey="members:roles.contributor" />,
    value: 'contributor',
  },
  {
    label: <Trans i18nKey="members:roles.admin" />,
    value: 'admin',
  },
];

const sortOptions = [
  {
    label: <Trans i18nKey="members:form.sort.date" />,
    value: 'join-date',
  },
  {
    label: <Trans i18nKey="members:form.sort.user" />,
    value: 'username',
  },
];

export default function Members() {
  const currentUser = useAtomValue(currentUserAtom);
  const isDesktop = useAtomValue(isDesktopAtom);
  const role = useAtomValue(roleAtom);
  const { members } = useLoaderData();
  const revalidator = useRevalidator();
  const [sortBy, setSortBy] = useState('join-date');
  const [filterWord, setFilterWord] = useState('');
  const [userForUsageReport, setUserForUsageReport] = useState(null);
  const [t] = useTranslation('members');
  const [tc] = useTranslation('common');
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Keep hooks order stable; avoid early returns. Use conditional rendering below.

  const setAsParticipant = async (user) => {
    try {
      await call('setAsParticipant', user.id);
      revalidator.revalidate();
      message.success(
        t('message.success.participant', { username: user.username })
      );
    } catch (error) {
      message.error({
        title: error.reason || error.error,
        status: 'error',
      });
    }
  };

  const setAsContributor = async (user) => {
    try {
      await call('setAsContributor', user.id);
      revalidator.revalidate();
      message.success(
        t('message.success.contributor', { username: user.username })
      );
    } catch (error) {
      message.error({
        title: error.reason || error.error,
        status: 'error',
      });
    }
  };

  const setAsAdmin = async (user) => {
    try {
      await call('setAsAdmin', user.id);
      revalidator.revalidate();
      message.success(t('message.success.admin', { username: user.username }));
    } catch (error) {
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

  const show = searchParams.get('show');

  const membersRendered = useMemo(
    () =>
      membersSorted.filter((m) => !show || show === 'all' || show === m.role),
    [membersSorted, show]
  );

  const tabs = useMemo(
    () =>
      filterOptions.map((item) => ({
        title: item.label,
        onClick: () =>
          setSearchParams((params) => ({ ...params, show: item.value })),
      })),
    [filterOptions, membersRendered, t]
  );

  const tabIndex = show
    ? filterOptions.findIndex((opt) => opt.value === show)
    : 0;

  if (!currentUser || role !== 'admin') {
    return (
      <Center>
        <Alert message={tc('message.access.deny')} type="warning" />
      </Center>
    );
  }

  return (
    <>
      <Tabs tabs={tabs} index={tabIndex} />

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

        <Flex direction={isDesktop ? 'row' : 'column'} w="100%">
          <Box
            pr={isDesktop ? '4' : '0'}
            pb={isDesktop ? '0' : '2'}
            css={{
              flexBasis: '60%',
            }}
          >
            <Input
              placeholder={t('form.holder')}
              value={filterWord}
              onChange={(event) => setFilterWord(event.target.value)}
            />
          </Box>
          <Box css={{ flexBasis: '40%' }}>
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

      <MemberList members={membersRendered} />

      <UsageReport
        isOpen={Boolean(userForUsageReport)}
        user={userForUsageReport}
        onClose={() => setUserForUsageReport(null)}
      />
    </>
  );
}
