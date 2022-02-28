import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Resources from '/imports/api/resources/resource';

import Template from '../../components/Template';
import ResourceForm from '../../components/ResourceForm';

function EditResourcePage({ resource }) {
  const [ tc ] = useTranslation('common');
  return (
    <Template heading={tc('labels.update', { domain: tc('domains.resource') })}>
      <Center>
        <Link to={`/resources/${resource._id}`}>Back to resource</Link>
      </Center>
      <Box bg="white" p="6">
        <ResourceForm />
      </Box>
    </Template>
  );
}

export default EditResource = withTracker((props) => {
  const resourceId = props.match.params.id;
  const handler = Meteor.subscribe('resources');
  if (!handler.ready()) return { resource: {} };
  const resource =  Resources.findOne({ _id: resourceId });
  return { resource };
})(EditResourcePage);