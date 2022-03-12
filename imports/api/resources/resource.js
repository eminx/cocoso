import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

const Resources = new Mongo.Collection('resources');

Resources.schema = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,
  
  authorId: Schemas.Id,
  authorUsername: {type: String},

  label: {type: String},
  description: {type: String},
  isCombo: {type: Boolean},

  resourceIndex: {type: SimpleSchema.Integer},
  resourcesForCombo: {type: Array},
  'resourcesForCombo.$': Schemas.Id,

  createdAt: {type: Date},
  updatedAt: {type: Date, optional: true},
  updatedBy: {type: String, optional: true},
});

Resources.attachSchema(Resources.schema);

Resources.publicFields = {
  label: 1,
  description: 1,
  isCombo: 1,
  resourcesForCombo: 1,
  authorUsername: 1,
  createdAt: 1,
};

export default Resources;