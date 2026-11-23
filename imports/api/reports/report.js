import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { Schemas } from '../_utils/schemas';

const Reports = new Mongo.Collection('reports');

Reports.schema = new SimpleSchema({
  createdAt: { type: Date },
  contentId: { type: String, optional: true },
  contentType: { type: String }, // 'directMessage' | 'activities' | 'groups' | 'works' | 'info' | 'users'
  description: { type: String },
  host: Schemas.Hostname,
  reportedLink: { type: String, optional: true },
  reportedTitle: { type: String, optional: true },
  reportedUserId: { type: String, optional: true },
  reporterId: { type: String },
  reviewNote: { type: String, optional: true },
  reviewedBy: { type: String, optional: true },
  reviewedAt: { type: Date, optional: true },
  status: { type: String, defaultValue: 'pending' }, // 'pending' | 'reviewed' | 'resolved' | 'dismissed'
});

Reports.attachSchema(Reports.schema);

export default Reports;
