import SimpleSchema from 'simpl-schema';

export const pageSchema = new SimpleSchema({
  // _id: {type: String},
  host: {type: String},
  authorId: {type: String},
  authorName: {type: String},
  title: {type: String},
  longDescription: {type: String},
  isPublished: {type: Boolean},
  latestUpdate: {type: Date},
  creationDate: {type: Date},
});


export const pageCreateSchema = new SimpleSchema({
  host: {type: String},
  authorId: {type: String},
  authorName: {type: String},
  title: {type: String},
  longDescription: {type: String},
  isPublished: {type: Boolean},
  creationDate: {type: Date},
});
export const pageUpdateSchema = new SimpleSchema({
  title: {type: String},
  longDescription: {type: String},
  latestUpdate: {type: Date},
});