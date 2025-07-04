import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { Schemas } from '../_utils/schemas';
import { contentTypes } from '/imports/ui/pages/composablepages/constants';
import { optional } from 'zod';

const ComposablePages = new Mongo.Collection('composablepages');

ComposablePages.schema = new SimpleSchema({
  _id: Schemas.Id,
  title: { type: String },
  host: Schemas.Hostname,

  authorId: Schemas.Id,
  authorUsername: { type: String },

  contentRows: { type: Array, maxCount: 21 },
  'contentRows.$': { type: Object },
  'contentRows.$.id': {
    type: String,
    optional: true,
  },
  'contentRows.$.key': {
    type: String,
    optional: true,
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
    optional: true,
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

  settings: { type: Object },
  'settings.hideTitle': { type: Boolean, defaultValue: false },
  'settings.hideMenu': { type: Boolean, defaultValue: false },

  creationDate: { type: Date },
  latestUpdate: {
    type: Date,
    optional: true,
  },
  latestUpdateAuthorId: { type: String, optional: true },
  latestUpdateAuthorUsername: { type: String, optional: true },
});

ComposablePages.attachSchema(ComposablePages.schema);

export default ComposablePages;
