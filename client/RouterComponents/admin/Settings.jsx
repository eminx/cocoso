import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, message } from 'antd/lib';
import { Heading, TextInput, FormField, Form, Box, Button } from 'grommet';

import { UserContext } from '../../LayoutContainer';
import { activeStyle, linkStyle } from '../../UIComponents/PagesList';
import Loader from '../../UIComponents/Loader';

class Settings extends PureComponent {
  state = {
    settings: null,
    isLoading: true
  };

  componentDidMount() {
    const { currentUser } = this.context;
    if (!currentUser || !currentUser.isSuperAdmin) {
      return;
    }

    this.getHostSettings();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentUser } = this.context;
    const { settings } = this.state;
    if (!settings && currentUser && currentUser.isSuperAdmin) {
      this.getHostSettings();
    }
  }

  getHostSettings = () => {
    Meteor.call('getHostSettings', (error, respond) => {
      this.setState({
        settings: respond,
        isLoading: false
      });
    });
  };

  handleFormChange = settings => {
    this.setState({
      settings: settings
    });
  };

  handleFormSubmit = () => {
    const { currentUser } = this.context;
    if (!currentUser || !currentUser.isSuperAdmin) {
      message.error('This is not allowed');
      return false;
    }
    const { settings } = this.state;

    Meteor.call('updateHostSettings', settings, (error, result) => {
      if (error) {
        console.log('error', error);
        message.error(error.reason);
        this.setState({
          isLoading: false,
          isError: true
        });
        return;
      }
      message.success('Settings are successfully saved');
      this.setState({
        isLoading: false,
        isSuccess: true
      });
    });
  };

  render() {
    const { currentUser } = this.context;
    const { settings, isLoading } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    if (!currentUser || !currentUser.isSuperAdmin) {
      return <h2>You are not allowed to be here</h2>;
    }

    return (
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col md={6}>
            <div style={{ ...activeStyle, ...linkStyle }}>
              <Link to="/admin/settings">Settings</Link>
            </div>

            <div style={{ ...linkStyle }}>
              <Link to="/admin/members">Members</Link>
            </div>
          </Col>

          <Col md={12}>
            <Heading level={3}>Settings for your Organisation</Heading>
            <Form
              value={settings}
              onChange={this.handleFormChange}
              onSubmit={this.handleFormSubmit}
            >
              <FormField label="Name">
                <TextInput
                  plain={false}
                  name="name"
                  placeholder="Sandy Art Space"
                />
              </FormField>

              <FormField label="Email address">
                <TextInput
                  plain={false}
                  name="email"
                  placeholder="contact@sandyartspace.net"
                />
              </FormField>

              <FormField label="Address">
                <TextInput
                  plain={false}
                  name="address"
                  placeholder="Karl Marx strasse 99"
                />
              </FormField>

              <FormField label="City">
                <TextInput plain={false} name="city" placeholder="Berlin" />
              </FormField>

              <FormField label="Country">
                <TextInput
                  plain={false}
                  name="country"
                  placeholder="Sri Lanka"
                />
              </FormField>

              <Box direction="row" justify="end" pad="small">
                <Button type="submit" primary label="Confirm" />
              </Box>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

Settings.contextType = UserContext;

export default Settings;
