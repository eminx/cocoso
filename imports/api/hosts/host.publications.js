import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';
import { isContributorOrAdmin } from '../users/user.roles';
import Hosts from './host';

Meteor.publish('currentHost', function subscribeCurrentHost() {
  const host = getHost(this);
  return Hosts.find({ host }, { fields: { settings: true, logo: true } });
});

Meteor.publish('members', function subscribeMembers() {
  const user = Meteor.user();
  const host = getHost(this);
  const currentHost = Hosts.findOne({ host });

  if (!user || (!user.isSuperAdmin && !isContributorOrAdmin(user, currentHost))) {
    return null;
  }

  return Hosts.find({ host });
});
