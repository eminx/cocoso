import { Meteor } from 'meteor/meteor';
import React, { useState, useContext } from 'react';
import moment from 'moment';
import i18n from 'i18next';
import { Link } from 'react-router-dom';

import { Box, Button, Center, Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import { StateContext } from '../../LayoutContainer';
import { compareForSort } from '../../utils/shared';
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

  const getFilteredProcesses = () => {
    if (!processes) {
      return <Loader />;
    }

    const filteredProcesses = processes.filter((process) => {
      if (filterBy === 2) {
        return process.isArchived;
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
                  <Paginate
                    items={processesRendered}
                    grid={{ columns: [1, 1, 2, 3], spacing: 3, w: '100%' }}
                  >
                    {(process) => (
                      <Link key={process._id} to={`/process/${process._id}`}>
                        <GridThumb image={process.imageUrl} large title={process.title}>
                          {moment(process.creationDate).format('D MMM YYYY')}
                        </GridThumb>
                      </Link>
                    )}
                  </Paginate>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Box>
  );
}
