import { Meteor } from 'meteor/meteor';
import DirectChats from './directChat';

// All conversations the current user is part of (metadata only — no messages)
Meteor.publish('directChats', function () {
  if (!this.userId) return this.ready();
  return DirectChats.find(
    { participantIds: this.userId },
    { fields: { messages: 0 } }
  );
});

// Full message list for one conversation
Meteor.publish('directChat', function (conversationId) {
  if (!this.userId) return this.ready();
  return DirectChats.find({
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
