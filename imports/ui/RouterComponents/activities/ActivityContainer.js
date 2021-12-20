import { withTracker } from 'meteor/react-meteor-data';
import Activity from './Activity';
import Chats from '../../../api/chats/chat';

export default ActivityContainer = withTracker((props) => {
  const activityId = props.match.params.id;
  const activity = Meteor.subscribe('activity', activityId);

  const isLoading = !activity.ready();
  const activityData = Activities
    ? Activities.findOne({ _id: activityId })
    : null;
  const currentUser = Meteor.user();

  const chatSubscription = Meteor.subscribe('chat', activityId);
  const chatData = Chats ? Chats.findOne({ contextId: activityId }) : null;

  return {
    isLoading,
    activityData,
    currentUser,
    chatData,
  };
})(Activity);
