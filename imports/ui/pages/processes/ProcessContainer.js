import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';

import Process from './Process';
import Processes from '../../../api/processes/process';
import Chats from '../../../api/chats/chat';
// import Resources from '../../../api/resources/resource';

export default ProcessContainer = withTracker((props) => {
  const processId = props.match.params.id;
  const processSubscription = Meteor.subscribe('process', processId);
  const isLoading = !processSubscription.ready();
  const process = Processes ? Processes.findOne({ _id: processId }) : null;
  const currentUser = Meteor.user();
  // const resourcesSub = Meteor.subscribe('resources');
  // const resources = Resources ? Resources.find().fetch() : null;

  const chatSubscription = Meteor.subscribe('chat', processId);
  const chatData = Chats ? Chats.findOne({ contextId: processId }) : null;

  const [ t ] = useTranslation('processes');
  const [ tc ] = useTranslation('common');

  return {
    isLoading,
    process,
    currentUser,
    chatData,
    // resources,
    t,
    tc,
  };
})(Process);
