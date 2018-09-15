import React from 'react';
import { AccountsReact } from 'meteor/meteoreact:accounts';
import { Row, Col, Spin } from 'antd/lib';

class Profile extends React.Component {
  render() {
    const { currentUser, isLoading } = this.props;

    return (
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col span={8}>
            <AccountsReact
            // history={history}
            // route={path}
            // token={params.token} // for the reset-password route
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Profile;
