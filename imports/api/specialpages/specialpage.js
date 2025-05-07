import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const SpecialPages = new Mongo.Collection('specialpages');

SpecialPages.schema = new SimpleSchema({
  _id: Schemas.Id,
  title: { type: String },
  host: Schemas.Hostname,

  authorId: Schemas.Id,
  authorName: { type: String },

  contentRows: { type: Array },
  'contentRows.$': { type: Object },
  'contentRows.$.gridType': { type: String }, // 1+1+1 or 1+2 or 2+1 or 3
  'contentRows.$.columns': { type: Array },
  'contentRows.$.columns.$': { type: Object },
  'contentRows.$.columns.$.type': { type: String },
  'contentRows.$.columns.$.content': { type: Object },

  isPublished: {
    type: Boolean,
    defaultValue: true,
  },

  creationDate: { type: Date },
  latestUpdate: {
    type: Date,
    optional: true,
  },
});

SpecialPages.attachSchema(SpecialPages.schema);

export default SpecialPages;
