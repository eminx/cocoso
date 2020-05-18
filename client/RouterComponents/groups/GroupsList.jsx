import React, { Fragment, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { message } from 'antd/lib';
import { Box, Button, Image, Heading, RadioButtonGroup, Text } from 'grommet';
import Loader from '../../UIComponents/Loader';
import NiceList from '../../UIComponents/NiceList';
import Template from '../../UIComponents/Template';

const filterOptions = [
  {
    label: 'Active',
    value: 'active'
  },
  {
    label: 'My Groups',
    value: 'my-groups'
  },
  {
    label: 'Archived',
    value: 'archived'
  }
];

import { compareForSort } from '../../functions';

function GroupsList({ isLoading, currentUser, groupsData, history }) {
  const [filterBy, setFilterBy] = useState('active');

  archiveGroup = groupId => {
    Meteor.call('archiveGroup', groupId, (error, respond) => {
      if (error) {
        message.error(error.error);
      } else {
        message.success('Group is successfully archived');
      }
    });
  };

  unarchiveGroup = groupId => {
    Meteor.call('unarchiveGroup', groupId, (error, respond) => {
      if (error) {
        message.error(error.reason);
      } else {
        message.success('Group is successfully unarchived');
      }
    });
  };

  getFilteredGroups = () => {
    if (!groupsData) {
      return [];
    }
    const filteredGroups = groupsData.filter(group => {
      if (filterBy === 'archived') {
        return group.isArchived === true;
      } else if (filterBy === 'my-groups') {
        return group.members.some(
          member => member.memberId === currentUser._id
        );
      } else {
        return !group.isArchived;
      }
    });

    const filteredGroupsWithAccessFilter = parseOnlyAllowedGroups(
      filteredGroups
    );
    return filteredGroupsWithAccessFilter;
  };

  parseOnlyAllowedGroups = futureGroups => {
    const futureGroupsAllowed = futureGroups.filter(group => {
      if (!group.isPrivate) {
        return true;
      } else {
        if (!currentUser) {
          return false;
        }
        const currentUserId = currentUser._id;
        return (
          group.adminId === currentUserId ||
          group.members.some(member => member.memberId === currentUserId) ||
          group.peopleInvited.some(
            person => person.email === currentUser.emails[0].address
          )
        );
      }
    });

    return futureGroupsAllowed;
  };

  handleSelectedFilter = event => {
    const value = event.target.value;
    if (!currentUser && value === 'my-groups') {
      message.destroy();
      message.error('You need an account for filtering your groups');
      return;
    }
    setFilterBy(value);
  };

  if (isLoading) {
    return <Loader />;
  }

  const groupsFilteredAndSorted = getFilteredGroups().sort(compareForSort);

  const groupsList = groupsFilteredAndSorted.map(group => ({
    ...group,
    actions: [
      {
        content: group.isArchived ? 'Unarchive' : 'Archive',
        handleClick: group.isArchived
          ? () => unarchiveGroup(group._id)
          : () => archiveGroup(group._id),
        isDisabled:
          !currentUser ||
          (group.adminId !== currentUser._id && !currentUser.isSuperAdmin)
      }
    ]
  }));

  return (
    <Template
      heading="Groups"
      leftContent={
        <Box pad="small" direction="row" justify="center">
          <Link to="/new-group">
            <Button as="span" primary label="New Group" />
          </Link>
        </Box>
      }
    >
      <Box pad="small">
        <RadioButtonGroup
          name="filters"
          options={filterOptions}
          value={filterBy}
          onChange={handleSelectedFilter}
          direction="row"
          justify="center"
        />
      </Box>

      {groupsList && groupsList.length > 0 && (
        <NiceList
          list={groupsList.reverse()}
          actionsDisabled={!currentUser || !currentUser.isRegisteredMember}
          border={false}
        >
          {group => <GroupItem group={group} history={history} />}
        </NiceList>
      )}
    </Template>
  );
}

const GroupItem = ({ group, history }) => (
  <Box
    width="100%"
    onClick={() => history.push(`/group/${group._id}`)}
    hoverIndicator="light-1"
    pad="small"
    direction="row"
    margin={{ bottom: 'medium' }}
  >
    <Box width="small" height="small" margin={{ right: 'small' }}>
      <Image fit="cover" fill src={group.imageUrl} />
    </Box>
    <Box width="100%">
      <Box>
        <Heading level={3}>{group.title}</Heading>
        <Text weight={300}>{group.readingMaterial}</Text>
      </Box>

      <Box pad="small">
        <Text size="small" textAlign="end">
          {group.adminUsername}
        </Text>
        <Text size="xsmall" textAlign="end">
          {moment(group.creationDate).format('Do MMM YYYY')}
        </Text>
      </Box>
    </Box>
  </Box>
);

export default GroupsList;
