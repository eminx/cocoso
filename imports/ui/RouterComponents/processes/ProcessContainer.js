import { withTracker } from 'meteor/react-meteor-data';
import Process from './Process';
import Processes from '../../../api/processes/process';
import Chats from '../../../api/chats/chat';

export default ProcessContainer = withTracker((props) => {
  const processId = props.match.params.id;
  const processSubscription = Meteor.subscribe('process', processId);
  const isLoading = !processSubscription.ready();
  const process = Processes ? Processes.findOne({ _id: processId }) : null;
  const currentUser = Meteor.user();
  const resourcesSub = Meteor.subscribe('resources');
  const resources = Resources ? Resources.find().fetch() : null;

  const chatSubscription = Meteor.subscribe('chat', processId);
  const chatData = Chats ? Chats.findOne({ contextId: processId }) : null;

  return {
    isLoading,
    process,
    currentUser,
    chatData,
    resources,
  };
})(Process);
