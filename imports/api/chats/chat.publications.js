import { Meteor } from 'meteor/meteor';
// import { getHost } from '../_utils/shared';
import Chats from './chat';

Meteor.publish('chat', (contextId) => {
  // const host = getHost(this);
  const user = Meteor.user();
  if (user) {
    return Chats.find({
      contextId,
    });
  }
});
