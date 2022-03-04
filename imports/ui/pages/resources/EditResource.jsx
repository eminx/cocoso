import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React, { useState } from 'react';
import { Box, Center, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Resources from '/imports/api/resources/resource';

import { call } from '../../@/shared';
import { message } from '../../components/message';
import ConfirmModal from '../../components/ConfirmModal';

import NotFoundPage from '../NotFoundPage';
import Template from '../../components/Template';
import Breadcrumb from '../../components/Breadcrumb';
import ResourceForm from './components/ResourceForm';

function EditResourcePage({ resources, resource, resourcesForCombo, isLoading, history }) {
  const [ tc ] = useTranslation('common');
  const [ isDeleteModalOn, setIsDeleteModalOn ] = useState(false);
  
  const hideDeleteModal = () => setIsDeleteModalOn(false);
  const showDeleteModal = () => setIsDeleteModalOn(true);

  const deleteResource = async (resourceId) => {
    try {
      await call('deleteResource', resourceId);
      message.success(tc('message.success.remove', { domain: tc('domains.resource') }));
      history.push('/resources');
    } catch (error) {
      message.error(error.error || error.reason);
      console.log(error);
    }
  };


  if (typeof resource === 'undefined')  return <NotFoundPage domain="Resource with this name or id" />;

  return (
    <Template heading={tc('labels.update', { domain: tc('domains.resource') })}>
      <Breadcrumb domain={resource} domainKey="label" />
      <Box bg="white" p="6">
        {!isLoading 
          && <ResourceForm 
              resources={resources}
              defaultValues={resource} 
              isEditMode={true} 
              comboResources={resourcesForCombo} 
            />
        }
        
      </Box>

      <Center p="4">
        <Button
          colorScheme="red"
          size="sm"
          variant="ghost"
          onClick={showDeleteModal}
        >
          {tc('actions.remove')}
        </Button>
      </Center>

      <ConfirmModal
        visible={isDeleteModalOn}
        title={tc('modals.confirm.delete.title')}
        onConfirm={() => deleteResource(resource?._id)}
        onCancel={hideDeleteModal}
        confirmText={tc('modals.confirm.delete.yes')}
      >
        {tc('modals.confirm.delete.body', { domain: tc('domains.resource').toLowerCase() })}
      </ConfirmModal>
    </Template>
  );
}

export default EditResource = withTracker((props) => {
  const resourceId = props.match.params.resourceId;
  const handler = Meteor.subscribe('resources');
  if (!handler.ready()) return { resources: [], resource: {}, resourcesForCombo: [], isLoading: true };
  const resources =  Resources.find({}).fetch().reverse();
  const resource =  Resources.findOne(
    { _id: resourceId }, 
    { 
      fields: { 
        label: 1,
        description: 1,
        isCombo: 1,
        resourcesForCombo: 1
      },
    }
  );  
  const resourcesForCombo = resource?.resourcesForCombo;
  return { resources, resource, resourcesForCombo, isLoading: false };
})(EditResourcePage);


