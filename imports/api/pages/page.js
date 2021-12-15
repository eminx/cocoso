import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas, CustomValidators } from '../@/schemas';

const Pages = new Mongo.Collection('pages');

Schemas.Page = new SimpleSchema({
  // _id: {type: String, regEx: SimpleSchema.regEx.Id},
  host: {
    type: String,
    regEx: CustomValidators.RegEx.Hostname,
  },
  authorId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
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