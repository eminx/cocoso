import { Meteor } from 'meteor/meteor';
import Chats from './chat';

Meteor.publish('chat', (contextId) => {
  const user = Meteor.user();
  if (!user) {
    return null;
  }
  return Chats.find({
    contextId,
  });
});
