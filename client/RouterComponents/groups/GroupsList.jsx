import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Row, Col, Card, message } from 'antd/lib';
import { Button, Heading, RadioButtonGroup } from 'grommet';
import Loader from '../../UIComponents/Loader';
import NiceList from '../../UIComponents/NiceList';

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

  getTitle = group => {
    return (
      <div>
        <div>
          <h3 style={{ overflowWrap: 'anywhere' }}>
            <Link to={`/group/${group._id}`}>{group.title}</Link>
          </h3>
          <h5>
            <b>{group.readingMaterial}</b>
          </h5>
        </div>
        <div style={{ textAlign: 'right', lineHeight: '16px' }}>
          <span style={{ fontSize: 12 }}>{group.adminUsername}</span>
          <br />
          <span style={{ fontSize: 10 }}>
            {moment(group.creationDate).format('Do MMM YYYY')}
          </span>
        </div>
      </div>
    );
  };

  getExtra = group => {
    return (
      <div>
        {group.adminUsername}
        <br />
        <span style={{ fontSize: 10 }}>
          {moment(group.creationDate).format('Do MMM YYYY')}
        </span>
      </div>
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
      <Row gutter={24}>
        <Col md={6}>
          <div style={{ padding: 24 }}>
            <Link to="/new-group">
              <Button as="span" primary label="New Group" />
            </Link>
          </div>

          <div style={{ padding: 24 }}>
            <RadioButtonGroup
              name="filters"
              options={filterOptions}
              value={filterBy}
              onChange={this.handleSelectedFilter}
            />
          </div>
        </Col>

        <Col md={12} style={{ padding: 24 }}>
          <Heading level={3}>Groups</Heading>

          {groupsList && groupsList.length > 0 && (
            <NiceList
              list={groupsList.reverse()}
              actionsDisabled={!currentUser || !currentUser.isRegisteredMember}
            >
              {group => (
                <Card
                  title={this.getTitle(group)}
                  bordered={false}
                  // extra={this.getExtra(group)}
                  style={{ width: '100%', marginBottom: 0 }}
                  className="empty-card-body"
                />
              )}
            </NiceList>
          )}
        </Col>

        <Col md={6} />
      </Row>
    );
  }
}

export default GroupsList;
