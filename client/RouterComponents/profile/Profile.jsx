import React from 'react';
import { Link } from 'react-router-dom';
import Blaze from 'meteor/gadicc:blaze-react-component';

import { Row, Col, Spin } from 'antd/lib';

class Profile extends React.Component {
  render() {
    const { currentUser, isLoading } = this.props;

    if (isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Spin size="large" />
        </div>
      );
    }

    return (
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col>
            <Blaze template="loginButtons" />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Profile;
