import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Resources = new Mongo.Collection('resources');

Resources.schema = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,
  userId: Schemas.Id,

  label: { type: String },
  description: { type: String, optional: true },
  documents: { type: Array, optional: true, defaultValue: [] },
  'documents.$': {
    type: new SimpleSchema({
      documentId: { type: String },
      downloadUrl: { type: String },
      label: { type: String },
    }),
    optional: true,
  },
  images: { type: Array, optional: true },
  'images.$': { type: String },

  isBookable: { type: Boolean, defaultValue: true },
  isCombo: { type: Boolean, defaultValue: false },

  resourcesForCombo: { type: Array, defaultValue: [] },
  'resourcesForCombo.$': {
    type: new SimpleSchema({
      _id: { type: String },
      label: { type: String },
      description: { type: String, optional: true },
    }),
    optional: true,
  },

  createdBy: { type: String, optional: true },
  createdAt: { type: Date, optional: true },
  updatedBy: { type: String, optional: true },
  updatedAt: { type: Date, optional: true },
});

Resources.attachSchema(Resources.schema);

Resources.publicFields = {
  _id: 1,
  description: 1,
  host: 1,
  images: 1,
  isBookable: 1,
  isCombo: 1,
  label: 1,
  resourcesForCombo: 1,
  createdAt: 1,
  userId: 1,
};

export default Resources;
