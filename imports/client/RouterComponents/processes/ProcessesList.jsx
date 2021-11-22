import { Meteor } from 'meteor/meteor';
import React, { useState, useContext } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { RadioButtonGroup } from 'grommet';
import { Box, Button, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import Loader from '../../UIComponents/Loader';
import NiceList from '../../UIComponents/NiceList';
import Template from '../../UIComponents/Template';
import { message } from '../../UIComponents/message';
import { StateContext } from '../../LayoutContainer';
import { compareForSort } from '../../functions';

const publicSettings = Meteor.settings.public;

const filterOptions = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'My Processes',
    value: 'my-processes',
  },
  {
    label: 'Archived',
    value: 'archived',
  },
];

export default function ProcessesList({
  isLoading,
  currentUser,
  processes,
  history,
}) {
  const [filterBy, setFilterBy] = useState('active');
  const { canCreateContent, currentHost } = useContext(StateContext);

  const archiveProcess = (processId) => {
    Meteor.call('archiveProcess', processId, (error, respond) => {
      if (error) {
        message.error(error.error);
      } else {
        message.success('Process is successfully archived');
      }
    });
  };

  const unarchiveProcess = (processId) => {
    Meteor.call('unarchiveProcess', processId, (error, respond) => {
      if (error) {
        message.error(error.reason);
      } else {
        message.success('Process is successfully unarchived');
      }
    });
  };

  const getFilteredProcesses = () => {
    if (!processes) {
      return [];
    }
    const filteredProcesses = processes.filter((process) => {
      if (filterBy === 'archived') {
        return process.isArchived === true;
      } else if (filterBy === 'my-processes') {
        return process.members.some(
          (member) => member.memberId === currentUser._id
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

  const handleSelectedFilter = (event) => {
    const value = event.target.value;
    if (!currentUser && value === 'my-processes') {
      message.destroy();
      message.error('You need an account for filtering your processes');
      return;
    }
    setFilterBy(value);
  };

  if (isLoading) {
    return <Loader />;
  }

  const processesFilteredAndSorted =
    getFilteredProcesses().sort(compareForSort);

  const processesList = processesFilteredAndSorted.map((process) => ({
    ...process,
    actions: [
      {
        content: process.isArchived ? 'Unarchive' : 'Archive',
        handleClick: process.isArchived
          ? () => unarchiveProcess(process._id)
          : () => archiveProcess(process._id),
        isDisabled:
          !currentUser ||
          (process.adminId !== currentUser._id && !currentUser.isSuperAdmin),
      },
    ],
  }));

  return (
    <Template>
      <Helmet>
        <title>{`Processes | ${currentHost.settings.name} | ${publicSettings.name}`}</title>
      </Helmet>
      <Box>
        {canCreateContent && (
          <Box margin={{ bottom: 'medium' }} alignSelf="center">
            <Link to={currentUser ? '/new-process' : '/my-profile'}>
              <Button as="span" colorScheme="green" variant="outline">
                NEW
              </Button>
            </Link>
          </Box>
        )}
        <Box p="4">
          <RadioButtonGroup
            name="filters"
            options={filterOptions}
            value={filterBy}
            onChange={handleSelectedFilter}
            direction="row"
            justify="center"
          />
        </Box>
      </Box>

      {processesList && processesList.length > 0 && (
        <NiceList
          list={processesList.reverse()}
          actionsDisabled={!currentUser || !canCreateContent}
          border={false}
        >
          {(process) => <ProcessItem process={process} history={history} />}
        </NiceList>
      )}
    </Template>
  );
}

function ProcessItem({ process, history }) {
  return (
    <Flex
      bg="white"
      mb="4"
      p="2"
      w="100%"
      onClick={() => history.push(`/process/${process._id}`)}
    >
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
