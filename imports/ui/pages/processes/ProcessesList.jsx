import { Meteor } from 'meteor/meteor';
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import i18n from 'i18next';
import { Link } from 'react-router-dom';

import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import Header from '../../components/Header';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import { StateContext } from '../../LayoutContainer';
import { call, compareForSort } from '../../utils/shared';
import NewGridThumb from '../../components/NewGridThumb';
import { message } from '../../components/message';

moment.locale(i18n.language);

const publicSettings = Meteor.settings.public;

export default function ProcessesList({ isLoading, currentUser, t, tc }) {
  const [processes, setProcesses] = useState([]);
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

  useEffect(() => {
    getProcesses();
  }, []);

  const getProcesses = async () => {
    try {
      const allProcesses = await call('getProcesses');
      setProcesses(allProcesses);
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    }
  };

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

  const processesRendered =
    processes && processes.length > 0 && getFilteredProcesses().sort(compareForSort).reverse();

  return (
    <Box w="100%">
      <Helmet>
        <title>{`${tc('domains.processes')} | ${currentHost.settings.name} | ${
          publicSettings.name
        }`}</title>
      </Helmet>

      <Header />

      <Box>
        {canCreateContent && (
          <Center>
            <Link to={currentUser ? '/processes/new' : `/@${currentUser.username}/profile`}>
              <Button as="span" colorScheme="green" variant="outline" textTransform="uppercase">
                {tc('actions.create')}
              </Button>
            </Link>
          </Center>
        )}
        <Box p="4">
          <Center>
            <Tabs size="sm" onChange={(index) => setFilterBy(index)}>
              <TabList>
                {filterOptions.map((option) => (
                  <Tab _focus={{ boxShadow: 'none' }} key={option.value}>
                    {option.label}
                  </Tab>
                ))}
              </TabList>
            </Tabs>
          </Center>

          {processesRendered && processesRendered.length > 0 && (
            <Paginate items={processesRendered}>
              {(process) => (
                <WrapItem key={process._id}>
                  <Link to={`/processes/${process._id}`}>
                    <NewGridThumb
                      imageUrl={process.imageUrl}
                      subTitle={process.readingMaterial}
                      title={process.title}
                    />
                  </Link>
                </WrapItem>
              )}
            </Paginate>
          )}
        </Box>
      </Box>
    </Box>
  );
}
