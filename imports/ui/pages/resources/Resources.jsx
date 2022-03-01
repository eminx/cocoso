import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import moment from 'moment';

import { Box, Button, Center, Heading, Text } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import ResourcesCollection from '/imports/api/resources/resource';

import { StateContext } from '../../LayoutContainer';
import NiceList from '../../components/NiceList';
import Template from '../../components/Template';
import ResourcesForCombo from './components/ResourcesForCombo';

moment.locale(i18n.language);

const publicSettings = Meteor.settings.public;

function ResourcesPage({ resources, isLoading }) {

  const { currentUser, canCreateContent, role, currentHost } = useContext(StateContext);
  const [ t ] = useTranslation('admin');
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

      <Box p="4" mb="8">
        {!isLoading &&
          <NiceList itemBg="white" list={resources} actionsDisabled={true}>
            {(resource) => (
              <Link to={`/resources/${resource._id}`}>
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
              </Link>
            )}
          </NiceList>
        }
      </Box>
    </Template>
  );
}

export default Resources = withTracker(() => {
  const handler = Meteor.subscribe('resources');
  if (!handler.ready()) return { resources: [], isLoading: true };
  const resources =  ResourcesCollection.find({}).fetch().reverse();
  return { resources, isLoading: false };
})(ResourcesPage);
