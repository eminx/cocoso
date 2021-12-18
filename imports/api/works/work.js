import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

const Works = new Mongo.Collection('works');

const workSchema = new SimpleSchema({
  // _id: {type: String},
  host: Schemas.Host,
  authorId: {type: String},
  authorUsername: {type: String},

  authorFirstName: {type: String},
  authorLastName: {type: String},
  authorAvatar: new SimpleSchema(Schemas.Avatar),
  userAvatar: {type: String, optional: true}, // mostly undefined

  title: {type: String},
  shortDescription: {type: String, defaultValue: ""},
  longDescription: {type: String, defaultValue: ""},
  additionalInfo: {type: String, defaultValue: ""},

  images: {type: Array, optional: true},
  'images.$': {type: String},

  category: {type: Object, optional: true},
  'category.label': {type: String},
  'category.color': {type: String},
  'category.categoryId': {type: String},

  creationDate: {type: Date},
  latestUpdate: {type: Date, optional: true},
});

Works.attachSchema(workSchema);

export default Works;
