import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, List, Card, Radio, Button, Divider } from 'antd/lib';
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
        <h4>
          reading: <b>{group.readingMaterial}</b>
        </h4>
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
          <PulseLoader color="#ea3924" loading />
        </div>
      );
    }

    const centerStyle = {
      display: 'flex',
      justifyContent: 'center',
      padding: 24
    };

    return (
      <Row gutter={24}>
        <Col md={8}>
          <div style={centerStyle}>
            <Link to="/new-group">
              <Button type="primary">New Group</Button>
            </Link>
          </div>
        </Col>

        <Col md={14} style={{ paddingLeft: 24, paddingRight: 24 }}>
          <h2 style={{ textAlign: 'center' }}>Study Groups</h2>

          {/* <div style={centerStyle}>
            <RadioGroup defaultValue="ongoing" size="large">
              <RadioButton value="ongoing">Ongoing</RadioButton>
              <RadioButton value="my-groups">My Groups</RadioButton>
              <RadioButton value="archived">Archived</RadioButton>
            </RadioGroup>
          </div> */}

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
                    <Meta
                      description={
                        <div style={{ textAlign: 'right' }}>
                          <Link to={`/group/${group._id}`}>
                            <Button>Read more</Button>
                          </Link>
                        </div>
                      }
                    />
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
