import { withTracker } from 'meteor/react-meteor-data';
import Group from './Group';

export default (GroupContainer = withTracker(props => {
  const groupId = props.match.params.id;
  const groupSubscription = Meteor.subscribe('group', groupId);
  const isLoading = !groupSubscription.ready();
  const group = Groups ? Groups.findOne({ _id: groupId }) : null;
  const currentUser = Meteor.user();
  const placesSub = Meteor.subscribe('places');
  const places = Places ? Places.find().fetch() : null;

  const chatSubscription = Meteor.subscribe('chat', groupId);
  const chatData = Chats ? Chats.findOne({ contextId: groupId }) : null;

  return {
    isLoading,
    group,
    currentUser,
    chatData,
    places
  };
})(Group));
