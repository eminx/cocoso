import { Meteor } from 'meteor/meteor';
import Chats from './chat';

Meteor.publish('chat', function (contextId) {
  const userId = this.userId;
  if (!userId) {
    return null;
  }
  return Chats.find({
    contextId,
  });
});
