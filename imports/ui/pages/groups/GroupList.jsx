import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import parseHtml from 'html-react-parser';

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
import GroupsHybrid from '../../listing/GroupsHybrid';

const yesterday = dayjs(new Date()).add(-1, 'days');

const getFutureOccurences = (dates) => {
  if (!dates || dates.length === 0) {
    return dates;
  }

  return dates
    .filter((date) => {
      return dayjs(date?.startDate)?.isAfter(yesterday);
    })
    .sort((a, b) => dayjs(a?.startDate) - dayjs(b?.startDate));
};

export default function GroupsList() {
  const [loading, setLoading] = useState(false);
  const initialGroups = window?.__PRELOADED_STATE__?.groups || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;
  const [groups, setGroups] = useState(initialGroups);
  let { currentHost } = useContext(StateContext);

  if (!currentHost) {
    currentHost = Host;
  }

  useEffect(() => {
    getGroups();
  }, []);

  const isPortalHost = Boolean(currentHost?.isPortalHost);

  const getGroups = async () => {
    try {
      const parsedGroups = await call('getGroupsWithMeetings', isPortalHost);
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
          dayjs(meetings[meetings.length - 1].startDate)?.isAfter(yesterday)
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

  // const groupsRendered = useMemo(() => {
  //   const groupsFiltered = getFilteredGroups();
  //   const groupsHostFiltered = getGroupsHostFiltered(groupsFiltered);
  //   return groupsHostFiltered;
  // }, [filter, filterWord, hostFilterValue, sorterValue, groups]);

  // const allHostsFiltered = allHosts?.filter((host) => {
  //   return groupsRendered.some((group) => group.host === host.host);
  // });

  if (loading || !groups || !groups.length === 0) {
    return <ContentLoader />;
  }

  return <GroupsHybrid groups={groups} Host={currentHost} />;
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
