import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';
import Memberships from '../memberships/membership';

Meteor.publish('attendingEvents', function () {
  return Meteor.users.find(this.userId, {
    fields: {
      attending: 1,
      profile: 1,
      isSuperAdmin: 1,
    },
  });
});

Meteor.publish('currentUser', function () {
  const userId = this.userId;
  if (!userId) {
    return null;
  }
  const user = Meteor.users.find(
    { _id: userId },
    {
      fields: {
        avatar: 1,
        bio: 1,
        contactInfo: 1,
        emails: 1,
        firstName: 1,
        groups: 1,
        isPublic: 1,
        isSuperAdmin: 1,
        keywords: 1,
        lang: 1,
        lastName: 1,
        notifications: 1,
        unreadMessageCount: 1,
        publicKey: 1,
        username: 1,
        blockedUserIds: 1,
      },
    }
  );
  return user;
});

// Every membership doc for the logged-in user — the client reattaches this
// as `currentUser.memberships` (see WrapperHybrid.tsx) since it no longer
// lives on the user doc itself.
Meteor.publish('myMemberships', function () {
  if (!this.userId) {
    return this.ready();
  }
  return Memberships.find({ userId: this.userId });
});

Meteor.publish('membersForPublic', async function () {
  const host = getHost(this);
  const memberships = await Memberships.find(
    { host },
    { fields: { userId: 1 } }
  ).fetchAsync();
  const userIds = memberships.map((m) => m.userId);

  return Meteor.users.find(
    { _id: { $in: userIds } },
    {
      fields: {
        _id: true,
        username: true,
        avatar: true,
        firstName: true,
        lastName: true,
        publicKey: true,
      },
    }
  );
});

Meteor.publish('memberAtHost', async function (username) {
  const host = getHost(this);
  const user = await Meteor.users.findOneAsync(
    { username },
    { fields: { _id: 1 } }
  );
  if (!user) {
    return this.ready();
  }
  const membership = await Memberships.findOneAsync({
    userId: user._id,
    host,
  });
  if (!membership) {
    return this.ready();
  }
  return Meteor.users.find({ username });
});
