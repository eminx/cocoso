import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { getHost } from '../_utils/shared';
import Reports from './report';
import { isAdmin } from '../users/user.roles';

Meteor.methods({
  async reports_create({ reportedUserId, contentType, contentId, description }) {
    check(reportedUserId, Match.Maybe(String));
    check(contentType, String);
    check(contentId, Match.Maybe(String));
    check(description, String);

    const user = await Meteor.userAsync();
    if (!user) throw new Meteor.Error('not-authorized');
    if (!description.trim()) throw new Meteor.Error('description-required', 'Please describe the issue.');

    return Reports.insertAsync({
      reporterId: user._id,
      reportedUserId: reportedUserId ?? undefined,
      contentType,
      contentId: contentId ?? undefined,
      description: description.trim(),
      createdAt: new Date(),
      status: 'pending',
    });
  },

  async getReports() {
    const user = await Meteor.userAsync();
    if (!user) throw new Meteor.Error('not-authorized');

    const host = getHost(this);
    const isAdminUser = await isAdmin(user._id, host);
    if (!user.isSuperAdmin && !isAdminUser) throw new Meteor.Error('not-authorized');

    const reports = await Reports.find({}, { sort: { createdAt: -1 } }).fetchAsync();

    const userIds = [...new Set(reports.flatMap((r) => [r.reporterId, r.reportedUserId].filter(Boolean)))];
    const users = await Meteor.users.find({ _id: { $in: userIds } }, { fields: { username: 1 } }).fetchAsync();
    const usernameById = Object.fromEntries(users.map((u) => [u._id, u.username]));

    return reports.map((r) => ({
      ...r,
      reporterUsername: usernameById[r.reporterId] ?? r.reporterId,
      reportedUsername: r.reportedUserId ? (usernameById[r.reportedUserId] ?? r.reportedUserId) : undefined,
    }));
  },

  async reports_updateStatus({ reportId, status, reviewNote }) {
    check(reportId, String);
    check(status, String);
    check(reviewNote, Match.Maybe(String));

    const user = await Meteor.userAsync();
    if (!user) throw new Meteor.Error('not-authorized');

    const host = getHost(this);
    const isAdminUser = await isAdmin(user._id, host);
    if (!user.isSuperAdmin && !isAdminUser) throw new Meteor.Error('not-authorized');

    return Reports.updateAsync(reportId, {
      $set: {
        status,
        reviewNote: reviewNote ?? '',
        reviewedBy: user._id,
        reviewedAt: new Date(),
      },
    });
  },
});
