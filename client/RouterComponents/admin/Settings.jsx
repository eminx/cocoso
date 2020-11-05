import React, { useState, useEffect, useContext } from 'react';
import { Anchor, Heading, TextInput, Form, Box, Text, Button } from 'grommet';

const pluralize = require('pluralize');

import { StateContext } from '../../LayoutContainer';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';
import ListMenu from '../../UIComponents/ListMenu';
import { message, Alert } from '../../UIComponents/message';
import ConfirmModal from '../../UIComponents/ConfirmModal';
import Tag from '../../UIComponents/Tag';
import { call } from '../../functions';
import { adminMenu } from '../../constants/general';
import SettingsForm from './SettingsForm';

const specialCh = /[!@#$%^&*()/\s/_+\=\[\]{};':"\\|,.<>\/?]+/;

const Settings = ({ history }) => {
  const [localSettings, setLocalSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [formAltered, setFormAltered] = useState(false);

  const { settings, currentUser } = useContext(StateContext);

  useEffect(() => {
    setLocalSettings(settings);
    getCategories();
    setLoading(false);
  }, []);

  const getCategories = async () => {
    try {
      const latestCategories = await call('getCategories');
      setCategories(latestCategories);
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    }
  };

  const handleFormChange = (newSettings) => {
    setLocalSettings(newSettings);
    setFormAltered(true);
  };

  const handleFormSubmit = async () => {
    if (!currentUser || !currentUser.isSuperAdmin) {
      message.error('This is not allowed');
      return;
    }

    if (!formAltered) {
      message.info('You have not changed any value');
      return;
    }

    setLoading(true);
    try {
      await call('updateHostSettings', localSettings);
      message.success('Settings are successfully saved');
      setLoading(false);
    } catch (error) {
      message.error(error.reason);
      setLoading(false);
    }
  };

  const addNewCategory = async () => {
    try {
      await call('addNewCategory', categoryInput.toLowerCase());
      getCategories();
      setCategoryInput('');
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    }
  };

  const removeCategory = async (categoryId) => {
    try {
      await call('removeCategory', categoryId);
      getCategories();
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!currentUser || !currentUser.isSuperAdmin) {
    <Alert>You are not allowed to be here</Alert>;
    return null;
  }

  const handleCategoryInputChange = (value) => {
    if (specialCh.test(value)) {
      message.error('Special characters not allowed', 2);
      return;
    } else {
      setCategoryInput(value.toUpperCase());
    }
  };

  const pathname = history && history.location.pathname;

  return (
    <Template
      heading="Settings"
      leftContent={
        <Box pad="medium">
          <ListMenu list={adminMenu}>
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
        </Box>
      }
    >
      <Box pad="medium" background="white" margin={{ bottom: 'large' }}>
        <Heading level={3}>Organisation</Heading>
        <SettingsForm
          value={localSettings}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          formAltered={formAltered}
        />
      </Box>

      <Box pad="medium" background="white" margin={{ bottom: 'large' }}>
        <Heading level={3}>Categories</Heading>
        <Text>You can set categories here</Text>
        <Box pad="small" direction="row" gap="small" wrap justify="center">
          {categories.map((category) => (
            <Tag
              key={category.label}
              label={category.label.toUpperCase()}
              background={category.color}
              removable
              onRemove={() => removeCategory(category._id)}
              margin={{ bottom: 'small' }}
            />
          ))}
        </Box>
        <Form onSubmit={() => addNewCategory()}>
          <Box>
            <Box direction="row" gap="small" width="medium" alignSelf="center">
              <TextInput
                size="small"
                plain={false}
                value={categoryInput}
                placeholder="PAJAMAS"
                onChange={(event) =>
                  handleCategoryInputChange(event.target.value)
                }
              />
              <Button type="submit" label="Add" />
            </Box>
          </Box>
        </Form>
      </Box>

      <Box pad="medium" background="white" margin={{ bottom: 'medium' }}>
        <Heading level={3}>Wording</Heading>
        {/* <Form
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
              <TextInput plain={false} name="work" placeholder="work" />
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
            <Button type="submit" primary label="Confirm" />
          </Box>
        </Form> */}
      </Box>

      {/* <ConfirmModal
        visible={isDeleteModalOn}
        onConfirm={this.handleRemoveCategory}
        onCancel={this.closeDeleteModal}
        title="Confirm Delete"
      >
        Are you sure you want to delete this category?
      </ConfirmModal> */}
    </Template>
  );
};

Settings.contextType = StateContext;

export default Settings;
