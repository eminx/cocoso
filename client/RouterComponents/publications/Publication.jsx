import React, { Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Chattery from '../../chattery';
import {
  Row,
  Col,
  Divider,
  Modal,
  List,
  Card,
  Button,
  message
} from 'antd/lib';
const ListItem = List.Item;
const { Meta } = Card;
import { PulseLoader } from 'react-spinners';

class Publication extends React.PureComponent {
  state = {
    modalOpen: false,
    redirectToLogin: false
  };

  isAdmin = () => {
    const { currentUser, publication } = this.props;
    if (!currentUser || !publication) {
      return false;
    }

    const isAdmin = publication && publication.adminId === currentUser._id;

    return Boolean(isAdmin);
  };

  getTitle = publication => {
    return (
      <div>
        <h3>{publication.title}</h3>
        <h5>by: {publication.authors}</h5>
        <div>
          <Button
            icon="download"
            href={publication.linkToDigitalCopy}
            target="_blank"
          >
            Download
          </Button>
        </div>
      </div>
    );
  };

  getExtra = (publication, isAdmin) => {
    if (isAdmin) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <b>{publication.format}</b>
          <Divider type="vertical" />
          <Link to={`/edit-publication/${publication._id}`}>Edit</Link>
        </div>
      );
    } else {
      return (
        <div>
          <b>{publication.format}</b>
        </div>
      );
    }
  };

  render() {
    if (this.state.redirectToLogin) {
      return <Redirect to="/my-profile" />;
    }

    const { publication, isLoading, currentUser } = this.props;

    const isAdmin = this.isAdmin();

    const titleStyle = {
      marginLeft: 24,
      fontWeigth: 300,
      color: '#0g0g0g'
    };

    return (
      <div>
        <div style={{ padding: 12 }}>
          <Link to="/publications">
            <Button icon="arrow-left">Publications</Button>
          </Link>
        </div>

        {!isLoading && publication ? (
          <Row gutter={24} style={{ paddingRight: 12, paddingLeft: 12 }}>
            <Col md={4} />
            <Col sm={24} md={12}>
              <Card
                title={this.getTitle(publication)}
                bordered
                extra={this.getExtra(publication, isAdmin)}
                style={{ width: '100%', marginBottom: 0 }}
                cover={
                  publication.imageUrl ? (
                    <img alt="publication-image" src={publication.imageUrl} />
                  ) : null
                }
              >
                <Meta description={publication.description} />
              </Card>
            </Col>
          </Row>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PulseLoader color="#ea3924" loading />
          </div>
        )}
        <Divider />
      </div>
    );
  }
}

export default Publication;
