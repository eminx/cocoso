import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Heading, Text, Button, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import moment from 'moment';

import Resources from '/imports/api/resources/resource';

import NotFoundPage from '../NotFoundPage';
import Template from '../../components/Template';
import ResourcesForCombo from './components/ResourcesForCombo';

function ResourcePage({ resource }) {
  const [ t ] = useTranslation('admin');
  const [ tc ] = useTranslation('common');

  if (typeof resource === 'undefined')  return <NotFoundPage domain="Resource with this name or id" />;

  return (
    <Template>
      <Center>
        <Link to={`/resources`}>Back to resources</Link>
      </Center>
      <Box bg="white" mb="2" p="2" key={resource?.label}>
        <Heading size="md" fontWeight="bold">
          {resource?.isCombo ? (
            <ResourcesForCombo resource={resource} />
          ) : (
            resource?.label
          )}
        </Heading>
        <Text as="div" my="2">
          {resource && resource?.description}
        </Text>
        <Box py="2">
          <Text as="div" fontSize="xs">
            {t('resources.cards.date', { 
              username: resource && resource?.authorUsername, 
              date: moment(resource?.creationDate).format('D MMM YYYY')
            })}
            <br />
          </Text>
        </Box>
      </Box>
      <Center my="2">
        <Link to={`/resources/${resource?._id}/edit`}>
          <Button size="sm" variant="ghost">
            {tc('actions.update')}
          </Button>
        </Link>
      </Center>
    </Template>
  );
}

export default Resource = withTracker((props) => {
  const resourceId = props.match.params.id;
  const handler = Meteor.subscribe('resources');
  if (!handler.ready()) return { resource: {}, isLoading: true };
  const resource =  Resources.findOne({ _id: resourceId });
  return { resource };
})(ResourcePage);
