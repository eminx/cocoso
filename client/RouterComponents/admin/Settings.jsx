import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import {
  Anchor,
  Heading,
  TextInput,
  FormField,
  Form,
  Box,
  Text,
  Button,
} from 'grommet';
const pluralize = require('pluralize');

import { UserContext } from '../../LayoutContainer';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';
import ListMenu from '../../UIComponents/ListMenu';
import message from '../../UIComponents/message';

const menuRoutes = [
  { label: 'Settings', value: '/admin/settings' },
  { label: 'Members', value: '/admin/members' },
];

class Settings extends PureComponent {
  state = {
    settings: null,
    isLoading: true,
    isFormValueChanged: false,
  };

  componentDidMount() {
    this.setHostSettings();
  }

  setHostSettings = () => {
    const { settings } = this.context;
    this.setState({
      settings,
      isLoading: false,
    });
  };

  handleFormChange = (settings) => {
    this.setState({
      settings: settings,
      isFormValueChanged: true,
    });
  };

  handleFormSubmit = () => {
    this.setState({ isLoading: true });
    const { currentUser } = this.context;
    if (!currentUser || !currentUser.isSuperAdmin) {
      message.error('This is not allowed');
      return false;
    }
    const { settings, isFormValueChanged } = this.state;

    if (!isFormValueChanged) {
      message.info('You have not changed any value');
      return;
    }

    Meteor.call('updateHostSettings', settings, (error, result) => {
      if (error) {
        console.log('error', error);
        message.error(error.reason);
        this.setState({
          isLoading: false,
          isError: true,
        });
        return;
      }
      message.success('Settings are successfully saved');
      this.setState({
        isLoading: false,
        isSuccess: true,
      });
    });
  };

  render() {
    const { history } = this.props;
    const { currentUser } = this.context;
    const { settings, isLoading, isFormValueChanged } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    if (!currentUser || !currentUser.isSuperAdmin) {
      return <h2>You are not allowed to be here</h2>;
    }

    const pathname = history && history.location.pathname;

    return (
      <Template
        heading="Settings"
        leftContent={
          <ListMenu list={menuRoutes}>
            {(datum) => (
              <Anchor
                onClick={() => history.push(datum.value)}
                key={datum.value}
                label={
                  <Text weight={pathname === datum.value ? 'bold' : 'normal'}>
                    {datum.label}
                  </Text>
                }
              />
            )}
          </ListMenu>
        }
      >
        <Box>
          <Heading level={3}>Organisation</Heading>
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
              <TextInput plain={false} name="country" placeholder="Sri Lanka" />
            </FormField>

            <Box direction="row" justify="end" pad="small">
              <Button
                type="submit"
                primary
                label="Confirm"
                disabled={!isFormValueChanged}
              />
            </Box>
          </Form>
        </Box>

        <Box>
          <Heading level={3}>Wording</Heading>
          <Form
            value={settings}
            onChange={this.handleFormChange}
            onSubmit={this.handleFormSubmit}
          >
            <Box width="medium" margin={{ bottom: 'medium' }}>
              <FormField
                label="Process"
                size="small"
                help={
                  <Text size="small">
                    Type a name if you want to replace{' '}
                    <b>
                      <code>process</code>
                    </b>{' '}
                    with something else. Note that only one word is allowed
                  </Text>
                }
              >
                <TextInput plain={false} name="process" placeholder="group" />
              </FormField>

              <Text size="small" margin={{ left: 'small' }}>
                {settings.process && (
                  <span>
                    <b>
                      <code>{pluralize(settings.process)}</code>
                    </b>{' '}
                    will be plural version
                  </span>
                )}
              </Text>
            </Box>

            <Box width="medium" margin={{ bottom: 'medium' }}>
              <FormField
                label="Work"
                size="small"
                help={
                  <Text size="small">
                    Type a name if you want to replace{' '}
                    <b>
                      <code>work</code>
                    </b>{' '}
                    with something else. Note that only one word is allowed
                  </Text>
                }
              >
                <TextInput plain={false} name="work" placeholder="offer" />
              </FormField>
            </Box>

            <Box width="medium" margin={{ bottom: 'medium' }}>
              <FormField
                label="Info"
                size="small"
                help={
                  <Text size="small">
                    Type a name if you want to replace{' '}
                    <b>
                      <code>Info</code>
                    </b>{' '}
                    with something else. Note that only one word is allowed
                  </Text>
                }
              >
                <TextInput plain={false} name="info" placeholder="About" />
              </FormField>

              <Text size="small" margin={{ left: 'small' }}>
                {settings.info && (
                  <span>
                    <b>
                      <code>{pluralize(settings.info)}</code>
                    </b>{' '}
                    will be plural version
                  </span>
                )}
              </Text>
            </Box>

            <Box direction="row" justify="end" pad="small">
              <Button
                type="submit"
                primary
                label="Confirm"
                disabled={!isFormValueChanged}
              />
            </Box>
          </Form>
        </Box>
      </Template>
    );
  }
}

Settings.contextType = UserContext;

export default Settings;
