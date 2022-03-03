import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Resources from '/imports/api/resources/resource';

import NotFoundPage from '../NotFoundPage';
import Template from '../../components/Template';
import Breadcrumb from '../../components/Breadcrumb';
import ResourceCard from './components/ResourceCard';

function ResourcePage({ resource }) {
  const [ tc ] = useTranslation('common');

  if (typeof resource === 'undefined')  return <NotFoundPage domain="Resource with this name or id" />;

  return (
    <Template>
      <Breadcrumb domain={resource} domainKey="label" />
      <ResourceCard resource={resource}/>
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
