import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';
import { isContributorOrAdmin } from '../users/user.roles';
import Hosts from './host';
import Memberships from '../memberships/membership';

Meteor.publish('currentHost', function () {
  const host = getHost(this);
  return Hosts.find({ host }, { fields: { host: 1, settings: 1, logo: 1, isPortalHost: 1 } });
});

Meteor.publish('host', function (host) {
  return Hosts.find({ host }, { fields: { host: 1, settings: 1, logo: 1, isPortalHost: 1 } });
});

Meteor.publish('hosts', function (hos) {
  return Hosts.find({}, { fields: { host: 1, settings: 1, logo: 1, isPortalHost: 1 } });
});

Meteor.publish('members', async function () {
  if (!this.userId) return this.ready();

  const user = await Meteor.users.findOneAsync(this.userId, {
    fields: { isSuperAdmin: 1 },
  });
  const host = getHost(this);
  const isAllowed =
    user?.isSuperAdmin || (await isContributorOrAdmin(this.userId, host));

  if (!isAllowed) return this.ready();

  return Memberships.find(
    { host },
    { fields: { userId: 1, host: 1, role: 1, isPublic: 1, joinDate: 1 } }
  );
});
