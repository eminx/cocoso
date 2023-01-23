import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { Box, Center, Flex } from '@chakra-ui/react';
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

moment.locale(i18n.language);

const yesterday = moment().add(-1, 'days');
const today = moment();

const getFirstFutureOccurence = (occurence) => moment(occurence.endDate).isAfter(yesterday);
const getLastPastOccurence = (occurence) => moment(occurence.endDate).isBefore(today);

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

function Activities({ history }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('date');
  const [modalActivity, setModalActivity] = useState(null);
  const { currentHost } = useContext(StateContext);
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
        setActivities(await call('getAllActivitiesFromAllHosts', true));
      } else {
        setActivities(await call('getAllActivities', true));
      }
    } catch (error) {
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

  if (loading) {
    return (
      <Box width="100%" mb="50px">
        <Loader />
      </Box>
    );
  }

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

  return (
    <Box width="100%" mb="100px">
      <Helmet>
        <title>{`${tc('domains.public')} ${tc('domains.activities')} | ${
          currentHost.settings.name
        }`}</title>
      </Helmet>

      <Center>
        <FiltrerSorter {...filtrerProps}>
          <Tabs mx="4" size="sm" tabs={tabs} index={showPast ? 0 : 1} />
        </FiltrerSorter>
      </Center>

      <Paginate items={activitiesRendered}>
        {(activity) => (
          <Box key={activity._id}>
            {currentHost.isPortalHost ? (
              <Box cursor="pointer" onClick={() => setModalActivity(activity)}>
                <NewGridThumb
                  dates={activity.datesAndTimes.map((d) => d.startDate)}
                  host={activity.host}
                  imageUrl={activity.imageUrl}
                  subTitle={activity.isProcess ? activity.readingMaterial : activity.subTitle}
                  title={activity.title}
                />
              </Box>
            ) : (
              <Link
                to={
                  activity.isProcess ? `/processes/${activity._id}` : `/activities/${activity._id}`
                }
              >
                <NewGridThumb
                  dates={activity.datesAndTimes.map((d) => d.startDate)}
                  imageUrl={activity.imageUrl}
                  subTitle={activity.isProcess ? activity.readingMaterial : activity.subTitle}
                  title={activity.title}
                />
              </Link>
            )}
          </Box>
        )}
      </Paginate>

      {modalActivity && (
        <Modal
          h="90%"
          isCentered
          isOpen
          scrollBehavior="inside"
          size="6xl"
          onClose={() => setModalActivity(null)}
          actionButtonLabel={tc('actions.toThePage')}
          onActionButtonClick={() =>
            (window.location.href = `https://${modalActivity.host}/activities/${modalActivity._id}`)
          }
        >
          <Tably
            action={getDatesForAction(modalActivity)}
            content={modalActivity.longDescription && renderHTML(modalActivity.longDescription)}
            images={[modalActivity.imageUrl]}
            subTitle={modalActivity.subTitle}
            tags={[modalActivity.host]}
            title={modalActivity.title}
          />
        </Modal>
      )}
    </Box>
  );
}

const getDatesForAction = (activity) => {
  return (
    <Flex pt="4">
      {activity.datesAndTimes.map((occurence, occurenceIndex) => (
        <Box key={occurence.startDate + occurence.endTime} pr="6">
          <DateJust>{occurence.startDate}</DateJust>
        </Box>
      ))}
    </Flex>
  );
};

export default Activities;
