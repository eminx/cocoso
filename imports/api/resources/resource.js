import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

const Resources = new Mongo.Collection('resources');

Resources.schema = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,
  
  authorId: Schemas.Id,
  authorUsername: {type: String},
  authorFirstName: {type: String},
  authorLastName: {type: String},
  authorAvatar: new SimpleSchema(Schemas.Avatar),

  label: {type: String},
  labelLowerCase: {type: String},
  description: {type: String},
  hourlyFee: {type: String, optional: true},
  isCombo: {type: Boolean},

  resourceIndex: {type: SimpleSchema.Integer, optional: true},
  resourcesForCombo: {type: Array, optional: true},
  'resourcesForCombo.$': new SimpleSchema({
    _id: Schemas.Id,
    host: Schemas.Hostname,
    
    authorId: Schemas.Id,
    authorUsername: {type: String},
    authorFirstName: {type: String},
    authorLastName: {type: String},
    authorAvatar: new SimpleSchema(Schemas.Avatar),

    label: {type: String},
    labelLowerCase: {type: String},
    description: {type: String},
    hourlyFee: {type: String, optional: true},
    isCombo: {type: Boolean},
    resourceIndex: {type: SimpleSchema.Integer, optional: true},
    
    updatedBy: {type: String, optional: true},
    latestUpdate: {type: Date, optional: true},
    creationDate: {type: Date},
  }),

  updatedBy: {type: String, optional: true},
  latestUpdate: {type: Date, optional: true},
  creationDate: {type: Date},

});

Resources.attachSchema(Resources.schema);

export default Resources;