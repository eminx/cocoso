import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';

import Process from './Process';
import Processes from '../../../api/processes/process';
import Chats from '../../../api/chats/chat';
import Activities from '../../../api/activities/activity';

const ProcessContainer = withTracker((props) => {
  const processId = props.match.params.processId;
  const processSubscription = Meteor.subscribe('process', processId);
  const activitiesSubscription = Meteor.subscribe('activities');
  const isLoading = !processSubscription.ready() || !activitiesSubscription.ready();
  const process = Processes ? Processes.findOne({ _id: processId }) : null;
  const currentUser = Meteor.user();

  const allActivities = Activities ? Activities.find().fetch() : null;
  const processActivities = Activities ? Activities.find({ processId }).fetch() : null;
  const processMeetings = processActivities.map((activity) => {
    if (!activity.datesAndTimes || activity.datesAndTimes.length === 0) {
      return;
    }
    return {
      _id: activity._id,
      resource: activity.resource,
      resourceId: activity.resourceId,
      resourceIndex: activity.resourceIndex,
      ...activity.datesAndTimes[0],
    };
  });
  const chatSubscription = Meteor.subscribe('chat', processId);
  const chatData = Chats ? Chats.findOne({ contextId: processId }) : null;

  return {
    isLoading,
    process,
    currentUser,
    chatData,
    processMeetings,
    allActivities,
  };
})(Process);

export default function (props) {
  const [t] = useTranslation('processes');
  const [tc] = useTranslation('common');

  const allProps = {
    ...props,
    t,
    tc,
  };

  return <ProcessContainer {...allProps} />;
}
