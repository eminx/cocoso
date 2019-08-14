import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Row, Col, List, Card, Radio, Button, Divider } from 'antd/lib';
import Loader from '../../UIComponents/Loader';
import NiceList from '../../UIComponents/NiceList';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

import { compareForSort } from '../../functions';

const ListItem = List.Item;

function shortenDescription(str) {
  return str
    .split(/\s+/)
    .slice(0, 20)
    .join(' ');
}

class GroupsList extends React.PureComponent {
  getTitle = group => {
    return (
      <div>
        <h3 style={{ overflowWrap: 'anywhere' }}>
          <Link to={`/group/${group._id}`}>{group.title}</Link>
        </h3>
        <h5>
          <b>{group.readingMaterial}</b>
        </h5>
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

  archiveGroup = group => {
    console.log(group);
  };

  render() {
    if (isLoading) {
      return <Loader />;
    }

    const { isLoading, currentUser, groupsData } = this.props;
    const isSuperAdmin = (currentUser && currentUser.isSuperAdmin) || false;

    const groupsSorted = groupsData.sort(compareForSort);

    const centerStyle = {
      display: 'flex',
      justifyContent: 'center',
      padding: 24,
      paddingBottom: 0
    };

    const radioButton = {
      padding: 8,
      width: '100%'
    };

    const groupsList = groupsSorted.map(group => ({
      ...group,
      actions: [
        {
          content: 'Archive',
          handleClick: () => this.archiveGroup(group._id)
        }
      ]
    }));

    return (
      <Row gutter={24}>
        <Col md={8}>
          <div style={centerStyle}>
            <Link to="/new-group">
              <Button type="primary" component="span">
                New Group
              </Button>
            </Link>
          </div>

          <div style={{ paddingTop: 12, paddingLeft: 12 }}>
            <RadioGroup defaultValue="active" size="small">
              <Radio value="active" style={radioButton}>
                Active Groups
              </Radio>
              <Radio value="created-by-me" style={radioButton}>
                My Groups
              </Radio>
              <Radio value="archived" style={radioButton}>
                Archived
              </Radio>
            </RadioGroup>
          </div>
        </Col>

        <Col md={14} style={{ padding: 24 }}>
          <h2 style={{ textAlign: 'center' }}>Groups</h2>

          {groupsList && groupsList.length > 0 && (
            <NiceList
              list={groupsList.reverse()}
              actionsDisabled={!isSuperAdmin}
            >
              {group => (
                <Card
                  title={this.getTitle(group)}
                  bordered
                  extra={this.getExtra(group)}
                  style={{ width: '100%', marginBottom: 0 }}
                  className="empty-card-body"
                />
              )}
            </NiceList>
          )}

          <List
            dataSource={groupsSorted.reverse()}
            renderItem={group => (
              <ListItem style={{ paddingBottom: 0 }}>
                <Card
                  title={this.getTitle(group)}
                  bordered
                  extra={this.getExtra(group)}
                  style={{ width: '100%', marginBottom: 0 }}
                  className="empty-card-body"
                />
              </ListItem>
            )}
          />
        </Col>

        <Col md={16} />
      </Row>
    );
  }
}

export default GroupsList;
