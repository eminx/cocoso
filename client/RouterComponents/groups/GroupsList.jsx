import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Row, Col, List, Card, Radio, Button, Divider } from 'antd/lib';
import Loader from '../../UIComponents/Loader';

import { compareForSort } from '../../functions';

const ListItem = List.Item;
const { Meta } = Card;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

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
        <h3>
          <Link to={`/group/${group._id}`}>{group.title}</Link>
        </h3>
        <h5>
          reading: <b>{group.readingMaterial}</b>
        </h5>
      </div>
    );
  };

  getExtra = group => {
    return (
      <div>
        <b>{group.members.length + ' / ' + group.capacity}</b>
        <br />
        {group.adminUsername}
        <br />
        <span style={{ fontSize: 10 }}>
          {moment(group.creationDate).format('Do MMM YYYY')}
        </span>
      </div>
    );
  };

  render() {
    const { isLoading, currentUser, groupsData } = this.props;

    if (isLoading) {
      return <Loader />;
    }

    const groupsSorted = groupsData.sort(compareForSort);

    const centerStyle = {
      display: 'flex',
      justifyContent: 'center',
      padding: 24,
      paddingBottom: 0
    };

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
        </Col>

        <Col md={14} style={{ padding: 24 }}>
          <h2 style={{ textAlign: 'center' }}>Groups</h2>

          {/* <div style={centerStyle}>
            <RadioGroup defaultValue="ongoing" size="large">
              <RadioButton value="ongoing">Ongoing</RadioButton>
              <RadioButton value="my-groups">My Groups</RadioButton>
              <RadioButton value="archived">Archived</RadioButton>
            </RadioGroup>
          </div> */}

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
