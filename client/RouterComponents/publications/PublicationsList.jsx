import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Row, Col, List, Card, Radio, Button, Divider } from 'antd/lib';
import { PulseLoader } from 'react-spinners';

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

class PublicationsList extends React.PureComponent {
  getTitle = publication => {
    return (
      <div>
        <h3>
          <Link to={`/publication/${publication._id}`}>
            {publication.title}
          </Link>
        </h3>
        <h5>
          by: <b>{publication.authors}</b>
        </h5>
      </div>
    );
  };

  getExtra = publication => {
    return (
      <div>
        <b>{publication.format}</b>
        <br />
        created by {publication.adminUsername}
        <br />
        <span style={{ fontSize: 10 }}>
          published: {moment(publication.publishDate).format('Do MMM YYYY')}
        </span>
      </div>
    );
  };

  render() {
    const { isLoading, currentUser, publicationsData } = this.props;

    if (isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PulseLoader color="#ea3924" loading />
        </div>
      );
    }

    const publicationsSorted = publicationsData.sort(compareForSort);

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
            <Link to="/new-publication">
              <Button type="primary" component="span">
                New Publication
              </Button>
            </Link>
          </div>
        </Col>

        <Col md={14} style={{ padding: 24 }}>
          <h2 style={{ textAlign: 'center' }}>Publications</h2>

          {/* <div style={centerStyle}>
            <RadioGroup defaultValue="ongoing" size="large">
              <RadioButton value="ongoing">Ongoing</RadioButton>
              <RadioButton value="my-publications">My Publications</RadioButton>
              <RadioButton value="archived">Archived</RadioButton>
            </RadioGroup>
          </div> */}

          <List
            dataSource={publicationsSorted.reverse()}
            renderItem={publication => (
              <ListItem style={{ paddingBottom: 0 }}>
                <Card
                  title={this.getTitle(publication)}
                  bordered
                  extra={this.getExtra(publication)}
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

export default PublicationsList;
