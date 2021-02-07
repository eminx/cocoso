import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useState, useContext } from 'react';
import {
  Anchor,
  Box,
  Button,
  Form,
  FormField,
  Heading,
  Layer,
  Text,
  TextArea,
  TextInput,
} from 'grommet';
import { FormAdd } from 'grommet-icons/icons/FormAdd';
import moment from 'moment';

import NiceList from '../../UIComponents/NiceList';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';
import ListMenu from '../../UIComponents/ListMenu';
import { message, Alert } from '../../UIComponents/message';
import { call } from '../../functions';
import { StateContext } from '../../LayoutContainer';
import { adminMenu } from '../../constants/general';

function ResourcesPage({ history, resources, isLoading }) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const { currentUser, currentHost, canCreateContent, role } = useContext(
    StateContext
  );

  if (isLoading) {
    return <Loader />;
  }

  const handleSubmit = async () => {
    if (modalContent.label.length < 3) {
      message.error('Resource name is too short. Minimum 3 letters required');
      return;
    }
    if (
      !modalContent.edit &&
      resources.some((resource) => resource.label === modalContent.label)
    ) {
      message.error('There already is a resource with this name');
      return;
    }
    try {
      if (modalContent.edit) {
        const value = {
          label: modalContent.label,
          description: modalContent.description,
        };
        await call('updateResource', modalContent.id, value);
        message.success('Resource successfully updated');
      } else {
        await call('createResource', modalContent);
        message.success('Resource successfully added');
      }
      setModalContent(null);
      setShowModal(false);
    } catch (error) {
      console.log(error);
      message.error(error.reason || error.error);
    }
  };

  const initiateEditDialog = (resource) => {
    setShowModal(true);
    setModalContent({
      label: resource.label,
      description: resource.description,
      id: resource._id,
      edit: true,
    });
  };

  const deleteResource = async (resourceId) => {
    try {
      await call('deleteResource', resourceId);
      message.success('Resource successfully deleted');
    } catch (error) {
      message.error(error.error || error.reason);
      console.log(error);
    }
  };

  const pathname = history && history.location.pathname;

  const resourcesWithActions = resources.map((resource) => ({
    ...resource,
    actions: [
      {
        content: 'Edit',
        handleClick: () => initiateEditDialog(resource),
        isDisabled:
          role !== 'admin' && resource.authorUsername !== currentUser.username,
      },
      {
        content: 'Delete',
        handleClick: () => deleteResource(resource._id),
        isDisabled:
          role !== 'admin' && resource.authorUsername !== currentUser.username,
      },
    ],
  }));

  return (
    <Template
      heading="Resources"
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
      {canCreateContent && (
        <Box
          direction="row"
          justify="center"
          width="100%"
          margin={{ bottom: 'medium' }}
        >
          <Button
            size="small"
            label="NEW"
            primary
            icon={<FormAdd />}
            onClick={() => {
              setShowModal(true);
              setModalContent(null);
            }}
          />
        </Box>
      )}

      <Box pad="medium" background="white" margin={{ bottom: 'large' }}>
        <NiceList list={resourcesWithActions} border="horizontal" pad="small">
          {(resource) => (
            <div key={resource.label}>
              <Text size="large" weight="bold" margin={{ bottom: 'medium' }}>
                {resource && resource.label}
              </Text>

              <Text as="div">{resource && resource.description}</Text>
              <Box pad={{ vertical: 'small' }}>
                <Text as="div" style={{ fontSize: 12 }}>
                  added by {resource && resource.authorUsername}
                </Text>
                <Text as="div" style={{ fontSize: 12 }}>
                  {moment(resource.creationDate).format('Do MMM YYYY')} <br />
                </Text>
              </Box>
            </div>
          )}
        </NiceList>

        {showModal && (
          <Layer
            onEsc={() => setShowModal(false)}
            onClickOutside={() => setShowModal(false)}
          >
            <Box width="medium" pad="medium">
              <Form
                value={modalContent}
                onChange={(nextValue) => setModalContent(nextValue)}
                onSubmit={handleSubmit}
              >
                <FormField
                  label="Name"
                  margin={{ bottom: 'medium', top: 'medium' }}
                >
                  <TextInput
                    plain={false}
                    name="label"
                    placeholder="Sound studio..."
                  />
                </FormField>

                <FormField
                  label="Description"
                  margin={{ bottom: 'medium', top: 'medium' }}
                >
                  <TextArea
                    plain={false}
                    name="description"
                    placeholder="Using studio requires care..."
                  />
                </FormField>

                <Box direction="row" justify="end" pad="small">
                  <Button type="submit" primary label="Confirm" />
                </Box>
              </Form>
              <Box direction="row" justify="center" pad="small">
                <Button
                  secondary
                  label="close"
                  size="small"
                  onClick={() => setShowModal(false)}
                />
              </Box>
            </Box>
          </Layer>
        )}
      </Box>
    </Template>
  );
}

export default ResourcesContainer = withTracker((props) => {
  const resourcesSubscription = Meteor.subscribe('resources');
  const resources = Resources.find().fetch();
  const isLoading = !resourcesSubscription.ready();
  const currentUser = Meteor.user();

  return {
    isLoading,
    currentUser,
    resources,
  };
})(ResourcesPage);
