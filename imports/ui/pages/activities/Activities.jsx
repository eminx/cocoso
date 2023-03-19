import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { Box, Flex } from '@chakra-ui/react';
import { parse } from 'query-string';
import renderHTML from 'react-render-html';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import NewGridThumb from '../../components/NewGridThumb';
import Tabs from '../../components/Tabs';
import FiltrerSorter from '../../components/FiltrerSorter';
import { call } from '../../utils/shared';
import { message } from '../../components/message';
import Modal from '../../components/Modal';
import Tably from '../../components/Tably';
import { DateJust } from '../../components/FancyDate';
import HostFiltrer from '../../components/HostFiltrer';

moment.locale(i18n.language);

const yesterday = moment().add(-1, 'days');
const today = moment();

const getFirstFutureOccurence = (occurence) => moment(occurence.endDate).isAfter(yesterday);
const getLastPastOccurence = (occurence) => moment(occurence.endDate).isBefore(today);
const getFutureOccurences = (dates) => {
  return dates
    .filter((date) => moment(date.startDate).isAfter(yesterday))
    .sort((a, b) => moment(a.startDate) - moment(b.startDate));
};
const getPastOccurences = (dates) => {
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
  const { allHosts, currentHost, isDesktop } = useContext(StateContext);
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
      if (currentHost.isPortalHost) {
        const allActivities = await call('getAllActivitiesFromAllHosts', true);
        const allActivitiesParsed = parseProcessActivities(allActivities);
        setActivities(allActivitiesParsed);
      } else {
        const allActivities = await call('getAllActivities', true);
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
    if (!currentHost.isPortalHost || !hostFilterValue) {
      return activitiesRendered;
    }
    return activitiesRendered.filter((activity) => activity.host === hostFilterValue.host);
  };

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

  const activitiesRendered = getActivitiesFilteredSorted();
  const activitiesRenderedHostFiltered = getActivitiesRenderedHostFiltered(activitiesRendered);

  const allHostsFiltered = allHosts?.filter((host) => {
    return activitiesRendered.some((act) => act.host === host.host);
  });

  return (
    <Box width="100%" mb="100px">
      <Helmet>
        <title>{`${tc('domains.public')} ${tc('domains.activities')} | ${
          currentHost.settings.name
        }`}</title>
      </Helmet>

      <Box px="4">
        <Flex flexDirection={isDesktop ? 'row' : 'column'}>
          <FiltrerSorter {...filtrerProps}>
            <Tabs mx="4" size="sm" tabs={tabs} index={showPast ? 0 : 1} />
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

      <Box px="2">
        <Paginate centerItems={!isDesktop} items={activitiesRenderedHostFiltered}>
          {(activity) => {
            const itemHost = allHosts.find((h) => h.host === activity.host)?.name;
            return (
              <Box key={activity._id}>
                {currentHost.isPortalHost ? (
                  <Box cursor="pointer" onClick={() => setModalActivity(activity)}>
                    <NewGridThumb
                      dates={
                        showPast
                          ? getPastOccurences(activity.datesAndTimes).map((d) => d.startDate)
                          : getFutureOccurences(activity.datesAndTimes).map((d) => d.startDate)
                      }
                      host={itemHost}
                      imageUrl={activity.imageUrl}
                      subTitle={activity.isProcess ? activity.readingMaterial : activity.subTitle}
                      title={activity.title}
                    />
                  </Box>
                ) : (
                  <Link
                    to={
                      activity.isProcess
                        ? `/processes/${activity._id}`
                        : `/activities/${activity._id}`
                    }
                  >
                    <NewGridThumb
                      dates={
                        showPast
                          ? getPastOccurences(activity.datesAndTimes).map((d) => d.startDate)
                          : getFutureOccurences(activity.datesAndTimes).map((d) => d.startDate)
                      }
                      imageUrl={activity.imageUrl}
                      subTitle={activity.isProcess ? activity.readingMaterial : activity.subTitle}
                      title={activity.title}
                    />
                  </Link>
                )}
              </Box>
            );
          }}
        </Paginate>
      </Box>

      {modalActivity && (
        <Modal
          h="90%"
          isCentered
          isOpen
          scrollBehavior="inside"
          size="6xl"
          onClose={() => setModalActivity(null)}
          actionButtonLabel={tc('actions.toThePage', {
            hostName: allHosts.find((h) => h.host === modalActivity.host)?.name,
          })}
          onActionButtonClick={() => handleActionButtonClick()}
        >
          <Tably
            action={getDatesForAction(modalActivity, showPast)}
            content={modalActivity.longDescription && renderHTML(modalActivity.longDescription)}
            images={[modalActivity.imageUrl]}
            subTitle={modalActivity.subTitle}
            tags={[allHosts.find((h) => h.host === modalActivity.host)?.name]}
            title={modalActivity.title}
          />
        </Modal>
      )}
    </Box>
  );
}

const getDatesForAction = (activity, showPast = false) => {
  const dates = showPast
    ? getPastOccurences(activity.datesAndTimes)
    : getFutureOccurences(activity.datesAndTimes);

  return (
    <Flex pt="4">
      {dates.map((occurence, occurenceIndex) => (
        <Box key={occurence.startDate + occurence.endTime} pr="6">
          <DateJust>{occurence.startDate}</DateJust>
        </Box>
      ))}
    </Flex>
  );
};

export default Activities;
