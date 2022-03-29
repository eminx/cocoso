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
  imageUrl: Schemas.Src,
  isCombo: {type: Boolean},
  resourceIndex: {type: SimpleSchema.Integer},
  resourcesForCombo: {type: Array},
  'resourcesForCombo.$': Schemas.Id,

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