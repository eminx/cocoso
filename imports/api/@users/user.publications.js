import { Meteor } from 'meteor/meteor';
import { getHost } from '../@/shared';

Meteor.publish('attendingEvents', function () {
  return Meteor.users.find(this.userId, {
    fields: {
      attending: 1,
      profile: 1,
      isSuperAdmin: 1,
    },
  });
});

Meteor.publish('me', function () {
  const userId = Meteor.userId();
  if (userId) {
    return Meteor.users.find(userId);
  }
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
