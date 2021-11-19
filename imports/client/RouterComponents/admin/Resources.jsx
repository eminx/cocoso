import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useState, useContext } from 'react';
import { Layer } from 'grommet';
import { Box, Button, Center, Text } from '@chakra-ui/react';
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

const emptyResource = {
  label: '',
  description: '',
  isCombo: false,
  resourcesForCombo: [],
};

function ResourcesPage({ history, resources, isLoading }) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [comboInput, setComboInput] = useState('');
  const { currentUser, currentHost, canCreateContent, role } =
    useContext(StateContext);

  const handleSubmit = async () => {
    if (!modalContent.label || modalContent.label.length < 3) {
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
        const values = {
          label: modalContent.label,
          description: modalContent.description,
          isCombo: Boolean(modalContent.isCombo),
          resourcesForCombo: modalContent.resourcesForCombo,
        };
        await call('updateResource', modalContent.id, values);
        message.success('Resource successfully updated');
      } else {
        const values = {
          label: modalContent.label,
          description: modalContent.description,
          isCombo: Boolean(modalContent.isCombo),
          resourcesForCombo: modalContent.resourcesForCombo,
        };
        await call('createResource', values);
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
      isCombo: resource.isCombo,
      resourcesForCombo: resource.resourcesForCombo,
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

  const handleComboResourceSelection = ({ event, suggestion }) => {
    setComboInput('');
    setModalContent({
      ...modalContent,
      resourcesForCombo: [...modalContent.resourcesForCombo, suggestion],
    });
  };

  const removeResourceForCombo = (res) => {
    const newResourcesForCombo =
      modalContent &&
      modalContent.resourcesForCombo.filter(
        (resource) => res.label !== resource.label
      );
    setModalContent({
      ...modalContent,
      resourcesForCombo: newResourcesForCombo,
    });
  };

  const suggestions = () => {
    if (!modalContent || !modalContent.isCombo) {
      return null;
    }

    return resources.filter((res, index) => {
      return (
        !res.isCombo &&
        !modalContent.resourcesForCombo.some(
          (reso) => reso.label === res.label
        ) &&
        (comboInput === '' ||
          res.label.toLowerCase().includes(comboInput.toLowerCase()))
      );
    });
  };

  return (
    <Template
      heading="Resources"
      leftContent={
        <Box p="2">
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
              setModalContent(emptyResource);
            }}
          >
            NEW
          </Button>
        </Center>
      )}

      <Box p="4" mb="8">
        <NiceList list={resourcesWithActions}>
          {(resource) => (
            <Box p="4" bg="white" mb="2" key={resource.label}>
              <Text fontSize="lg" fontWeight="bold">
                {resource.isCombo ? (
                  <ResourcesForCombo resource={resource} />
                ) : (
                  resource.label
                )}
              </Text>

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

        {showModal && (
          <Layer
            onEsc={() => setShowModal(false)}
            onClickOutside={() => setShowModal(false)}
          >
            <ResourceForm
              content={modalContent}
              setContent={setModalContent}
              suggestions={suggestions()}
              comboInput={comboInput}
              setComboInput={setComboInput}
              onSuggestionSelect={handleComboResourceSelection}
              removeResourceForCombo={removeResourceForCombo}
              onSubmit={handleSubmit}
            />
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
