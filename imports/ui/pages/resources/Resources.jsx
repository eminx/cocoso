import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import moment from 'moment';

import { Box, Button, Center, Heading, List, ListItem } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import ResourcesCollection from '/imports/api/resources/resource';

import { StateContext } from '../../LayoutContainer';
import Template from '../../components/Template';
import Breadcrumb from '../../components/Breadcrumb';
import ResourceCard from './components/ResourceCard';

moment.locale(i18n.language);

const publicSettings = Meteor.settings.public;

function ResourcesPage({ resources, isLoading }) {

  const { currentUser, canCreateContent, currentHost } = useContext(StateContext);
  const [ tc ] = useTranslation('common');

  return (
    <Template>
      <Helmet>
        <title>{`${tc('domains.resources')} | ${currentHost.settings.name} | ${publicSettings.name}`}</title>
      </Helmet>
      {canCreateContent && (
        <Center w="100%" mb="4">
          <Link to={currentUser ? '/resources/new' : '/my-profile'}>
            <Button
              colorScheme="green"
              variant="outline"
              textTransform="uppercase"
            >
              {tc('actions.create')}
            </Button>
          </Link>
        </Center>
      )}
      <Breadcrumb />
      {resources.length == 0 && 
        <Center>
          <Heading size="md" fontWeight="bold">
            No resource published yet.
          </Heading>
        </Center>
      }
      {!isLoading &&
        <Box p="4" mb="8">
          <List>
            {resources.map((resource, index) => (
              <ListItem key={'resource-'+index}>
                <Link to={`/resources/${resource?._id}`}>
                  <ResourceCard resource={resource}/>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      }
    </Template>
  );
}

export default Resources = withTracker(() => {
  const handler = Meteor.subscribe('resources');
  if (!handler.ready()) return { resources: [], isLoading: true };
  const resources =  ResourcesCollection.find({}).fetch().reverse();
  return { resources, isLoading: false };
})(ResourcesPage);
