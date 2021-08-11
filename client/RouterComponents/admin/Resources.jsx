import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState, useContext } from 'react';
import {
  Anchor,
  Box,
  Button,
  CheckBox,
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
import Tag from '../../UIComponents/Tag';
import ResourcesForCombo from '../../UIComponents/ResourcesForCombo';
import { message, Alert } from '../../UIComponents/message';
import { call } from '../../functions';
import { StateContext } from '../../LayoutContainer';
import { adminMenu } from '../../constants/general';
import ResourceForm from '../../UIComponents/ResourceForm';

const rModel = (r) => ({
  label: r.label,
  value: r._id,
});

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

  // useEffect(() => {
  //   if (!modalContent) {
  //     return;
  //   }
  //   if (modalContent.isCombo && modalContent.res) {
  //     modalContent.resourcesForCombo = resources
  //       .map(rModel)
  //       .filter((res) => !res.isCombo);
  //   } else {
  //     modalContent.resourcesForCombo = null;
  //   }
  // }, [modalContent.isCombo]);

  // if (isLoading) {
  //   return <Loader />;
  // }

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
            onClick={() => {
              setShowModal(true);
              setModalContent(emptyResource);
            }}
          />
        </Box>
      )}

      <Box pad="medium" background="white" margin={{ bottom: 'large' }}>
        <NiceList list={resourcesWithActions} border="horizontal" pad="small">
          {(resource) => (
            <div key={resource.label}>
              {resource.isCombo && (
                <Box>
                  <Tag label="COMBO" size="small" />
                </Box>
              )}
              <Text size="large" weight="bold" margin={{ bottom: 'medium' }}>
                {resource.isCombo ? (
                  <ResourcesForCombo resource={resource} />
                ) : (
                  resource.label
                )}
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
