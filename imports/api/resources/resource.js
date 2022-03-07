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
  authorAvatar: {type: new SimpleSchema(Schemas.Avatar), optional: true },

  label: {type: String},
  labelLowerCase: {type: String},
  description: {type: String},
  hourlyFee: {type: String, optional: true},
  isCombo: {type: Boolean},

  resourceIndex: {type: SimpleSchema.Integer, optional: true},
  resourcesForCombo: {type: Array, optional: true},
  'resourcesForCombo.$': new SimpleSchema({
    _id: Schemas.Id,
    host: {type: new SimpleSchema(Schemas.Hostname), optional: true },
    
    authorId: {type: new SimpleSchema(Schemas.Id), optional: true },
    authorUsername: {type: String, optional: true },
    authorFirstName: {type: String, optional: true },
    authorLastName: {type: String, optional: true },
    authorAvatar: {type: new SimpleSchema(Schemas.Avatar), optional: true },

    label: {type: String},
    labelLowerCase: {type: String, optional: true },
    description: {type: String, optional: true },
    hourlyFee: {type: String, optional: true},
    isCombo: {type: Boolean, optional: true },
    resourceIndex: {type: SimpleSchema.Integer, optional: true},
    
    updatedBy: {type: String, optional: true},
    latestUpdate: {type: Date, optional: true},
    creationDate: {type: Date, optional: true },
  }),

  updatedBy: {type: String, optional: true},
  latestUpdate: {type: Date, optional: true},
  creationDate: {type: Date},

});

Resources.publicFields = {
  label: 1,
  description: 1,
  isCombo: 1,
  resourcesForCombo: 1,
  authorUsername: 1,
  creationDate: 1,
};

// Resources.attachSchema(Resources.schema);

export default Resources;