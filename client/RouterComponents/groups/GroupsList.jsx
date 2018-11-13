import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, List, Card, Radio, Button } from 'antd/lib';
import { PulseLoader } from 'react-spinners';

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
        <h1>{group.title}</h1>
        <h3 style={{ fontWeight: 300 }}>
          <em>
            reading: <b>{group.readingMaterial}</b>
          </em>
        </h3>
      </div>
    );
  };

  getExtra = group => {
    return (
      <div>
        <b>{group.members.length + ' / ' + group.capacity}</b>
        <br />
        created by {group.adminUsername}
      </div>
    );
  };

  render() {
    const { isLoading, currentUser, groupsData } = this.props;

    if (isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PulseLoader loading />
        </div>
      );
    }

    return (
      <Row gutter={24}>
        <Col md={8}>
          <Link to="/new-group">
            <Button type="primary">New Group</Button>
          </Link>
        </Col>

        <Col md={14}>
          <h2 style={{ paddingLeft: 24 }}> Current Study Groups</h2>

          <RadioGroup defaultValue="ongoing" size="large">
            <RadioButton value="ongoing">Ongoing</RadioButton>
            <RadioButton value="my-groups">My Groups</RadioButton>
            <RadioButton value="archived">Archived</RadioButton>
          </RadioGroup>

          <List
            dataSource={groupsData}
            renderItem={group => (
              <ListItem style={{ paddingBottom: 0 }}>
                <Link to={`/group/${group._id}`} style={{ width: '100%' }}>
                  <Card
                    title={this.getTitle(group)}
                    bordered
                    hoverable
                    extra={this.getExtra(group)}
                    style={{ width: '100%', marginBottom: 0 }}
                  >
                    <Meta description={shortenDescription(group.description)} />
                  </Card>
                </Link>
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
