import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

const Pages = new Mongo.Collection('pages');

Schemas.Page = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,

  authorId: Schemas.Id,
  authorName: {type: String},

  title: {type: String},
  longDescription: {type: String},
  isPublished: {
    type: Boolean,
    defaultValue: true,
  },

  creationDate: {type: Date},
  latestUpdate: {
    type: Date,
    optional: true,
  },
});

Pages.attachSchema(Schemas.Page);

export default Pages;