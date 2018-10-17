import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';

import { Row, Col } from 'antd/lib';

class Profile extends React.Component {
  render() {
    const { currentUser, isLoading, history } = this.props;

    return (
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col sm={6} md={16} />
          <Col sm={18} md={8}>
            <Blaze template="loginButtons" />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Profile;
