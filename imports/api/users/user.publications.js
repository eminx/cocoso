import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';

Meteor.publish('attendingEvents', function () {
  return Meteor.users.find(this.userId, {
    fields: {
      attending: 1,
      profile: 1,
      isSuperAdmin: 1,
    },
  });
});

Meteor.publish('currentUser', () => {
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
        lang: 1,
        lastName: 1,
        memberships: 1,
        username: 1,
      },
    }
  );
  console.log('user', user);
  return user;
});

Meteor.publish('membersForPublic', function () {
  const host = getHost(this);
  // Meteor.users._ensureIndex({ 'memberships.host': host });
  return Meteor.users.find(
    { 'memberships.host': host },
    {
      fields: {
        _id: true,
        username: true,
        avatar: true,
        firstName: true,
        lastName: true,
      },
    }
  );
});

Meteor.publish('memberAtHost', function (username) {
  const host = getHost(this);
  return Meteor.users.find({
    username,
    'memberships.host': host,
  });
});
