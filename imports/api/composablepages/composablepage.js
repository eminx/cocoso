import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { Schemas } from '../_utils/schemas';
import { contentTypes } from '/imports/ui/pages/composablepages/constants';

const ComposablePages = new Mongo.Collection('composablepages');

ComposablePages.schema = new SimpleSchema({
  _id: Schemas.Id,
  title: { type: String },
  host: Schemas.Hostname,

  authorId: Schemas.Id,
  authorName: { type: String },

  contentRows: { type: Array, maxCount: 21 },
  'contentRows.$': { type: Object },
  'contentRows.$.id': {
    type: String,
  },
  'contentRows.$.gridType': {
    type: String,
    allowedValues: ['full', '1+1', '1+1+1', '1+2', '2+1'],
    defaultValue: 'full',
  },
  'contentRows.$.columns': { type: Array, maxCount: 3 },
  'contentRows.$.columns.$': { type: Array },
  'contentRows.$.columns.$.$': { type: Object, optional: true },
  'contentRows.$.columns.$.$.id': {
    type: String,
  },
  'contentRows.$.columns.$.$.type': {
    type: String,
    allowedValues: contentTypes.map((content) => content.type),
  },
  'contentRows.$.columns.$.$.value': { type: Object, blackbox: true },

  isPublished: {
    type: Boolean,
    defaultValue: false,
  },

  creationDate: { type: Date },
  latestUpdate: {
    type: Date,
    optional: true,
  },
  latestUpdateAuthorId: { type: String, optional: true },
});

ComposablePages.attachSchema(ComposablePages.schema);

export default ComposablePages;
