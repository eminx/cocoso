import SimpleSchema from 'simpl-schema';
import { avatarSchema } from './user'

export const resourceSchema = new SimpleSchema({
  // _id: {type: String},
  host: {type: String},
  authorId: {type: String},
  authorUsername: {type: String},
  authorFirstName: {type: String},
  authorLastName: {type: String},
  authorAvatar: {type: avatarSchema},

  label: {type: String},
  labelLowerCase: {type: String},
  description: {type: String},
  hourlyFee: {type: String},
  isCombo: {type: Boolean},

  resourceIndex: {type: SimpleSchema.Integer},
  resourcesForCombo: {type: Array},
  'resourcesForCombo.$': {type: new SimpleSchema({
    _id: {type: String},
    host: {type: String},
    authorId: {type: String},
    authorUsername: {type: String},
    authorFirstName: {type: String},
    authorLastName: {type: String},
    authorAvatar: {type: avatarSchema},

    label: {type: String},
    labelLowerCase: {type: String},
    description: {type: String},
    hourlyFee: {type: String},
    isCombo: {type: Boolean},
    resourceIndex: {type: SimpleSchema.Integer},
    
    updatedBy: {type: String},
    latestUpdate: {type: Date},
    creationDate: {type: Date},
  })},

  updatedBy: {type: String},
  latestUpdate: {type: Date},
  creationDate: {type: Date},

});