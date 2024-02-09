import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { Box, Center, Flex, ModalBody } from '@chakra-ui/react';
import { parse } from 'query-string';
import renderHTML from 'react-render-html';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import Tabs from '../../components/Tabs';
import FiltrerSorter from '../../components/FiltrerSorter';
import { call } from '../../utils/shared';
import { message } from '../../components/message';
import Modal from '../../components/Modal';
import Tably from '../../components/Tably';
import { DateJust } from '../../components/FancyDate';
import HostFiltrer from '../../components/HostFiltrer';
import SexyThumb from '../../components/SexyThumb';
import InfiniteScroller from '../../components/InfiniteScroller';
import PageHeading from '../../components/PageHeading';

moment.locale(i18n.language);

const yesterday = moment().add(-1, 'days');
const today = moment();

const getFirstFutureOccurence = (occurence) => moment(occurence.endDate).isAfter(yesterday);
const getLastPastOccurence = (occurence) => moment(occurence.endDate).isBefore(today);

const getFutureOccurrences = (dates) => {
  return dates
    .filter((date) => moment(date.endDate).isAfter(yesterday))
    .sort((a, b) => moment(a.startDate) - moment(b.startDate));
};

const getPastOccurrences = (dates) => {
  return dates
    .filter((date) => moment(date.startDate).isBefore(today))
    .sort((a, b) => moment(b.startDate) - moment(a.startDate));
};

function compareDatesForSort(a, b) {
  const firstOccurenceA = a?.datesAndTimes?.find(getFirstFutureOccurence);
  const firstOccurenceB = b?.datesAndTimes?.find(getFirstFutureOccurence);
  const dateA = new Date(`${firstOccurenceA?.startDate}T${firstOccurenceA?.startTime}:00Z`);
  const dateB = new Date(`${firstOccurenceB?.startDate}T${firstOccurenceB?.startTime}:00Z`);
  return dateA - dateB;
}

function compareDatesForSortReverse(a, b) {
  const firstOccurenceA = a?.datesAndTimes?.reverse().find(getLastPastOccurence);
  const firstOccurenceB = b?.datesAndTimes?.reverse().find(getLastPastOccurence);
  const dateA = new Date(`${firstOccurenceA?.startDate}T${firstOccurenceA?.startTime}:00Z`);
  const dateB = new Date(`${firstOccurenceB?.startDate}T${firstOccurenceB?.startTime}:00Z`);
  return dateB - dateA;
}

function parseProcessActivities(activities) {
  const activitiesParsed = [];

  activities?.forEach((act, index) => {
    if (!act.isProcessMeeting) {
      activitiesParsed.push(act);
    } else {
      const indexParsed = activitiesParsed.findIndex((actP, indexP) => {
        return actP.processId === act.processId;
      });
      if (indexParsed === -1) {
        activitiesParsed.push(act);
      } else {
        activitiesParsed[indexParsed].datesAndTimes.push(act.datesAndTimes[0]);
      }
    }
  });

  return activitiesParsed;
}

