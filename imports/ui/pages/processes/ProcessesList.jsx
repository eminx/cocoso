import { Meteor } from 'meteor/meteor';
import React, { useState, useContext } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
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
import { compareForSort } from '../../@/shared';

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
        return (
          currentUser &&
          process.members.some((member) => member.memberId === currentUser._id)
        );
      } else {
        return !process.isArchived;
      }
    });

    const filteredProcessesWithAccessFilter =
      parseOnlyAllowedProcesses(filteredProcesses);
    return filteredProcessesWithAccessFilter;
  };

  const parseOnlyAllowedProcesses = (futureProcesses) => {
    const futureProcessesAllowed = futureProcesses.filter((process) => {
      if (!process.isPrivate) {
        return true;
      } else {
        if (!currentUser) {
          return false;
        }
        const currentUserId = currentUser._id;
        return (
          process.adminId === currentUserId ||
          process.members.some((member) => member.memberId === currentUserId) ||
          process.peopleInvited.some(
            (person) => person.email === currentUser.emails[0].address
          )
        );
      }
    });

    return futureProcessesAllowed;
  };

  const renderResults = () => {
    const processesFilteredAndSorted =
      getFilteredProcesses().sort(compareForSort);
    const processesList = processesFilteredAndSorted.map((process) => ({
      ...process,
      actions: [
        {
          content: process.isArchived ? t('labels.unarchived') : t('labels.archived'),
          handleClick: process.isArchived
            ? () => unarchiveProcess(process._id)
            : () => archiveProcess(process._id),
          isDisabled:
            !currentUser ||
            (process.adminId !== currentUser._id && !currentUser.isSuperAdmin),
        },
      ],
    }));

    return processesList;
  };

  return (
    <Template>
      <Helmet>
        <title>{`Processes | ${currentHost.settings.name} | ${publicSettings.name}`}</title>
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
                  <NiceList
                    actionsDisabled={!currentUser || !canCreateContent}
                    border={false}
                    itemBg="white"
                    list={renderResults().reverse()}
                  >
                    {(process) => (
                      <Link to={`/process/${process._id}`}>
                        <ProcessItem process={process} />
                      </Link>
                    )}
                  </NiceList>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Template>
  );
}

function ProcessItem({ process }) {
  return (
    <Flex mb="4" p="2" w="100%" __hover={{ cursor: 'pointer' }}>
      <Box mr="2">
        <Image w="sm" fit="cover" src={process.imageUrl} />
      </Box>
      <Box w="100%">
        <Box>
          <Heading size="lg">{process.title}</Heading>
          <Text fontSize="lg" fontWeight="light">
            {process.readingMaterial}
          </Text>
        </Box>

        <Box p="2">
          <Text textAlign="right">{process.adminUsername}</Text>
          <Text fontSize="sm" textAlign="right">
            {moment(process.creationDate).format('Do MMM YYYY')}
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
