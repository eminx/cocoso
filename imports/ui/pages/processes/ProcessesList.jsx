import { Meteor } from 'meteor/meteor';
import React, { useState, useContext } from 'react';
import moment from 'moment';
import i18n from 'i18next';
import { Link } from 'react-router-dom';

import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Text,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import Loader from '../../components/Loader';
import NiceList from '../../components/NiceList';
import Template from '../../components/Template';
import { message } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import compareForSort from '../../utils/shared';
import GridThumb from '../../components/GridThumb';

moment.locale(i18n.language);

const publicSettings = Meteor.settings.public;

export default function ProcessesList({ isLoading, currentUser, processes, t, tc }) {
  const [filterBy, setFilterBy] = useState(0);
  const { canCreateContent, currentHost } = useContext(StateContext);

  const filterOptions = [
    {
      label: t('tabs.active'),
      value: 'active',
    },
    {
      label: t('tabs.members'),
      value: 'my-processes',
    },
    {
      label: t('tabs.archived'),
      value: 'archived',
    },
  ];

  const archiveProcess = (processId) => {
    Meteor.call('archiveProcess', processId, (error, respond) => {
      if (error) {
        message.error(error.error);
      } else {
        message.success(t('message.archived'));
      }
    });
  };

  const unarchiveProcess = (processId) => {
    Meteor.call('unarchiveProcess', processId, (error, respond) => {
      if (error) {
        message.error(error.reason);
      } else {
        message.success(t('message.unarchived'));
      }
    });
  };

  const getFilteredProcesses = () => {
    if (!processes) {
      return [];
    }

    const filteredProcesses = processes.filter((process) => {
      if (filterBy === 2) {
        return process.isArchived === true;
      } else if (filterBy === 1) {
        return currentUser && process.members.some((member) => member.memberId === currentUser._id);
      }
      return !process.isArchived;
    });

    const filteredProcessesWithAccessFilter = parseOnlyAllowedProcesses(filteredProcesses);
    return filteredProcessesWithAccessFilter;
  };

  const parseOnlyAllowedProcesses = (futureProcesses) => {
    const futureProcessesAllowed = futureProcesses.filter((process) => {
      if (!process.isPrivate) {
        return true;
      }
      if (!currentUser) {
        return false;
      }
      const currentUserId = currentUser._id;
      return (
        process.adminId === currentUserId ||
        process.members.some((member) => member.memberId === currentUserId) ||
        process.peopleInvited.some((person) => person.email === currentUser.emails[0].address)
      );
    });

    return futureProcessesAllowed;
  };

  const processesRendered = getFilteredProcesses().sort(compareForSort).reverse();

  return (
    <Box w="100%">
      <Helmet>
        <title>{`${tc('domains.processes')} | ${currentHost.settings.name} | ${
          publicSettings.name
        }`}</title>
      </Helmet>
      <Box>
        {canCreateContent && (
          <Center mb="4">
            <Link to={currentUser ? '/new-process' : '/my-profile'}>
              <Button as="span" colorScheme="green" variant="outline" textTransform="uppercase">
                {tc('actions.create')}
              </Button>
            </Link>
          </Center>
        )}
        <Box p="4">
          <Tabs onChange={(index) => setFilterBy(index)}>
            <Center>
              <TabList>
                {filterOptions.map((option) => (
                  <Tab key={option.value}>{option.label}</Tab>
                ))}
              </TabList>
            </Center>
            <TabPanels>
              {filterOptions.map((option) => (
                <TabPanel key={option.value}>
                  <SimpleGrid columns={[1, 1, 2, 2]} spacing={3} w="100%">
                    {processesRendered.map((process) => (
                      <Link key={process._id} to={`/process/${process._id}`}>
                        <GridThumb image={process.imageUrl} large title={process.title}>
                          {moment(process.creationDate).format('D MMM YYYY')}
                        </GridThumb>
                      </Link>
                    ))}
                  </SimpleGrid>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Box>
  );
}

function ProcessItem({ process }) {
  return (
    <Flex bg="white" m="2" __hover={{ cursor: 'pointer' }}>
      <Box w="100%" p="4" flexBasis="70%">
        <Heading size="md" fontWeight="bold">
          {itemType === 'resource' && gridItem.isCombo ? (
            <ResourcesForCombo resource={gridItem} />
          ) : (
            gridItem?.label
          )}
        </Heading>
        <Spacer my="4" />
        <Text as="p" fontSize="xs" alignSelf="flex-end">
          {moment(gridItem.createdAt).format('D MMM YYYY')}
        </Text>
      </Box>

      {thumbHasImage && (
        <Box flexBasis="200px">
          <Image alt={alt} fit="cover" mr="2" src={gridItem.images[0]} w="xs" h="150px" />
        </Box>
      )}
    </Flex>
  );
  return (
    <Flex mb="4" p="2" w="100%" __hover={{ cursor: 'pointer' }}>
      <Box mr="2">
        <Image w="xs" fit="cover" src={process.imageUrl} />
      </Box>
      <Box w="100%">
        <Box>
          <Heading size="md">{process.title}</Heading>
          <Text fontSize="lg" fontWeight="light">
            {process.readingMaterial}
          </Text>
        </Box>

        <Box p="2">
          <Text textAlign="right">{process.adminUsername}</Text>
          <Text fontSize="sm" textAlign="right">
            {moment(process.creationDate).format('D MMM YYYY')}
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
