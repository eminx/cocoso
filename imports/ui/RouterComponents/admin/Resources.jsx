import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useState, useContext } from 'react';
import { Box, Button, Center, Heading, Text } from '@chakra-ui/react';
import moment from 'moment';

import NiceList from '../../UIComponents/NiceList';
import Template from '../../UIComponents/Template';
import ListMenu from '../../UIComponents/ListMenu';
import ResourcesForCombo from '../../UIComponents/ResourcesForCombo';
import { message } from '../../UIComponents/message';
import { call } from '../../functions';
import { StateContext } from '../../LayoutContainer';
import { adminMenu } from '../../constants/general';
import ResourceForm from '../../UIComponents/ResourceForm';
import ConfirmModal from '../../UIComponents/ConfirmModal';

const resourceModel = {
  label: '',
  description: '',
  isCombo: false,
  resourcesForCombo: [],
};

function ResourcesPage({ history, resources, isLoading }) {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [defaultValues, setDefaultValues] = useState(resourceModel);
  const [resourcesForCombo, setResourcesForCombo] = useState([]);
  const { currentUser, canCreateContent, role } = useContext(StateContext);

  const handleSubmit = async (values) => {
    if (!values.label || values.label.length < 3) {
      message.error('Resource name is too short. Minimum 3 letters required');
      return;
    }
    if (
      !isEditMode &&
      resources.some(
        (resource) =>
          resource.label.toLowerCase() === defaultValues.label.toLowerCase()
      )
    ) {
      message.error('There already is a resource with this name');
      return;
    }
    try {
      if (isEditMode) {
        await call('updateResource', values.id, values);
        message.success('Resource successfully updated');
      } else {
        const parsedValues = {
          ...values,
          resourcesForCombo,
        };
        await call('createResource', parsedValues);
        message.success('Resource successfully added');
      }
      closeModal();
    } catch (error) {
      console.log(error);
      message.error(error.reason || error.error);
    }
  };

  const initiateEditDialog = (resource) => {
    setDefaultValues({
      label: resource.label,
      description: resource.description,
      isCombo: resource.isCombo,
      resourcesForCombo: resource.resourcesForCombo,
      id: resource._id,
    });
    setResourcesForCombo(resource.resourcesForCombo);
    setIsEditMode(true);
    setShowModal(true);
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

  const handleAddResourceForCombo = ({ target }) => {
    const { value } = target;
    const selectedResource = resources.find((r) => r._id === value);
    setResourcesForCombo([...resourcesForCombo, selectedResource]);
  };

  const handleRemoveResourceForCombo = (res) => {
    const newResourcesForCombo = resourcesForCombo.filter(
      (resource) => res.label !== resource.label
    );
    setResourcesForCombo(newResourcesForCombo);
  };

  const getSuggestions = () => {
    return resources.filter((res, index) => {
      return (
        !res.isCombo && !resourcesForCombo.some((r) => r.label === res.label)
      );
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setDefaultValues(resourceModel);
    setResourcesForCombo([]);
  };

  return (
    <Template
      heading="Resources"
      leftContent={
        <Box p="4">
          <ListMenu pathname={pathname} list={adminMenu} />
        </Box>
      }
    >
      {canCreateContent && (
        <Center w="100%" mb="4">
          <Button
            colorScheme="green"
            variant="outline"
            onClick={() => {
              setShowModal(true);
            }}
          >
            NEW
          </Button>
        </Center>
      )}

      <Box p="4" mb="8">
        <NiceList itemBg="white" list={resourcesWithActions}>
          {(resource) => (
            <Box bg="white" mb="2" p="2" key={resource.label}>
              <Heading size="md" fontWeight="bold">
                {resource.isCombo ? (
                  <ResourcesForCombo resource={resource} />
                ) : (
                  resource.label
                )}
              </Heading>

              <Text as="div" my="2">
                {resource && resource.description}
              </Text>
              <Box py="2">
                <Text as="div" fontSize="xs">
                  added by {resource && resource.authorUsername} on{' '}
                  {moment(resource.creationDate).format('Do MMM YYYY')} <br />
                </Text>
              </Box>
            </Box>
          )}
        </NiceList>

        <ConfirmModal
          hideFooter
          visible={showModal}
          onCancel={() => closeModal()}
        >
          <ResourceForm
            defaultValues={defaultValues}
            isEditMode={isEditMode}
            resourcesForCombo={resourcesForCombo}
            suggestions={getSuggestions()}
            onSubmit={handleSubmit}
            onAddResourceForCombo={handleAddResourceForCombo}
            onRemoveResourceForCombo={handleRemoveResourceForCombo}
          />
        </ConfirmModal>
      </Box>
    </Template>
  );
}

export default ResourcesContainer = withTracker((props) => {
  const resourcesSubscription = Meteor.subscribe('resources');
  const resources = Resources.find().fetch().reverse();
  const isLoading = !resourcesSubscription.ready();
  const currentUser = Meteor.user();

  return {
    isLoading,
    currentUser,
    resources,
  };
})(ResourcesPage);
