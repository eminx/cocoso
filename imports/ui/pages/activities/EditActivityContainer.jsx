import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { useParams } from 'react-router-dom';

import EditActivity from './EditActivity';
import { parseAllBookingsWithResources } from '../../utils/shared';
import Resources from '../../../api/resources/resource';
import Activities from '../../../api/activities/activity';
import { useTranslation } from 'react-i18next';

const EditActivityContainer = withTracker((props) => {
  const activityId = props.activityId;
  const activitySub = Meteor.subscribe('activity', activityId);
  const activity = Activities ? Activities.findOne({ _id: activityId }) : null;

  const resourcesSub = Meteor.subscribe('resources');
  const resources = Resources ? Resources.find().fetch() : null;
  const activitiesSub = Meteor.subscribe('activities');
  const activities = Activities ? Activities.find().fetch() : null;
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();

  const allBookings = parseAllBookingsWithResources(activities, resources);

  const isLoading = !activitiesSub.ready() || !resourcesSub.ready();

  return {
    activity,
    allBookings,
    currentUser,
    resources,
    isLoading,
  };
})(EditActivity);

export default function (props) {
  const [t] = useTranslation('activities');
  const [tc] = useTranslation('common');
  const { activityId } = useParams();

  const allProps = {
    ...props,
    activityId,
    t,
    tc,
  };
  return <EditActivityContainer {...allProps} />;
}
