import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import moment from 'moment';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import renderHTML from 'react-render-html';

import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import { StateContext } from '../../LayoutContainer';
import { call, compareForSort } from '../../utils/shared';
import NewGridThumb from '../../components/NewGridThumb';
import { message } from '../../components/message';
import Tabs from '../../components/Tabs';
import FiltrerSorter from '../../components/FiltrerSorter';
import Tably from '../../components/Tably';
import Modal from '../../components/Modal';
import HostFiltrer from '../../components/HostFiltrer';
import { DateJust } from '../../components/FancyDate';

moment.locale(i18n.language);
const yesterday = moment(new Date()).add(-1, 'days');

const getFutureOccurences = (dates) => {
  if (!dates || dates.length === 0) {
    return dates;
  }
  return dates
    .filter((date) => moment(date.startDate).isAfter(yesterday))
    .sort((a, b) => moment(a.startDate) - moment(b.startDate));
};

export default function ProcessesList({ history }) {
  const [loading, setLoading] = useState(true);
  const [processes, setProcesses] = useState([]);
  const [filter, setFilter] = useState('active');
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('date');
  const [modalProcess, setModalProcess] = useState(null);
  const [hostFilterValue, setHostFilterValue] = useState(null);
  const { allHosts, currentHost, currentUser, isDesktop } = useContext(StateContext);

  const [t] = useTranslation('processes');
  const [tc] = useTranslation('common');

  useEffect(() => {
    getProcesses();
  }, []);

  const getProcesses = async () => {
    try {
      const meetings = await call('getAllProcessMeetings', Boolean(currentHost.isPortalHost));
      const retrievedProcesses = await call('getProcesses', Boolean(currentHost.isPortalHost));
      const parsedProcesses = parseProcessesWithMeetings(retrievedProcesses, meetings);
      setProcesses(parsedProcesses);
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProcesses = () => {
    if (!processes) {
      return <Loader />;
    }

    const filteredProcesses = processes.filter((process) => {
      const lowerCaseFilterWord = filterWord === '' ? '' : filterWord.toLowerCase();
      const processWordFiltered =
        process?.title?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1 ||
        process?.readingMaterial?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;
      if (filter === 'archived') {
        return process.isArchived && processWordFiltered;
      } else if (filter === 'my') {
        return (
          currentUser &&
          process.members.some((member) => member.memberId === currentUser._id) &&
          processWordFiltered
        );
      }
      return !process.isArchived && processWordFiltered;
    });

    return parseOnlyAllowedProcesses(filteredProcesses);
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

    return getProcessesSorted(futureProcessesAllowed);
  };

  const getProcessesSorted = (filteredProcesses) => {
    if (sorterValue === 'name') {
      return filteredProcesses.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      const processesWithoutFutureMeetings = [];
      const processesWithFutureMeetings = [];
      filteredProcesses.forEach((process) => {
        const meetings = process.meetings;
        if (
          meetings &&
          meetings.length > 0 &&
          moment(meetings[meetings.length - 1].startDate).isAfter(yesterday)
        ) {
          processesWithFutureMeetings.push(process);
        } else {
          processesWithoutFutureMeetings.push(process);
        }
      });
      return [
        ...processesWithFutureMeetings.sort(compareForSortFutureMeeting),
        ...processesWithoutFutureMeetings.sort(compareForSort).reverse(),
      ];
    }
  };

  if (loading || !processes || !processes.length === 0) {
    return <Loader />;
  }

  const getProcessesRenderedHostFiltered = (processesRendered) => {
    if (!currentHost.isPortalHost || !hostFilterValue) {
      return processesRendered;
    }
    return processesRendered.filter((process) => process.host === hostFilterValue.host);
  };

  const processesRendered = getFilteredProcesses();
  const processesRenderedHostFiltered = getProcessesRenderedHostFiltered(processesRendered);

  const allHostsFiltered = allHosts?.filter((host) => {
    return processesRendered.some((process) => process.host === host.host);
  });

  const handleActionButtonClick = () => {
    if (modalProcess.host === currentHost.host) {
      history.push(`/processes/${modalProcess._id}`);
    } else {
      window.location.href = `https://${modalProcess.host}/processes/${modalProcess._id}`;
    }
  };

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

  const filtrerProps = {
    filterWord,
    setFilterWord,
    sorterValue,
    setSorterValue,
  };

  return (
    <Box w="100%">
      <Helmet>
        <title>{`${tc('domains.processes')} | ${currentHost.settings.name}`}</title>
      </Helmet>

      <Box px="4" mb="4">
        <Flex flexDirection={isDesktop ? 'row' : 'column'}>
          <FiltrerSorter {...filtrerProps}>
            <Tabs mx="4" size="sm" tabs={tabs} />
          </FiltrerSorter>

          {currentHost.isPortalHost && (
            <Flex justify={isDesktop ? 'flex-start' : 'center'} pl={isDesktop ? '8' : '0'} py="2">
              <HostFiltrer
                allHosts={allHostsFiltered}
                hostFilterValue={hostFilterValue}
                onHostFilterValueChange={(value, meta) => setHostFilterValue(value)}
              />
            </Flex>
          )}
        </Flex>
      </Box>

      <Box px={isDesktop ? '1' : '0'}>
        <Paginate centerItems={!isDesktop} items={processesRenderedHostFiltered}>
          {(process) => (
            <Box key={process._id}>
              {currentHost.isPortalHost ? (
                <Box cursor="pointer" onClick={() => setModalProcess(process)}>
                  <NewGridThumb
                    dates={getFutureOccurences(process.meetings).map((d) => d.startDate)}
                    // dates={process.meetings?.map((m) => m.startDate)}
                    host={allHosts.find((h) => h.host === process.host)?.name}
                    imageUrl={process.imageUrl}
                    subTitle={process.readingMaterial}
                    title={process.title}
                  />
                </Box>
              ) : (
                <Link to={`/processes/${process._id}`}>
                  <NewGridThumb
                    dates={getFutureOccurences(process.meetings).map((d) => d.startDate)}
                    imageUrl={process.imageUrl}
                    subTitle={process.readingMaterial}
                    title={process.title}
                  />
                </Link>
              )}
            </Box>
          )}
        </Paginate>
      </Box>

      {modalProcess && (
        <Modal
          h="90%"
          isCentered
          isOpen
          scrollBehavior="inside"
          size="6xl"
          onClose={() => setModalProcess(null)}
          actionButtonLabel={tc('actions.toThePage', {
            hostName: allHosts.find((h) => h.host === modalProcess.host)?.name,
          })}
          onActionButtonClick={() => handleActionButtonClick()}
        >
          <Tably
            action={getDatesForAction(modalProcess)}
            content={modalProcess.description && renderHTML(modalProcess.description)}
            images={[modalProcess.imageUrl]}
            subTitle={modalProcess.readingMaterial}
            tags={[allHosts.find((h) => h.host === modalProcess.host)?.name]}
            title={modalProcess.title}
          />
        </Modal>
      )}
    </Box>
  );
}

const getDatesForAction = (process) => {
  const dates = getFutureOccurences(process.meetings);

  return (
    <Flex pt="4">
      {dates?.map((occurence, occurenceIndex) => (
        <Box key={occurence.startDate + occurence.endTime} pr="6">
          <DateJust>{occurence.startDate}</DateJust>
        </Box>
      ))}
    </Flex>
  );
};

function parseProcessesWithMeetings(processes, meetings) {
  return processes.map((process) => {
    const pId = process._id;
    const allProcessActivities = meetings.filter((meeting) => meeting.processId === pId);
    const processActivitiesFuture = allProcessActivities
      .map((pA) => pA.datesAndTimes[0])
      .filter((date) => moment(date.startDate).isAfter(yesterday))
      .sort(compareMeetingDatesForSort);
    return {
      ...process,
      meetings: processActivitiesFuture,
    };
  });
}

function compareMeetingDatesForSort(a, b) {
  const dateA = new Date(a.startDate);
  const dateB = new Date(b.startDate);
  return dateA - dateB;
}

const compareForSortFutureMeeting = (a, b) => {
  const firstOccurenceA = a.meetings[0];
  const firstOccurenceB = b.meetings[0];
  const dateA = new Date(
    firstOccurenceA && firstOccurenceA.startDate + 'T' + firstOccurenceA.startTime + ':00Z'
  );
  const dateB = new Date(
    firstOccurenceB && firstOccurenceB.startDate + 'T' + firstOccurenceB.startTime + ':00Z'
  );
  return dateA - dateB;
};
