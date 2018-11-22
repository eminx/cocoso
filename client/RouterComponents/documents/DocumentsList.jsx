import React from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  List,
  Card,
  Radio,
  Button,
  IconButton,
  Divider
} from 'antd/lib';
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

class DocumentsList extends React.PureComponent {
  getExtra = doc => {
    console.log(doc);
    return (
      <div>
        <em> {doc.uploadedByName}</em>
      </div>
    );
  };

  render() {
    const { isLoading, currentUser, documentsData } = this.props;

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
      padding: 24,
      paddingBottom: 0
    };

    return (
      <Row gutter={24}>
        <Col md={8}>
          <div style={centerStyle}>
            <Link to="/new-group">
              <Button type="primary">Upload Document</Button>
            </Link>
          </div>
        </Col>

        <Col md={14} style={{ padding: 24 }}>
          <h2 style={{ textAlign: 'center' }}>Documents</h2>

          {/* <div style={centerStyle}>
            <RadioGroup defaultValue="ongoing" size="large">
              <RadioButton value="ongoing">Ongoing</RadioButton>
              <RadioButton value="my-Bookings">My Bookings</RadioButton>
              <RadioButton value="archived">Archived</RadioButton>
            </RadioGroup>
          </div> */}

          <List
            dataSource={documentsData}
            split={false}
            renderItem={doc => (
              <ListItem style={{ paddingBottom: 0 }}>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    border: '1px solid #030303',
                    padding: 12
                  }}
                >
                  <div>
                    <h3>
                      <a target="_blank" href={doc.documentUrl}>
                        {doc.documentLabel}
                      </a>
                    </h3>
                    <h6>{doc.contextType}</h6>
                  </div>

                  <div>{this.getExtra(doc)}</div>
                </div>
              </ListItem>
            )}
          />
        </Col>

        <Col md={16} />
      </Row>
    );
  }
}

export default DocumentsList;
