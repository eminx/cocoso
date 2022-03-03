import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Resources from '/imports/api/resources/resource';

import Template from '../../components/Template';
import ResourceForm from './components/ResourceForm';

function NewResourcePage({ resources, isLoading, history }) {
  const [ tc ] = useTranslation('common');
  
  const resourceModel = {
    _id: '',
    label: '',
    description: '',
    isCombo: false,
    resourcesForCombo: [],
  };

  return (
    <Template heading={tc('labels.create', { domain: tc('domains.resource') })}>
      <Center>
        <Link to={`/resources`}>Back to resources</Link>
      </Center>
      <Box bg="white" p="6">
        {!isLoading 
          && <ResourceForm 
              resources={resources}
              defaultValues={resourceModel}
              isEditMode={false}
              comboResources={resourceModel.resourcesForCombo} 
              history={history}
            />
        }
      </Box>
    </Template>
  );
}

export default NewResource = withTracker(() => {
  const handler = Meteor.subscribe('resources');
  if (!handler.ready()) return { resources: [], isLoading: true };
  const resources =  Resources.find({ }, { fields: { label: 1 }}).fetch().reverse();
  return { resources, isLoading: false };
})(NewResourcePage);