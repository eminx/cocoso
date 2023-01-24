import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import NewActivity from './NewActivity';
import { parseAllBookingsWithResources } from '../../utils/shared';
import Resources from '../../../api/resources/resource';
import Activities from '../../../api/activities/activity';
import { useTranslation } from 'react-i18next';

const NewActivityContainer = withTracker((props) => {
  const resourcesSub = Meteor.subscribe('resources');
  const resources = Resources ? Resources.find().fetch() : null;
  const activitiesSub = Meteor.subscribe('activities');
  const activities = Activities ? Activities.find().fetch() : null;
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();

  const allBookings = parseAllBookingsWithResources(activities, resources);

  const isLoading = !activitiesSub.ready() || !resourcesSub.ready();

  if (!allBookings) {
    return null;
  }

  return {
    allBookings,
    currentUser,
    history: props.history,
    resources,
    isLoading,
  };
})(NewActivity);

export default function (props) {
  const [t] = useTranslation('activities');
  const [tc] = useTranslation('common');

  const allProps = {
    ...props,
    t,
    tc,
  };
  return <NewActivityContainer {...allProps} />;
}
