import { Meteor } from 'meteor/meteor';
import DirectMessages from './directMessage';

// All conversations the current user is part of (metadata only — no messages)
Meteor.publish('directMessages', function () {
  if (!this.userId) return this.ready();
  return DirectMessages.find(
    { participantIds: this.userId },
    { fields: { messages: 0 } }
  );
});

// Full message list for one conversation
Meteor.publish('directMessage', function (conversationId) {
  if (!this.userId) return this.ready();
  return DirectMessages.find({
    _id: conversationId,
    participantIds: this.userId,
  });
});

// Minimal public profile fields needed for DM UI — username + publicKey only
Meteor.publish('dmParticipant', function (userId) {
  if (!this.userId) return this.ready();
  return Meteor.users.find(
    { _id: userId },
    { fields: { username: 1, avatar: 1, publicKey: 1 } }
  );
});
