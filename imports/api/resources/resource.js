import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

const Resources = new Mongo.Collection('resources');

Resources.schema = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,
  userId: Schemas.Id,

  label: {type: String},
  description: {type: String},
  imageUrl: { type: Schemas.Src, optional: true },
  isCombo: {type: Boolean},
  resourceIndex: {type: SimpleSchema.Integer},
  resourcesForCombo: {type: Array},
  'resourcesForCombo.$': Schemas.Id,

  bookings: { type: Array, defaultValue: [] },
  'bookings.$': { type: new SimpleSchema({
    startDate: { type: String },
    endDate: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    description: { type: String },
    userId: Schemas.Id,
    bookedBy: { type: String },
    bookedAt: { type: Date },
  }), optional: true },

  createdBy: {type: String},
  createdAt: {type: Date},
  updatedBy: {type: String, optional: true},
  updatedAt: {type: Date, optional: true},
});

Resources.attachSchema(Resources.schema);

Resources.publicFields = {
  label: 1,
  description: 1,
  imageUrl: 1,
  isCombo: 1,
  resourcesForCombo: 1,
  resourceIndex: 1,
  createdBy: 1,
  createdAt: 1,
};

export default Resources;