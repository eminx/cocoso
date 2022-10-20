import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { Box, Center } from '@chakra-ui/react';
import { parse } from 'query-string';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import NewGridThumb from '../../components/NewGridThumb';
import Tabs from '../../components/Tabs';

moment.locale(i18n.language);

const yesterday = moment().add(-1, 'days');
const today = moment();

const getFirstFutureOccurence = (occurence) => moment(occurence.endDate).isAfter(yesterday);

function compareDatesForSort(a, b) {
  const firstOccurenceA = a?.datesAndTimes?.find(getFirstFutureOccurence);
  const firstOccurenceB = b?.datesAndTimes?.find(getFirstFutureOccurence);
  const dateA = new Date(`${firstOccurenceA?.startDate}T${firstOccurenceA?.startTime}:00Z`);
  const dateB = new Date(`${firstOccurenceB?.startDate}T${firstOccurenceB?.startTime}:00Z`);
  return dateA - dateB;
}

function Activities({ activitiesList, isLoading, history }) {
  const { currentHost } = useContext(StateContext);
  const {
    location: { search },
  } = history;
  const { showPast } = parse(search, { parseBooleans: true });

  const [tc] = useTranslation('common');

  const getFuturePublicActivities = () => {
    if (!activitiesList) {
      return null;
    }

    const publicActivities = activitiesList.filter(
      (activity) => activity.isPublicActivity === true
    );

    const futurePublicActivities = publicActivities.filter((activity) =>
      activity.datesAndTimes.some((date) => moment(date.endDate).isAfter(yesterday))
    );

    return futurePublicActivities;
  };

  const allSortedActivities = () => {
    if (showPast) {
      return getPastPublicActivities().sort(compareDatesForSort).reverse();
    }
    return getFuturePublicActivities().sort(compareDatesForSort);
  };

  const getPastPublicActivities = () => {
    if (!activitiesList) {
      return null;
    }

    return activitiesList.filter((activity) => {
      return (
        activity.isPublicActivity &&
        activity.datesAndTimes.some((date) => moment(date.startDate).isBefore(today))
      );
    });
  };

  if (isLoading) {
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

  return (
    <Box width="100%" mb="100px">
      <Helmet>
        <title>{`${tc('domains.public')} ${tc('domains.activities')} | ${
          currentHost.settings.name
        }`}</title>
      </Helmet>

      <Center>
        <Tabs tabs={tabs} defaultIndex={showPast ? 0 : 1} />
      </Center>

      <Paginate items={allSortedActivities()}>
        {(activity) => (
          <Box key={activity.title}>
            <Link
              to={activity.isProcess ? `/processes/${activity._id}` : `/activities/${activity._id}`}
            >
              <NewGridThumb
                dates={activity.datesAndTimes.map((d) => d.startDate)}
                imageUrl={activity.imageUrl}
                subTitle={activity.isProcess ? activity.readingMaterial : activity.subTitle}
                title={activity.title}
              />
            </Link>
          </Box>
        )}
      </Paginate>
    </Box>
  );
}

export default Activities;
