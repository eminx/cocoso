import React, { Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { message } from 'antd/lib';
import { Box, Button, Avatar, Heading, RadioButtonGroup, Text } from 'grommet';
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

class GroupsList extends React.PureComponent {
  state = {
    filterBy: 'active'
  };

  getGroupItem = group => {
    return (
      <Box direction="row" justify="stretch">
        <Avatar
          size="xlarge"
          round="2px"
          src={group.imageUrl}
          flex={{ grow: 0 }}
          margin={{ right: 'small' }}
        />
        <Box flex={{ grow: 1 }}>
          <Box>
            <Heading level={4} style={{ overflowWrap: 'anywhere' }}>
              <Link to={`/group/${group._id}`}>{group.title}</Link>
            </Heading>
            <Heading level={6}>{group.readingMaterial}</Heading>
          </Box>
          <div style={{ textAlign: 'right', lineHeight: '16px' }}>
            <span style={{ fontSize: 12 }}>{group.adminUsername}</span>
            <br />
            <span style={{ fontSize: 10 }}>
              {moment(group.creationDate).format('Do MMM YYYY')}
            </span>
          </div>
        </Box>
      </Box>
    );
  };

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
    const { groupsData, currentUser } = this.props;
    const { filterBy } = this.state;

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

    const filteredGroupsWithAccessFilter = this.parseOnlyAllowedGroups(
      filteredGroups
    );
    return filteredGroupsWithAccessFilter;
  };

  parseOnlyAllowedGroups = futureGroups => {
    const { currentUser } = this.props;

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
    const { currentUser } = this.props;
    const value = event.target.value;
    if (!currentUser && value === 'my-groups') {
      message.destroy();
      message.error('You need an account for filtering your groups');
      return;
    }
    this.setState({
      filterBy: value
    });
  };

  render() {
    const { isLoading, currentUser, groupsData } = this.props;
    const { filterBy } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    const groupsFilteredAndSorted = this.getFilteredGroups().sort(
      compareForSort
    );

    const groupsList = groupsFilteredAndSorted.map(group => ({
      ...group,
      actions: [
        {
          content: group.isArchived ? 'Unarchive' : 'Archive',
          handleClick: group.isArchived
            ? () => this.unarchiveGroup(group._id)
            : () => this.archiveGroup(group._id),
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
          <Fragment>
            <Link to="/new-group">
              <Button as="span" primary label="New Group" />
            </Link>
            <Box pad={{ top: 'medium' }}>
              <RadioButtonGroup
                name="filters"
                options={filterOptions}
                value={filterBy}
                onChange={this.handleSelectedFilter}
              />
            </Box>
          </Fragment>
        }
      >
        {groupsList && groupsList.length > 0 && (
          <NiceList
            list={groupsList.reverse()}
            actionsDisabled={!currentUser || !currentUser.isRegisteredMember}
            border={false}
          >
            {group => <Box>{this.getGroupItem(group)}</Box>}
          </NiceList>
        )}
      </Template>
    );
  }
}

export default GroupsList;
