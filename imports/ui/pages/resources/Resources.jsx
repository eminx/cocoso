import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Text,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import { call } from '../../@/shared';
import { message } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import Breadcrumb from '../../components/Breadcrumb';
import ResourceCard from './components/ResourceCard';
import Loader from '../../components/Loader';

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

  if (isLoading) {
    return <Loader />;
  }
  const resourcesFiltered = resources?.filter((resource) => {
    const lowerCaseFilterWord = filterWord?.toLowerCase();
    if (!resource.label) {
      return false;
    }
    return (
      resource.label.toLowerCase().indexOf(lowerCaseFilterWord) !== -1 ||
      (resource.isCombo &&
        resource.resourcesForCombo.some(
          (r) => r.label.toLowerCase().indexOf(lowerCaseFilterWord) !== -1
        ))
    );
  });

  const resourcesFilteredAndSorted = resourcesFiltered.sort((a, b) => {
    if (sortBy === 'name') {
      return a.label.localeCompare(b.label);
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <Box width="100%" mb="100px">
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
      {/* <Breadcrumb /> */}

      {resources.length == 0 && (
        <Center>
          <Heading size="md" fontWeight="bold">
            {t('messages.notfound')}
          </Heading>
        </Center>
      )}

      <Tabs size="sm">
        <Box p="4" bg="gray.50">
          <Flex justify="center" align="center" mb="4">
            <TabList>
              <Tab key="All">All</Tab>
              <Tab key="All">Combo</Tab>
              <Tab key="All">Non-combo</Tab>
            </TabList>

            <Box ml="4">
              <Input
                bg="white"
                placeholder={t('form.holder')}
                size="sm"
                value={filterWord}
                onChange={(event) => setFilterWord(event.target.value)}
              />
            </Box>
          </Flex>

          <Center>
            <Box display="flex" alignItems="center">
              <Text fontSize="sm" mr="2" textAlign="center" w="fit-content">
                {tc('labels.sortBy.placeholder')}
              </Text>
              <Select
                bg="white"
                size="sm"
                w="fit-content"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">{tc('labels.sortBy.date')}</option>
                <option value="name">{tc('labels.sortBy.name')}</option>
              </Select>
            </Box>
          </Center>
        </Box>
        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={[1, 1, 2, 3]} spacing={3} w="100%">
              {resourcesFilteredAndSorted.map((resource, index) => (
                <ResourceItem key={resource._id} resource={resource} />
              ))}
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <SimpleGrid columns={[1, 1, 2, 3]} spacing={3} w="100%">
              {resourcesFilteredAndSorted
                .filter((r) => r.isCombo)
                .map((resource, index) => (
                  <ResourceItem key={resource._id} resource={resource} />
                ))}
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <SimpleGrid columns={[1, 1, 2, 3]} spacing={3} w="100%">
              {resourcesFilteredAndSorted
                .filter((r) => !r.isCombo)
                .map((resource, index) => (
                  <ResourceItem key={resource._id} resource={resource} />
                ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

function ResourceItem({ resource }) {
  if (!resource) {
    return null;
  }
  return (
    <Box key={resource._id}>
      <Link to={`/resources/${resource._id}`}>
        <ResourceCard resource={resource} isThumb="true" />
      </Link>
    </Box>
  );
}

export default ResourcesPage;
