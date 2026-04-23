import { Meteor } from 'meteor/meteor';

import { getHost } from '../_utils/shared';
import Hosts from '../hosts/host';
import Reports from './report';

const isUserAdmin = (members, userId) =>
  members.some((m) => m.id === userId && m.role === 'admin');

Meteor.publish('reports', async function () {
  if (!this.userId) return this.ready();

  const user = await Meteor.users.findOneAsync(this.userId, {
    fields: { isSuperAdmin: 1 },
  });
  const host = getHost(this);
  const currentHost = await Hosts.findOneAsync({ host });
  const isAdmin = currentHost && isUserAdmin(currentHost.members, this.userId);

  if (!user?.isSuperAdmin && !isAdmin) return this.ready();

  return Reports.find({}, { sort: { createdAt: -1 } });
});
