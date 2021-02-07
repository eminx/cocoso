import { withTracker } from 'meteor/react-meteor-data';
import Process from './Process';

export default ProcessContainer = withTracker((props) => {
  const processId = props.match.params.id;
  const processSubscription = Meteor.subscribeLite('process', processId);
  const isLoading = !processSubscription.ready();
  const process = Processes ? Processes.findOne({ _id: processId }) : null;
  const currentUser = Meteor.user();
  const resourcesSub = Meteor.subscribeLite('resources');
  const resources = Resources ? Resources.find().fetch() : null;

  const chatSubscription = Meteor.subscribeLite('chat', processId);
  const chatData = Chats ? Chats.findOne({ contextId: processId }) : null;

  return {
    isLoading,
    process,
    currentUser,
    chatData,
    resources,
  };
})(Process);
