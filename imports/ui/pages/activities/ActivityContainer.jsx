import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';

import Activity from './Activity';
// import Chats from '../../../api/chats/chat';
import Activities from '../../../api/activities/activity';

const ActivityContainer = withTracker((props) => {
  const activityId = props.match.params.activityId;
  const activity = Meteor.subscribe('activity', activityId);

  const isLoading = !activity.ready();
  const activityData = Activities ? Activities.findOne({ _id: activityId }) : null;
  const currentUser = Meteor.user();

  // const chatSubscription = Meteor.subscribe('chat', activityId);
  // const chatData = Chats ? Chats.findOne({ contextId: activityId }) : null;

  return {
    isLoading,
    activityData,
    currentUser,
    // chatData,
  };
})(Activity);

export default function (props) {
  const [t] = useTranslation('activities');
  const [tc] = useTranslation('common');

  const allProps = {
    ...props,
    t,
    tc,
  };

  return <ActivityContainer {...allProps} />;
}
