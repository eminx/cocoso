import SimpleSchema from 'simpl-schema';

export const categorySchema = new SimpleSchema({
  // _id: {type: String},
  host: {type: String},
  type: {type: String},
  label: {type: String},
  color: {type: String},
  addedBy: {type: String},
  addedUsername: {type: String},
  addedDate: {type: Date},
});
