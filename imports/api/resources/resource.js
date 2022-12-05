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
  images: { type: Array, optional: true },
  'images.$': { type: String },

  isCombo: { type: Boolean, optional: true },
  isBookable: { type: Boolean, optional: true },
  resourceIndex: { type: SimpleSchema.Integer },

  resourcesForCombo: { type: Array, defaultValue: [] },
  'resourcesForCombo.$': {
    type: new SimpleSchema({
      _id: { type: String },
      label: { type: String },
      description: { type: String, optional: true },
      resourceIndex: { type: SimpleSchema.Integer },
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
  userId: 1,
  label: 1,
  description: 1,
  images: 1,
  isBookable: 1,
  isCombo: 1,
  resourcesForCombo: 1,
  resourceIndex: 1,
  createdAt: 1,
};

export default Resources;
