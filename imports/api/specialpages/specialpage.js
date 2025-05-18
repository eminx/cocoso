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

  contentRows: { type: Array, maxCount: 21 },
  'contentRows.$': { type: Object },
  'contentRows.$.gridType': {
    type: String,
    allowedValues: ['full', '1+1', '1+1+1', '1+2', '2+1'],
    defaultValue: 'full',
  },
  'contentRows.$.columns': { type: Array, maxCount: 3 },
  'contentRows.$.columns.$': { type: Array },
  'contentRows.$.columns.$.$': { type: Object, optional: true },
  'contentRows.$.columns.$.$.type': {
    type: String,
    allowedValues: ['image', 'text', 'image-slider', 'image-banner', 'video-clip'],
  },
  'contentRows.$.columns.$.$.content': { type: Object, blackbox: true },

  isPublished: {
    type: Boolean,
    defaultValue: false,
  },

  creationDate: { type: Date },
  latestUpdate: {
    type: Date,
    optional: true,
  },
});

SpecialPages.attachSchema(SpecialPages.schema);

export default SpecialPages;