function Activities({ history }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('date');
  const [modalActivity, setModalActivity] = useState(null);
  const [hostFilterValue, setHostFilterValue] = useState(null);
  const [isCopied, setCopied] = useState(false);
  const { allHosts, canCreateContent, currentHost, isDesktop } = useContext(StateContext);
  const {
    location: { search },
  } = history;
  const { showPast } = parse(search, { parseBooleans: true });
  const [tc] = useTranslation('common');

  useEffect(() => {
    getActivities();
  }, []);

  const getActivities = async () => {
    try {
      if (isPortalHost) {
        const allActivities = await call('getAllPublicActivitiesFromAllHosts');
        const allActivitiesParsed = parseProcessActivities(allActivities);
        setActivities(allActivitiesParsed);
      } else {
        const allActivities = await call('getAllPublicActivities');
        const allActivitiesParsed = parseProcessActivities(allActivities);
        setActivities(allActivitiesParsed);
      }
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    } finally {
      setLoading(false);
    }
  };

  const isPortalHost = currentHost.isPortalHost;

  const getFuturePublicActivities = () => {
    if (!activities) {
      return null;
    }
    const lowerCaseFilterWord = filterWord === '' ? '' : filterWord.toLowerCase();
    return activities.filter((activity) => {
      const activityWordFiltered =
        activity?.title?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1 ||
        activity?.subTitle?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;

      return (
        activity.datesAndTimes.some((date) => moment(date.endDate).isAfter(yesterday)) &&
        activityWordFiltered
      );
    });
  };

  const getPastPublicActivities = () => {
    if (!activities) {
      return null;
    }

    const lowerCaseFilterWord = filterWord === '' ? '' : filterWord.toLowerCase();
    return activities.filter((activity) => {
      const activityWordFiltered =
        activity?.title?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1 ||
        activity?.subTitle?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;
      return (
        activity.datesAndTimes.some((date) => moment(date.startDate).isBefore(today)) &&
        activityWordFiltered
      );
    });
  };

  const getActivitiesFilteredSorted = () => {
    if (showPast) {
      if (sorterValue === 'name') {
        return getPastPublicActivities().sort((a, b) => a.title.localeCompare(b.title));
      }
      return getPastPublicActivities().sort(compareDatesForSortReverse);
    } else {
      if (sorterValue === 'name') {
        return getFuturePublicActivities().sort((a, b) => a.title.localeCompare(b.title));
      }
      return getFuturePublicActivities().sort(compareDatesForSort);
    }
  };

  const getActivitiesRenderedHostFiltered = (activitiesRendered) => {
    if (!isPortalHost || !hostFilterValue) {
      return activitiesRendered;
    }
    return activitiesRendered.filter((activity) => activity.host === hostFilterValue.host);
  };

  const activitiesRendered = useMemo(() => {
    const activitiesFilteredSorted = getActivitiesFilteredSorted();
    const activitiesHostFiltered = getActivitiesRenderedHostFiltered(activitiesFilteredSorted);
    return activitiesHostFiltered;
  }, [activities, filterWord, hostFilterValue, showPast, sorterValue]);

  if (loading) {
    return (
      <Box width="100%" mb="50px">
        <Loader />
      </Box>
    );
  }

  const handleActionButtonClick = () => {
    if (modalActivity.host === currentHost.host) {
      history.push(`/activities/${modalActivity._id}`);
    } else {
      window.location.href = `https://${modalActivity.host}/activities/${modalActivity._id}`;
    }
  };

  const handleCopyLink = async () => {
    const link = `https://${modalActivity.host}/activities/${modalActivity._id}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setCopied(false);
    setModalActivity(null);
  };

  const tabs = [
    {
      path: '/activities?showPast=true',
      title: tc('labels.past'),
    },
    {
      path: '/activities',
      title: tc('labels.upcoming'),
    },
  ];

  const filtrerProps = {
    filterWord,
    setFilterWord,
    sorterValue,
    setSorterValue,
  };

  const allHostsFiltered = allHosts?.filter((host) => {
    return activitiesRendered.some((act) => act.host === host.host);
  });
  const { settings } = currentHost;
  const title = settings?.menu.find((item) => item.name === 'activities')?.label;

  return (
    <Box width="100%" mb="100px">
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <PageHeading
        description={settings.menu.find((item) => item.name === 'activities')?.description}
        numberOfItems={activitiesRendered?.length}
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
        </FiltrerSorter>
      </PageHeading>

      <Center>
        <Tabs mb="4" size="sm" tabs={tabs} index={showPast ? 0 : 1} />
      </Center>

      <Box px={isDesktop ? '4' : '0'}>
        <InfiniteScroller
          canCreateContent={canCreateContent}
          centerItems
          items={activitiesRendered}
          newHelperLink="/activities/new"
        >
          {(activity) => {
            const itemHost = allHosts?.find((h) => h.host === activity.host)?.name;
            return (
              <Box
                key={activity._id}
                className="sexy-thumb-container"
                onClick={() => setModalActivity(activity)}
              >
                <SexyThumb
                  dates={activity.datesAndTimes}
                  showPast={showPast}
                  host={isPortalHost ? itemHost : null}
                  imageUrl={activity.imageUrl}
                  subTitle={activity.isProcess ? activity.readingMaterial : activity.subTitle}
                  title={activity.title}
                />
              </Box>
            );
          }}
        </InfiniteScroller>
      </Box>

      {modalActivity && (
        <Modal
          actionButtonLabel={
            isPortalHost
              ? tc('actions.toThePage', {
                  hostName: allHosts.find((h) => h.host === modalActivity.host)?.name,
                })
              : tc('actions.entryPage')
          }
          h="90%"
          isCentered
          isOpen
          p="0"
          scrollBehavior="inside"
          secondaryButtonLabel={isCopied ? tc('actions.copied') : tc('actions.share')}
          size={isDesktop ? '6xl' : 'full'}
          onActionButtonClick={() => handleActionButtonClick()}
          onClose={handleCloseModal}
          onSecondaryButtonClick={handleCopyLink}
        >
          <ModalBody p="0">
            <Tably
              action={getDatesForAction(modalActivity, showPast)}
              content={modalActivity.longDescription && renderHTML(modalActivity.longDescription)}
              images={[modalActivity.imageUrl]}
              subTitle={modalActivity.subTitle}
              tags={isPortalHost && [allHosts.find((h) => h.host === modalActivity.host)?.name]}
              title={modalActivity.title}
            />
          </ModalBody>
        </Modal>
      )}
    </Box>
  );
}

function getDatesForAction(activity, showPast = false) {
  const dates = showPast
    ? getPastOccurrences(activity.datesAndTimes)
    : getFutureOccurrences(activity.datesAndTimes);

  return (
    <Flex pt="4">
      {dates.map((occurence, occurenceIndex) => (
        <Flex key={occurence.startDate + occurence.endTime} pr="6">
          <Box>
            <DateJust>{occurence.startDate}</DateJust>
          </Box>
          {occurence.startDate !== occurence.endDate && (
            <Flex>
              {'-'}
              <DateJust>{occurence.endDate}</DateJust>
            </Flex>
          )}
        </Flex>
      ))}
    </Flex>
  );
}

export default Activities;
