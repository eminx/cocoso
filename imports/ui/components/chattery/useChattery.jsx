import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import Chats from '../../../api/chats/chat';

const useChattery = (contextId, currentUser) =>
  useTracker(() => {
    const subscription = Meteor.subscribe('chat', contextId);
    const chat = Chats.findOne({ contextId });
    const discussion = chat?.messages?.map((message) => {
      return {
        ...message,
        isFromMe:
          currentUser && message && message.senderId === currentUser._id,
      };
    });
    return {
      discussion,
      isChatLoading: !subscription.ready(),
    };
  }, [contextId]);

export default useChattery;
