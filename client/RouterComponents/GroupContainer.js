import { withTracker } from 'meteor/react-meteor-data';
import Group from './Group';
 
export default GroupContainer = withTracker((props) => {
  const groupId = props.match.params.id;
  const groupSubscription = Meteor.subscribe('group', groupId);
  const isLoading = !groupSubscription.ready();
  const groupData = Groups ? Groups.findOne({_id: groupId}) : null;
  const currentUser = Meteor.user();

  const chatSubscription = Meteor.subscribe('chat', groupId);
  const chatData = Chats ? Chats.findOne({contextId: groupId}) : null;

  return {
    isLoading,
    groupData,
    currentUser,
    chatData
  };
})(Group);