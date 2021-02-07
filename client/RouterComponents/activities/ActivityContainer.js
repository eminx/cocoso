import { withTracker } from 'meteor/react-meteor-data';
import Activity from './Activity';

export default ActivityContainer = withTracker((props) => {
  const activityId = props.match.params.id;
  const activity = Meteor.subscribeLite('activity', activityId);

  const isLoading = !activity.ready();
  const activityData = Activities
    ? Activities.findOne({ _id: activityId })
    : null;
  const currentUser = Meteor.user();

  const chatSubscription = Meteor.subscribeLite('chat', activityId);
  const chatData = Chats ? Chats.findOne({ contextId: activityId }) : null;

  return {
    isLoading,
    activityData,
    currentUser,
    chatData,
  };
})(Activity);
