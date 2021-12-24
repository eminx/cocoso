import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

const Works = new Mongo.Collection('works');

Schemas.Work = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,

  authorId: Schemas.Id,
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
  'images.$': Schemas.Src,

  category: {type: Object, optional: true},
  'category.categoryId': Schemas.Id,
  'category.label': {type: String},
  'category.color': {type: String},

  creationDate: {type: Date},
  latestUpdate: {type: Date, optional: true},
});

Works.attachSchema(Schemas.Work );

export default Works;
