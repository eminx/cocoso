import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas, CustomValidators } from '../@/schemas';

const Categories = new Mongo.Collection('categories');

Schemas.Category = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,

  addedBy: Schemas.Id,
  addedUsername: {type: String},

  type: {type: String, optional: true},
  label: {type: String},
  color: {type: String},

  addedDate: {type: Date},
});

Categories.attachSchema(Schemas.Category);

export default Categories;