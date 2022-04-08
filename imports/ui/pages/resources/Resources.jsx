import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  List,
  ListItem,
  Select,
  Text,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import { call } from '../../@/shared';
import { message } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import Template from '../../components/Template';
import Breadcrumb from '../../components/Breadcrumb';
import ResourceCard from './components/ResourceCard';

function ResourcesPage() {
  const { currentUser, currentHost, canCreateContent } =
    useContext(StateContext);
  const [resources, setResources] = useState([]);
  const [filterWord, setFilterWord] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [isLoading, setIsLoading] = useState(true);
  const [t] = useTranslation('resources');
  const [tc] = useTranslation('common');

  useEffect(() => {
    getResources();
  }, []);

  const getResources = async () => {
    try {
      const response = await call('getResources');
      setResources(response);
      setIsLoading(false);
    } catch (error) {
      message.error(error.reason);
      setIsLoading(false);
    }
  };

  const resourcesFiltered = resources?.filter((resource) => {
    const lowerCaseFilterWord = filterWord?.toLowerCase();
    if (!resource.label) {
      return false;
    }
    return resource.label.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;
  });

  const resourcesFilteredAndSorted = resourcesFiltered.sort((a, b) => {
    if (sortBy === 'name') {
      return a.label.localeCompare(b.label);
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <Template>
      <Helmet>
        <title>{`${tc('domains.resources')} | ${currentHost.settings.name} | ${
          Meteor.settings.public.name
        }`}</title>
      </Helmet>
      {canCreateContent && (
        <Center w="100%" mb="4">
          <Link to={currentUser ? '/resources/new' : '/my-profile'}>
            <Button
              as="span"
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

      {resources.length == 0 && (
        <Center>
          <Heading size="md" fontWeight="bold">
            {t('messages.notfound')}
          </Heading>
        </Center>
      )}

      <Center p="4" pb="0">
        <Box>
          <Input
            bg="white"
            placeholder={t('form.holder')}
            size="sm"
            value={filterWord}
            onChange={(event) => setFilterWord(event.target.value)}
          />
        </Box>
      </Center>

      <Center p="4">
        <Box>
          <Text fontSize="sm" mb="2" textAlign="center">
            {tc('labels.sortBy.placeholder')}
          </Text>
          <Select
            bg="white"
            size="sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">{tc('labels.sortBy.date')}</option>
            <option value="name">{tc('labels.sortBy.name')}</option>
          </Select>
        </Box>
      </Center>

      {!isLoading && (
        <Box p="4" mb="8">
          <List>
            {resourcesFilteredAndSorted.map((resource, index) => (
              <ListItem key={'resource-' + index}>
                <Link to={`/resources/${resource?._id}`}>
                  <ResourceCard resource={resource} />
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Template>
  );
}

export default ResourcesPage;
