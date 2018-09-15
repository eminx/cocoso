import React from 'react';
import { Link } from 'react-router-dom';
import Blaze from 'meteor/gadicc:blaze-react-component';

import { Row, Col, Spin } from 'antd/lib';

class Profile extends React.Component {
  render() {
    const { currentUser, isLoading } = this.props;

    return (
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col span={8}>
            <Blaze template="loginButtons" />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Profile;
