import { Meteor } from 'meteor/meteor';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Center, Flex, Input, Select, WrapItem } from '@chakra-ui/react';
import moment from 'moment';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import { StateContext } from '../../LayoutContainer';
import { call, compareForSort } from '../../utils/shared';
import NewGridThumb from '../../components/NewGridThumb';
import { message } from '../../components/message';
import Tabs from '../../components/Tabs';
import FiltrerSorter from '../../components/FiltrerSorter';

moment.locale(i18n.language);

const publicSettings = Meteor.settings.public;

export default function ProcessesList() {
  const [processes, setProcesses] = useState([]);
  const { currentHost, currentUser, isDesktop } = useContext(StateContext);
  const [filter, setFilter] = useState('active');
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('date');
  const [t] = useTranslation('processes');
  const [tc] = useTranslation('common');

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
      if (filter === 'archived') {
        return process.isArchived;
      } else if (filter === 'my') {
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

  const tabs = [
    {
      title: t('tabs.active'),
      onClick: () => setFilter('active'),
    },
    {
      title: t('tabs.members'),
      onClick: () => setFilter('my'),
    },
    {
      title: t('tabs.archived'),
      onClick: () => setFilter('archived'),
    },
  ];

  if (!processesRendered || !processesRendered.length === 0) {
    return null;
  }

  const filtrerProps = {
    filterWord,
    setFilterWord,
    sorterValue,
    setSorterValue,
  };

  return (
    <Box w="100%">
      <Helmet>
        <title>{`${tc('domains.processes')} | ${currentHost.settings.name} | ${
          publicSettings.name
        }`}</title>
      </Helmet>

      <Center>
        <FiltrerSorter {...filtrerProps}>
          <Tabs mx="8" tabs={tabs} />
        </FiltrerSorter>
      </Center>

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
    </Box>
  );
}
