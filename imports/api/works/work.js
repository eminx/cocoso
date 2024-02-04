import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Works = new Mongo.Collection('works');

Works.schema = new SimpleSchema({
  _id: Schemas.Id,
  additionalInfo: { type: String, defaultValue: '', optional: true },
  authorAvatar: { type: String, optional: true },
  authorId: Schemas.Id,
  authorUsername: { type: String },
  category: { type: Object, optional: true },
  'category.categoryId': { type: Schemas.Id },
  'category.label': { type: String },
  'category.color': { type: String },
  contactInfo: { type: String, optional: true },
  creationDate: { type: Date },
  documents: { type: Array, optional: true, defaultValue: [] },
  'documents.$': {
    type: new SimpleSchema({
      documentId: { type: String },
      downloadUrl: { type: String },
      label: { type: String },
    }),
    optional: true,
  },
  host: Schemas.Hostname,
  images: { type: Array, optional: true },
  'images.$': { type: String },
  latestUpdate: { type: Date, optional: true },
  longDescription: { type: String, defaultValue: '' },
  shortDescription: { type: String, defaultValue: '', optional: true },
  showAvatar: { type: Boolean, defaultValue: true, optional: true },
  title: { type: String },
});

Works.attachSchema(Works.schema);

export default Works;
