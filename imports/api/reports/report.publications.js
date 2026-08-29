import { Meteor } from 'meteor/meteor';

import { getHost } from '../_utils/shared';
import Reports from './report';
import { isAdmin } from '../users/user.roles';

Meteor.publish('reports', async function () {
  if (!this.userId) return this.ready();

  const user = await Meteor.users.findOneAsync(this.userId, {
    fields: { isSuperAdmin: 1 },
  });
  const host = getHost(this);
  const isAdminUser = await isAdmin(this.userId, host);

  if (!user?.isSuperAdmin && !isAdminUser) return this.ready();

  return Reports.find({}, { sort: { createdAt: -1 } });
});
