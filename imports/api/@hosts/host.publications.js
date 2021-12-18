import { Meteor } from 'meteor/meteor';
import { getHost, isContributorOrAdmin } from '../@/shared';
import Hosts from './host';

Meteor.publish('currentHost', function () {
  const host = getHost(this);
  return Hosts.find({ host }, { fields: { settings: true, logo: true } });
});

Meteor.publish('members', function () {
  const user = Meteor.user();
  const host = getHost(this);
  const currentHost = Hosts.findOne({ host });

  if (user.isSuperAdmin || isContributorOrAdmin(user, currentHost)) {
    return Hosts.find({ host });
  }
});