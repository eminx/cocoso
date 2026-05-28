import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { getHost } from '../_utils/shared';
import Hosts from '../hosts/host';
import DirectMessages from './directMessage';
import { getDirectMessageEmailBody } from './directMessages.mails';

Meteor.methods({
  async directMessages_findOrCreate(otherUserId) {
    check(otherUserId, String);

    const user = await Meteor.userAsync();
    if (!user) throw new Meteor.Error('not-authorized');

    // Block check — either party may have blocked the other
    const blockedByMe = (user.blockedUserIds ?? []).includes(otherUserId);
    if (blockedByMe) throw new Meteor.Error('user-blocked', 'You have blocked this user.');

    const otherUser = await Meteor.users.findOneAsync(otherUserId, {
      fields: { username: 1, avatar: 1, blockedUserIds: 1 },
    });
    if (!otherUser) throw new Meteor.Error('user-not-found');

    const blockedByThem = (otherUser.blockedUserIds ?? []).includes(user._id);
    if (blockedByThem) throw new Meteor.Error('user-blocked', 'This user is not available.');

    // Canonical participant order — always sorted so the pair maps to one doc
    const participantIds = [user._id, otherUserId].sort();
    const existing = await DirectMessages.findOneAsync({ participantIds });
    if (existing) return existing._id;

    const participantUsernames = participantIds.map((id) =>
      id === user._id ? user.username : otherUser.username
    );
    const participantAvatars = participantIds.map((id) =>
      id === user._id ? user.avatar?.src ?? null : otherUser.avatar?.src ?? null
    );

    return DirectMessages.insertAsync({
      participantIds,
      participantUsernames,
      participantAvatars,
      createdAt: new Date(),
      messages: [],
    });
  },

  async directMessages_sendMessage({
    conversationId,
    recipientCiphertext,
    senderCiphertext,
  }) {
    check(conversationId, String);
    check(recipientCiphertext, String);
    check(senderCiphertext, String);

    const user = await Meteor.userAsync();
    if (!user) throw new Meteor.Error('not-authorized');

    const conversation = await DirectMessages.findOneAsync(conversationId);
    if (!conversation) throw new Meteor.Error('conversation-not-found');
    if (!conversation.participantIds.includes(user._id)) {
      throw new Meteor.Error('not-authorized');
    }

    // Block check — prevent sending if either party has blocked the other
    const otherUserId = conversation.participantIds.find((id) => id !== user._id);
    const blockedByMe = (user.blockedUserIds ?? []).includes(otherUserId);
    if (blockedByMe) throw new Meteor.Error('user-blocked');

    const otherUser = otherUserId
      ? await Meteor.users.findOneAsync(otherUserId, { fields: { blockedUserIds: 1 } })
      : null;
    const blockedByThem = (otherUser?.blockedUserIds ?? []).includes(user._id);
    if (blockedByThem) throw new Meteor.Error('user-blocked');

    const now = new Date();
    const senderIndex = conversation.participantIds.indexOf(user._id);
    const avatarUpdate =
      senderIndex !== -1
        ? { [`participantAvatars.${senderIndex}`]: user.avatar?.src ?? null }
        : {};

    await DirectMessages.updateAsync(conversationId, {
      $push: {
        messages: {
          senderId: user._id,
          recipientCiphertext,
          senderCiphertext,
          createdAt: now,
        },
      },
      $set: {
        lastMessageRecipientCiphertext: recipientCiphertext,
        lastMessageSenderCiphertext: senderCiphertext,
        lastMessageAt: now,
        lastMessageBy: user._id,
        ...avatarUpdate,
      },
    });

    const prevUnread = (conversation.unreadCounts ?? {})[otherUserId] ?? 0;

    await DirectMessages.rawCollection().updateOne(
      { _id: conversationId },
      { $inc: { [`unreadCounts.${otherUserId}`]: 1 } }
    );

    await Meteor.users.rawCollection().updateOne(
      { _id: otherUserId },
      { $inc: { unreadMessageCount: 1 } }
    );

    if (prevUnread === 0) {
      const host = getHost(this);
      Meteor.defer(async () => {
        try {
          const currentHost = await Hosts.findOneAsync({ host });
          const recipient = await Meteor.users.findOneAsync(otherUserId, {
            fields: { emails: 1, firstName: 1, username: 1, lang: 1 },
          });
          if (!recipient) return;
          const subject = `${user.username} — ${currentHost?.settings?.name ?? host}`;
          const emailBody = getDirectMessageEmailBody(user.username, currentHost, recipient);
          await Meteor.callAsync('sendEmail', otherUserId, subject, emailBody);
        } catch (e) {
          console.error('[DM email]', e);
        }
      });
    }
  },

  async directMessages_markAsRead(conversationId) {
    check(conversationId, String);
    const user = await Meteor.userAsync();
    if (!user) throw new Meteor.Error('not-authorized');

    const conversation = await DirectMessages.findOneAsync(conversationId, {
      fields: { participantIds: 1, unreadCounts: 1 },
    });
    if (!conversation || !conversation.participantIds.includes(user._id)) {
      throw new Meteor.Error('not-authorized');
    }

    const unreadCount = (conversation.unreadCounts ?? {})[user._id] ?? 0;
    if (unreadCount === 0) return;

    await DirectMessages.rawCollection().updateOne(
      { _id: conversationId },
      { $set: { [`unreadCounts.${user._id}`]: 0 } }
    );

    await Meteor.users.rawCollection().updateOne(
      { _id: user._id },
      [{ $set: { unreadMessageCount: { $max: [0, { $subtract: [{ $ifNull: ['$unreadMessageCount', 0] }, unreadCount] }] } } }]
    );
  },
});
