import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Pages = new Mongo.Collection('pages');

Pages.schema = new SimpleSchema({
  _id: Schemas.Id,
  title: { type: String },
  host: Schemas.Hostname,

  authorId: Schemas.Id,
  authorName: { type: String },

  longDescription: { type: String },
  isPublished: {
    type: Boolean,
    defaultValue: true,
  },

  images: { type: Array, optional: true },
  'images.$': { type: String },

  order: { type: Number },

  creationDate: { type: Date },
  latestUpdate: {
    type: Date,
    optional: true,
  },
});

Pages.attachSchema(Pages.schema);

export default Pages;
