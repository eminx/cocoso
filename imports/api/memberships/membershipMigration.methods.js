import { Meteor } from 'meteor/meteor';

import Hosts from '../hosts/host';
import MembershipConflictReports from './membershipConflictReport';

// Ops-only, repeatable dry-run: compares Meteor.users.memberships[] against
// Hosts.members[] and records every (userId, host) pair that disagrees or is
// missing on one side. Does NOT write to Memberships and does NOT auto-
// resolve anything — a human reviews MembershipConflictReports and hand-fixes
// the source arrays, then re-runs this until conflictCount is 0. Only then
// is it safe to run the version-18 migration (see migrations.js).
Meteor.methods({
  async membershipMigration_dryRun() {
    const user = await Meteor.userAsync();
    if (!user || !user.isSuperAdmin) {
      throw new Meteor.Error('not-authorized', 'Only a super admin can run this');
    }

    await MembershipConflictReports.removeAsync({});

    const fromUsers = new Map();
    await Meteor.users
      .find({}, { fields: { memberships: 1 } })
      .forEachAsync((u) => {
        (u.memberships ?? []).forEach((m) => {
          fromUsers.set(`${u._id}::${m.host}`, {
            userId: u._id,
            host: m.host,
            role: m.role,
            isPublic: m.isPublic !== false,
          });
        });
      });

    const fromHosts = new Map();
    await Hosts.find({}, { fields: { host: 1, members: 1 } }).forEachAsync(
      (h) => {
        (h.members ?? []).forEach((m) => {
          fromHosts.set(`${m.id}::${h.host}`, {
            userId: m.id,
            host: h.host,
            role: m.role,
            isPublic: m.isPublic !== false,
          });
        });
      }
    );

    const allKeys = new Set([...fromUsers.keys(), ...fromHosts.keys()]);

    let conflictCount = 0;
    let cleanCount = 0;

    for (const key of allKeys) {
      const userSide = fromUsers.get(key);
      const hostSide = fromHosts.get(key);

      const missingOnUser = !userSide;
      const missingOnHost = !hostSide;
      const roleMismatch = Boolean(
        userSide && hostSide && userSide.role !== hostSide.role
      );
      const isPublicMismatch = Boolean(
        userSide && hostSide && userSide.isPublic !== hostSide.isPublic
      );

      if (missingOnUser || missingOnHost || roleMismatch || isPublicMismatch) {
        conflictCount += 1;
        const [userId, host] = key.split('::');
        await MembershipConflictReports.insertAsync({
          userId,
          host,
          fromUser: userSide ?? null,
          fromHost: hostSide ?? null,
          missingOnUser,
          missingOnHost,
          roleMismatch,
          isPublicMismatch,
          detectedAt: new Date(),
        });
      } else {
        cleanCount += 1;
      }
    }

    const summary = {
      totalPairsChecked: allKeys.size,
      conflictCount,
      cleanCount,
    };

    console.log('[membershipMigration_dryRun]', summary);

    return summary;
  },
});
