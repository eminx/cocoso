import { Meteor } from 'meteor/meteor';
import { getHost } from '../@/shared';
import Chats from './chat';

Meteor.publish('chat', function (contextId) {
  const host = getHost(this);
  const user = Meteor.user();
  if (user) {
    return Chats.find({
      contextId: contextId,
    });
  }
});