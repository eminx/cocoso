import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Reports = new Mongo.Collection('reports');

Reports.schema = new SimpleSchema({
  reporterId: { type: String },
  reportedUserId: { type: String, optional: true },
  contentType: { type: String }, // 'directMessage' | 'activity' | 'group' | 'work' | 'page' | 'user'
  contentId: { type: String, optional: true },
  description: { type: String },
  createdAt: { type: Date },
  status: { type: String, defaultValue: 'pending' }, // 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  reviewNote: { type: String, optional: true },
  reviewedBy: { type: String, optional: true },
  reviewedAt: { type: Date, optional: true },
});

Reports.attachSchema(Reports.schema);

export default Reports;
