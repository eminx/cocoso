import { Meteor } from 'meteor/meteor';
import Chats from './chat';

Meteor.publish('chat', (contextId) => {
  const user = Meteor.user();
  if (user) {
    return Chats.find({
      contextId,
    });
  }
});
