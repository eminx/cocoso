import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';

Meteor.publish('attendingEvents', () =>
  Meteor.users.find(this.userId, {
    fields: {
      attending: 1,
      profile: 1,
      isSuperAdmin: 1,
    },
  })
);

Meteor.publish('me', () => {
  const userId = Meteor.userId();
  if (!userId) {
    return null;
  }
  return Meteor.users.find(userId);
});

Meteor.publish('membersForPublic', () => {
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

Meteor.publish('memberAtHost', (username) => {
  const host = getHost(this);
  return Meteor.users.find({
    username,
    'memberships.host': host,
  });
});
