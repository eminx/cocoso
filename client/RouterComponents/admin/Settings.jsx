import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, message } from 'antd/lib';
import { Heading, TextInput } from 'grommet';

import { UserContext } from '../../LayoutContainer';
import { activeStyle, linkStyle } from '../../UIComponents/PagesList';
import Loader from '../../UIComponents/Loader';

class Settings extends PureComponent {
  state = {
    settings: null,
    isLoading: false
  };

  componentDidMount() {
    const { currentUser } = this.context;
    if (!currentUser || !currentUser.isSuperAdmin) {
      return;
    }

    // Meteor.call('getSettings', (error, respond) => {
    //   this.setState({
    //     settings: respond,
    //     isLoading: false
    //   });
    // });
  }

  render() {
    const { currentUser } = this.context;
    const { settings, isLoading } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    if (!currentUser || !currentUser.isSuperAdmin) {
      return <h2>You are not allowed</h2>;
    }

    return (
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col md={7}>
            <div style={{ ...activeStyle, ...linkStyle }}>
              <Link to="/admin/settings">Settings</Link>
            </div>

            <div style={{ ...linkStyle }}>
              <Link to="/admin/members">Members</Link>
            </div>
          </Col>

          <Col md={12}>
            <Heading level={3}>Settings</Heading>
            <div style={{ color: '#030303' }}>
              Here you will fill your settings.
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

Settings.contextType = UserContext;

export default Settings;
