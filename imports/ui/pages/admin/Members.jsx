import React, { useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import moment from 'moment';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Heading, Input, Select, Text } from '@chakra-ui/react';

import Loader from '../../components/Loader';
import NiceList from '../../components/NiceList';
import Template from '../../components/Template';
import ListMenu from '../../components/ListMenu';
import { message, Alert } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import { call } from '../../utils/shared';
import { adminMenu } from '../../utils/constants/general';
import UsageReport from '../../components/UsageReport';
import Breadcrumb from '../../components/Breadcrumb';
import Tabs from '../../components/Tabs';

moment.locale(i18n.language);

const compareUsersByDate = (a, b) => {
  const dateA = new Date(a.createdAt);
  const dateB = new Date(b.createdAt);
  return dateB - dateA;
};

function Members() {
  const [members, setMembers] = useState(null);
  const [sortBy, setSortBy] = useState('join-date');
  const [filterWord, setFilterWord] = useState('');
  const [userForUsageReport, setUserForUsageReport] = useState(null);
  const [t] = useTranslation('members');
  const [tc] = useTranslation('common');
  const { currentUser, isDesktop, role, getCurrentHost } = useContext(StateContext);
  const history = useHistory();

  useEffect(() => {
    getMembers();
  });

  const getMembers = async () => {
    try {
      const respond = await call('getHostMembersForAdmin');
      setMembers(respond);
    } catch (error) {
      console.log(error);
    }
  };

  if (!members) {
    return <Loader />;
  }

  const setAsParticipant = async (user) => {
    try {
      await call('setAsParticipant', user.id);
      getCurrentHost();
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
      getCurrentHost();
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
      getCurrentHost();
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
      membersSorted = membersFilteredWithType.sort((a, b) => a.username.localeCompare(b.username));
      break;
    case 'join-date':
    default:
      membersSorted = membersFilteredWithType.sort(compareUsersByDate);
      break;
  }

  const pathname = history && history.location.pathname;
  const pathParts = pathname.split('/');
  const filterInPath = pathParts[pathParts.length - 1];

  const tabs = filterOptions.map((item) => {
    return {
      title: item.label,
      path: `/admin/members/${item.value}`,
      content: <MemberList roleFilter={filterInPath} members={membersSorted} t={t} />,
    };
  });

  const tabIndex = tabs && tabs.findIndex((tab) => tab.path === pathname);

  if (tabs && !tabs.find((tab) => tab.path === pathname)) {
    return <Redirect to={tabs[0].path} />;
  }

  const furtherBreadcrumbLinks = [
    {
      label: 'Admin',
      link: '/admin/settings',
    },
    {
      label: t('label'),
      link: 'admin/members',
    },
    {
      label: tabs.find((t) => t.path === pathname).title,
      link: null,
    },
  ];

  return (
    <>
      <Box p="4">
        <Breadcrumb furtherItems={furtherBreadcrumbLinks} />
      </Box>

      <Template
        heading={t('label')}
        leftContent={
          <Box>
            <ListMenu pathname={pathname} list={adminMenu} />
          </Box>
        }
      >
        <Box maxWidth={480}>
          <Tabs index={tabIndex} ml="-4" tabs={tabs} />

          <Box>
            <Text fontSize="sm">{tc('labels.filterAndSort')}</Text>
          </Box>
          <Flex flexDirection={isDesktop ? 'row' : 'column'} py="2" w="100%">
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

          <Box mb="24">
            <Switch history={history}>
              {tabs.map((tab) => (
                <Route
                  key={tab.title}
                  exact
                  path={tab.path}
                  render={(props) => (
                    <Box {...props} p="2">
                      {tab.content}
                    </Box>
                  )}
                />
              ))}
            </Switch>
          </Box>
        </Box>

        <UsageReport
          isOpen={Boolean(userForUsageReport)}
          user={userForUsageReport}
          onClose={() => setUserForUsageReport(null)}
        />
      </Template>
    </>
  );
}

function MemberList({ members, roleFilter, t }) {
  const membersFiltered = members.filter((m) => roleFilter === 'all' || roleFilter === m.role);
  return (
    <NiceList itemBg="white" keySelector="email" list={membersFiltered} ml="-4">
      {(member) => <MemberItem t={t} member={member} />}
    </NiceList>
  );
}

function MemberItem({ member, t }) {
  return (
    <Box key={member.username} p="2">
      <Heading size="md" fontWeight="bold">
        {member.username}
      </Heading>
      <Text>{member && member.email}</Text>
      <Text fontSize="sm" fontStyle="italic">
        {member.role === 'contributor' ? 'cocreator' : member.role}
      </Text>
      <Text fontSize="xs" color="gray.500">
        {t('joinedAt', {
          date: moment(member.date).format('D MMM YYYY'),
        })}
        <br />
      </Text>
    </Box>
  );
}

export default Members;
