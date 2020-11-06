import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Box, Button, Image, Heading, RadioButtonGroup, Text } from 'grommet';
import { FormAdd } from 'grommet-icons';

import Loader from '../../UIComponents/Loader';
import NiceList from '../../UIComponents/NiceList';
import Template from '../../UIComponents/Template';
import { message } from '../../UIComponents/message';

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

import { compareForSort } from '../../functions';

const ProcessesList = ({ isLoading, currentUser, processes, history }) => {
  const [filterBy, setFilterBy] = useState('active');

  archiveProcess = (processId) => {
    Meteor.call('archiveProcess', processId, (error, respond) => {
      if (error) {
        message.error(error.error);
      } else {
        message.success('Process is successfully archived');
      }
    });
  };

  unarchiveProcess = (processId) => {
    Meteor.call('unarchiveProcess', processId, (error, respond) => {
      if (error) {
        message.error(error.reason);
      } else {
        message.success('Process is successfully unarchived');
      }
    });
  };

  getFilteredProcesses = () => {
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

    const filteredProcessesWithAccessFilter = parseOnlyAllowedProcesses(
      filteredProcesses
    );
    return filteredProcessesWithAccessFilter;
  };

  parseOnlyAllowedProcesses = (futureProcesses) => {
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

  handleSelectedFilter = (event) => {
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

  const processesFilteredAndSorted = getFilteredProcesses().sort(
    compareForSort
  );

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
    <Template heading="Processes" titleCentered>
      <Box>
        <Box margin={{ bottom: 'medium' }} alignSelf="center">
          <Link to={currentUser ? '/new-process' : '/my-profile'}>
            <Button
              as="span"
              size="small"
              label="NEW"
              primary
              icon={<FormAdd />}
            />
          </Link>
        </Box>
        <Box pad="medium">
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
          actionsDisabled={!currentUser || !currentUser.isRegisteredMember}
          border={false}
        >
          {(process) => <ProcessItem process={process} history={history} />}
        </NiceList>
      )}
    </Template>
  );
};

const ProcessItem = ({ process, history }) => (
  <Box
    width="100%"
    onClick={() => history.push(`/process/${process._id}`)}
    hoverIndicator="light-1"
    pad="small"
    direction="row"
    margin={{ bottom: 'medium' }}
    background="white"
  >
    <Box width="small" height="small" margin={{ right: 'small' }}>
      <Image fit="cover" fill src={process.imageUrl} />
    </Box>
    <Box width="100%">
      <Box>
        <Heading level={3}>{process.title}</Heading>
        <Text weight={300}>{process.readingMaterial}</Text>
      </Box>

      <Box pad="small">
        <Text size="small" textAlign="end">
          {process.adminUsername}
        </Text>
        <Text size="xsmall" textAlign="end">
          {moment(process.creationDate).format('Do MMM YYYY')}
        </Text>
      </Box>
    </Box>
  </Box>
);

export default ProcessesList;
