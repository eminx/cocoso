import SimpleSchema from 'simpl-schema';
import { avatarSchema } from './user'

export const workSchema = new SimpleSchema({
  // _id: {type: String},
  host: {type: String},
  authorId: {type: String},
  authorUsername: {type: String},

  authorFirstName: {type: String},
  authorLastName: {type: String},
  authorAvatar: {type: avatarSchema},
  userAvatar: {type: String}, // mostly undefined

  title: {type: String},
  shortDescription: {type: String},
  longDescription: {type: String},
  additionalInfo: {type: String},

  images: {type: Array},
  'images.$': {type: String},

  category: {type: Object},
  'category.label': {type: String},
  'category.color': {type: String},
  'category.categoryId': {type: String},

  latestUpdate: {type: Date},
  creationDate: {type: Date},
});

