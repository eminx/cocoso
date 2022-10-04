import { Meteor } from 'meteor/meteor';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import NewGridThumb from '../../components/NewGridThumb';

moment.locale(i18n.language);

const publicSettings = Meteor.settings.public;
const yesterday = moment().add(-1, 'days');

const getFirstFutureOccurence = (occurence) => moment(occurence.endDate).isAfter(yesterday);
function compareDatesForSort(a, b) {
  const firstOccurenceA = a.datesAndTimes.find(getFirstFutureOccurence);
  const firstOccurenceB = b.datesAndTimes.find(getFirstFutureOccurence);
  const dateA = new Date(`${firstOccurenceA.startDate}T${firstOccurenceA.startTime}:00Z`);
  const dateB = new Date(`${firstOccurenceB.startDate}T${firstOccurenceB.startTime}:00Z`);
  return dateA - dateB;
}

function Activities({ activitiesList, isLoading, history }) {
  const { currentUser, currentHost, canCreateContent } = useContext(StateContext);

  const [tc] = useTranslation('common');

  const getPublicActivities = () => {
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
    return getPublicActivities().sort(compareDatesForSort);
  };

  if (isLoading) {
    return (
      <Box width="100%" mb="50px">
        <Loader />
      </Box>
    );
  }

  return (
    <Box width="100%" mb="100px">
      <Helmet>
        <title>{`${tc('domains.public')} ${tc('domains.activities')} | ${
          currentHost.settings.name
        } | ${publicSettings.name}`}</title>
      </Helmet>

      <Paginate items={allSortedActivities()}>
        {(activity) => (
          <Box key={activity.title}>
            <Link
              to={activity.isProcess ? `/processes/${activity._id}` : `/activities/${activity._id}`}
            >
              <NewGridThumb
                imageUrl={activity.imageUrl}
                title={activity.title}
                subTitle={activity.isProcess ? activity.readingMaterial : activity.subTitle}
              />
            </Link>
          </Box>
        )}
      </Paginate>
    </Box>
  );
}

export default Activities;
