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
import PageHeading from '../../components/PageHeading';
import { ContentLoader } from '../../components/SkeletonLoaders';

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

export default function GroupsList({ history }) {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [filter, setFilter] = useState('active');
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('date');
  const [modalGroup, setModalGroup] = useState(null);
  const [hostFilterValue, setHostFilterValue] = useState(null);
  const [isCopied, setCopied] = useState(false);
  const { allHosts, canCreateContent, currentHost, currentUser, isDesktop } =
    useContext(StateContext);

  const [t] = useTranslation('groups');
  const [tc] = useTranslation('common');

  useEffect(() => {
    getGroups();
  }, []);

  const isPortalHost = Boolean(currentHost.isPortalHost);

  const getGroups = async () => {
    try {
      const meetings = await call('getAllGroupMeetings', isPortalHost);
      const retrievedGroups = await call('getGroups', isPortalHost);
      const parsedGroups = parseGroupsWithMeetings(retrievedGroups, meetings);
      setGroups(parsedGroups);
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredGroups = () => {
    if (!groups) {
      return <Loader />;
    }

    const filteredGroups = groups.filter((group) => {
      const lowerCaseFilterWord = filterWord === '' ? '' : filterWord.toLowerCase();
      const groupWordFiltered =
        group?.title?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1 ||
        group?.readingMaterial?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;
      if (filter === 'archived') {
        return group.isArchived && groupWordFiltered;
      } else if (filter === 'my') {
        return (
          currentUser &&
          group.members.some((member) => member.memberId === currentUser._id) &&
          groupWordFiltered
        );
      }
      return !group.isArchived && groupWordFiltered;
    });

    return parseOnlyAllowedGroups(filteredGroups);
  };

  const parseOnlyAllowedGroups = (futureGroups) => {
    const futureGroupsAllowed = futureGroups.filter((group) => {
      if (!group.isPrivate) {
        return true;
      }
      if (!currentUser) {
        return false;
      }
      const currentUserId = currentUser._id;
      return (
        group.adminId === currentUserId ||
        group.members.some((member) => member.memberId === currentUserId) ||
        group.peopleInvited.some((person) => person.email === currentUser.emails[0].address)
      );
    });

    return getGroupsSorted(futureGroupsAllowed);
  };

  const getGroupsSorted = (filteredGroups) => {
    if (sorterValue === 'name') {
      return filteredGroups.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      const groupsWithoutFutureMeetings = [];
      const groupsWithFutureMeetings = [];
      filteredGroups.forEach((group) => {
        const meetings = group.meetings;
        if (
          meetings &&
          meetings.length > 0 &&
          moment(meetings[meetings.length - 1].startDate).isAfter(yesterday)
        ) {
          groupsWithFutureMeetings.push(group);
        } else {
          groupsWithoutFutureMeetings.push(group);
        }
      });
      return [
        ...groupsWithFutureMeetings.sort(compareForSortFutureMeeting),
        ...groupsWithoutFutureMeetings.sort(compareForSort).reverse(),
      ];
    }
  };

  const getGroupsHostFiltered = (groupsRendered) => {
    if (!isPortalHost || !hostFilterValue) {
      return groupsRendered;
    }
    return groupsRendered.filter((group) => group.host === hostFilterValue.host);
  };

  const groupsRendered = useMemo(() => {
    const groupsFiltered = getFilteredGroups();
    const groupsHostFiltered = getGroupsHostFiltered(groupsFiltered);
    return groupsHostFiltered;
  }, [filter, filterWord, hostFilterValue, sorterValue, groups]);

  const allHostsFiltered = allHosts?.filter((host) => {
    return groupsRendered.some((group) => group.host === host.host);
  });

  if (loading || !groups || !groups.length === 0) {
    return <ContentLoader />;
  }

  const handleActionButtonClick = () => {
    if (modalGroup.host === currentHost.host) {
      history.push(`/groups/${modalGroup._id}`);
    } else {
      window.location.href = `https://${modalGroup.host}/groups/${modalGroup._id}`;
    }
  };

  const handleCopyLink = async () => {
    const link = `https://${modalGroup.host}/groups/${modalGroup._id}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setCopied(false);
    setModalGroup(null);
  };

  const getButtonLabel = () => {
    if (!isPortalHost || modalGroup.host === currentHost.host) {
      return tc('actions.entryPage');
    }
    return tc('actions.toThePage', {
      hostName: allHosts?.find((h) => h.host === modalGroup.host)?.name,
    });
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
  const title = settings?.menu.find((item) => item.name === 'groups')?.label;

  return (
    <Box w="100%">
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <PageHeading
        description={settings.menu.find((item) => item.name === 'groups')?.description}
        numberOfItems={groupsRendered?.length}
      >
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
      </PageHeading>

      <Box mb="8" px={isDesktop ? '4' : '0'}>
        <InfiniteScroller
          canCreateContent={canCreateContent}
          centerItems={!isDesktop}
          items={groupsRendered}
          newHelperLink="/groups/new"
        >
          {(group) => (
            <Box
              key={group._id}
              className="sexy-thumb-container"
              onClick={() => setModalGroup(group)}
            >
              <SexyThumb
                dates={getFutureOccurences(group.meetings)}
                host={isPortalHost && allHosts.find((h) => h.host === group.host)?.name}
                imageUrl={group.imageUrl}
                subTitle={group.readingMaterial}
                title={group.title}
              />
            </Box>
          )}
        </InfiniteScroller>
      </Box>

      {modalGroup && (
        <Modal
          actionButtonLabel={getButtonLabel()}
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
            action={getDatesForAction(modalGroup)}
            content={modalGroup.description && renderHTML(modalGroup.description)}
            images={[modalGroup.imageUrl]}
            subTitle={modalGroup.readingMaterial}
            tags={isPortalHost && [allHosts.find((h) => h.host === modalGroup.host)?.name]}
            title={modalGroup.title}
          />
        </Modal>
      )}
    </Box>
  );
}

const getDatesForAction = (group) => {
  const dates = getFutureOccurences(group.meetings);

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

function parseGroupsWithMeetings(groups, meetings) {
  return groups.map((group) => {
    const pId = group._id;
    const allGroupActivities = meetings.filter((meeting) => meeting.groupId === pId);
    const groupActivitiesFuture = allGroupActivities
      .map((pA) => pA.datesAndTimes[0])
      .filter((date) => moment(date.startDate).isAfter(yesterday))
      .sort(compareMeetingDatesForSort);
    return {
      ...group,
      meetings: groupActivitiesFuture,
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
