import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import Group from './Group';
import Groups from '../../../api/groups/group';
import Chats from '../../../api/chats/chat';
import Activities from '../../../api/activities/activity';

const GroupContainer = withTracker(({ groupId }) => {
  const groupSubscription = Meteor.subscribe('group', groupId);
  const activitiesSubscription = Meteor.subscribe('activities');
  const isLoading = !groupSubscription.ready() || !activitiesSubscription.ready();
  const group = Groups ? Groups.findOne({ _id: groupId }) : null;
  const currentUser = Meteor.user();

  const allActivities = Activities ? Activities.find().fetch() : null;
  const groupActivities = Activities ? Activities.find({ groupId }).fetch() : null;
  const groupMeetings = groupActivities
    .sort((a, b) => {
      if (!a?.datesAndTimes || !b?.datesAndTimes) {
        return 1;
      }
      return moment(a.datesAndTimes[0].startDate) - moment(b.datesAndTimes[0].startDate);
    })
    .map((activity) => {
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
  const chatSubscription = Meteor.subscribe('chat', groupId);
  const chatData = Chats ? Chats.findOne({ contextId: groupId }) : null;

  return {
    isLoading,
    group,
    currentUser,
    chatData,
    groupMeetings,
    allActivities,
  };
})(Group);

export default function (props) {
  const { groupId } = useParams();
  const [t] = useTranslation('groups');
  const [tc] = useTranslation('common');
  const allProps = {
    ...props,
    groupId,
    t,
    tc,
  };

  return <GroupContainer {...allProps} />;
}
