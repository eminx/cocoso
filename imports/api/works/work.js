import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Works = new Mongo.Collection('works');

Works.schema = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,

  authorId: Schemas.Id,
  authorUsername: { type: String },

  authorAvatar: { type: String, regEx: SimpleSchema.RegEx.Url, optional: true },
  userAvatar: { type: String, optional: true }, // mostly undefined

  title: { type: String },
  shortDescription: { type: String, defaultValue: '' },
  longDescription: { type: String, defaultValue: '' },
  additionalInfo: { type: String, defaultValue: '' },

  images: { type: Array, optional: true },
  'images.$': { type: String },

  category: { type: Object, optional: true },
  'category.categoryId': { type: Schemas.Id },
  'category.label': { type: String },
  'category.color': { type: String },

  creationDate: { type: Date },
  latestUpdate: { type: Date, optional: true },
});

Works.attachSchema(Works.schema);

export default Works;
