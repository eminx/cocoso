import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';

import Process from './Process';
import Processes from '../../../api/processes/process';
import Chats from '../../../api/chats/chat';
import Activities from '../../../api/activities/activity';
// import Resources from '../../../api/resources/resource';

export default ProcessContainer = withTracker((props) => {
  const processId = props.match.params.id;
  const processSubscription = Meteor.subscribe('process', processId);
  const activitiesSubscription = Meteor.subscribe('activities');
  const isLoading = !processSubscription.ready() || !activitiesSubscription.ready();
  const process = Processes ? Processes.findOne({ _id: processId }) : null;
  const currentUser = Meteor.user();
  // const resourcesSub = Meteor.subscribe('resources');
  // const resources = Resources ? Resources.find().fetch() : null;

  const processActivities = Activities ? Activities.find({ processId }).fetch() : null;
  const processMeetings = processActivities.map(activity => {
    if (activity.datesAndTimes.length > 0) {
      return {...activity.datesAndTimes[0], _id: activity._id};
    }
  });
  const chatSubscription = Meteor.subscribe('chat', processId);
  const chatData = Chats ? Chats.findOne({ contextId: processId }) : null;

  const [t] = useTranslation('processes');
  const [tc] = useTranslation('common');

  return {
    isLoading,
    process,
    currentUser,
    chatData,
    processMeetings,
    // resources,
    t,
    tc,
  };
})(Process);
