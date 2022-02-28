import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useState, useContext } from 'react';
import { Box, Button, Center, Heading, Text } from '@chakra-ui/react';
import moment from 'moment';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

import NiceList from '../../components/NiceList';
import Template from '../../components/Template';
import ListMenu from '../../components/ListMenu';
import ResourcesForCombo from '../../components/ResourcesForCombo';
import { message } from '../../components/message';
import { call } from '../../@/shared';
import { StateContext } from '../../LayoutContainer';
import { adminMenu } from '../../@/constants/general';
import ResourceForm from '../../components/ResourceForm';
import ConfirmModal from '../../components/ConfirmModal';
import Resources from '../../../api/resources/resource';

moment.locale(i18n.language);

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
  const [ t ] = useTranslation('admin');
  const [ tc ] = useTranslation('common');

  const handleSubmit = async (values) => {
    if (!values.label || values.label.length < 3) {
      message.error(tc('message.valid.min', { field: 'resource name', min: '3' }));
      return;
    }
    if (
      !isEditMode &&
      resources.some(
        (resource) =>
          resource.label.toLowerCase() === defaultValues.label.toLowerCase()
      )
    ) {
      message.error(tc('message.exists', { domain: tc('domains.resource').toLowerCase(), property: tc('domains.props.name') }));
      return;
    }
    try {
      if (isEditMode) {
        await call('updateResource', values.id, values);
        message.success(tc('message.success.update', { domain: tc('domains.resource') }));
      } else {
        const parsedValues = {
          ...values,
          resourcesForCombo,
        };
        await call('createResource', parsedValues);
        message.success(tc('message.success.create', { domain: tc('domains.resource') }));
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
      message.success(tc('message.success.remove', { domain: tc('domains.resource') }));
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
        content: tc('actions.update'),
        handleClick: () => initiateEditDialog(resource),
        isDisabled:
          role !== 'admin' && resource.authorUsername !== currentUser.username,
      },
      {
        content: tc('actions.remove'),
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
      heading={t('resources.label')}
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
            textTransform="uppercase"
          >
            {tc('actions.create')}
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
                  {t('resources.cards.date', { 
                    username: resource && resource.authorUsername, 
                    date: moment(resource.creationDate).format('D MMM YYYY')
                  })}
                  <br />
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
