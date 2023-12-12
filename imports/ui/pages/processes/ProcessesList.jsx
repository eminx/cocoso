import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import moment from 'moment';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import renderHTML from 'react-render-html';

import Loader from '../../components/Loader';
import { StateContext } from '../../LayoutContainer';
import { call, compareForSort } from '../../utils/shared';
import { message } from '../../components/message';
import Tabs from '../../components/Tabs';
import FiltrerSorter from '../../components/FiltrerSorter';
import Tably from '../../components/Tably';
import Modal from '../../components/Modal';
import HostFiltrer from '../../components/HostFiltrer';
import { DateJust } from '../../components/FancyDate';
import SexyThumb from '../../components/SexyThumb';
import InfiniteScroller from '../../components/InfiniteScroller';
import PageHeader from '../../components/PageHeader';

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
  const [isCopied, setCopied] = useState(false);
  const { allHosts, canCreateContent, currentHost, currentUser, isDesktop } =
    useContext(StateContext);

  const [t] = useTranslation('processes');
  const [tc] = useTranslation('common');

  useEffect(() => {
    getProcesses();
  }, []);

  const isPortalHost = Boolean(currentHost.isPortalHost);

  const getProcesses = async () => {
    try {
      const meetings = await call('getAllProcessMeetings', isPortalHost);
      const retrievedProcesses = await call('getProcesses', isPortalHost);
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

  const getProcessesHostFiltered = (processesRendered) => {
    if (!isPortalHost || !hostFilterValue) {
      return processesRendered;
    }
    return processesRendered.filter((process) => process.host === hostFilterValue.host);
  };

  const processesRendered = useMemo(() => {
    const processesFiltered = getFilteredProcesses();
    const processesHostFiltered = getProcessesHostFiltered(processesFiltered);
    return processesHostFiltered;
  }, [filter, filterWord, hostFilterValue, sorterValue, processes]);

  const allHostsFiltered = allHosts?.filter((host) => {
    return processesRendered.some((process) => process.host === host.host);
  });

  if (loading || !processes || !processes.length === 0) {
    return <Loader />;
  }

  const handleActionButtonClick = () => {
    if (modalProcess.host === currentHost.host) {
      history.push(`/processes/${modalProcess._id}`);
    } else {
      window.location.href = `https://${modalProcess.host}/processes/${modalProcess._id}`;
    }
  };

  const handleCopyLink = async () => {
    const link = `https://${modalProcess.host}/processes/${modalProcess._id}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setCopied(false);
    setModalProcess(null);
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

  const { settings } = currentHost;

  return (
    <Box w="100%">
      <Helmet>
        <title>{`${tc('domains.processes')} | ${currentHost.settings.name}`}</title>
      </Helmet>

      <PageHeader
        description={settings.menu.find((item) => item.name === 'processes')?.description}
        numberOfItems={processesRendered?.length}
      >
        {processesRendered?.length > 3 && (
          <FiltrerSorter {...filtrerProps}>
            {isPortalHost && (
              <Flex justify={isDesktop ? 'flex-start' : 'center'}>
                <HostFiltrer
                  allHosts={allHostsFiltered}
                  hostFilterValue={hostFilterValue}
                  onHostFilterValueChange={(value, meta) => setHostFilterValue(value)}
                />
              </Flex>
            )}
            <Tabs size="sm" tabs={tabs} />
          </FiltrerSorter>
        )}
      </PageHeader>

      <Box mb="8" px={isDesktop ? '4' : '0'}>
        <InfiniteScroller
          canCreateContent={canCreateContent}
          centerItems={!isDesktop}
          items={processesRendered}
          newHelperLink="/processes/new"
        >
          {(process) => (
            <Box key={process._id} cursor="pointer" onClick={() => setModalProcess(process)}>
              <SexyThumb
                dates={getFutureOccurences(process.meetings)}
                host={isPortalHost && allHosts.find((h) => h.host === process.host)?.name}
                imageUrl={process.imageUrl}
                subTitle={process.readingMaterial}
                title={process.title}
              />
            </Box>
          )}
        </InfiniteScroller>
      </Box>

      {modalProcess && (
        <Modal
          actionButtonLabel={
            isPortalHost
              ? tc('actions.toThePage', {
                  hostName: allHosts.find((h) => h.host === modalProcess.host)?.name,
                })
              : tc('actions.entryPage')
          }
          h="90%"
          isCentered
          isOpen
          scrollBehavior="inside"
          secondaryButtonLabel={isCopied ? tc('actions.copied') : tc('actions.share')}
          size={isDesktop ? '6xl' : 'full'}
          onClose={handleCloseModal}
          onActionButtonClick={() => handleActionButtonClick()}
          onSecondaryButtonClick={handleCopyLink}
        >
          <Tably
            action={getDatesForAction(modalProcess)}
            content={modalProcess.description && renderHTML(modalProcess.description)}
            images={[modalProcess.imageUrl]}
            subTitle={modalProcess.readingMaterial}
            tags={isPortalHost && [allHosts.find((h) => h.host === modalProcess.host)?.name]}
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
