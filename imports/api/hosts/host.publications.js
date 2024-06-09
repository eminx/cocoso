import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';
import { isContributorOrAdmin } from '../users/user.roles';
import Hosts from './host';

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

Meteor.publish('members', function () {
  const user = Meteor.user();
  const host = getHost(this);
  const currentHost = Hosts.findOne({ host });

  if (!user || (!user.isSuperAdmin && !isContributorOrAdmin(user, currentHost))) {
    return null;
  }

  return Hosts.find({ host });
});
