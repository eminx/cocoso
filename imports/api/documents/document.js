import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

const Documents = new Mongo.Collection('documents');

Schemas.Document = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,

  uploadedBy: Schemas.Id,
  uploadedUsername: {type: String},
  uploadedByName: {type: String},

  contextType: {type: String},
  documentLabel: {type: String},
  documentUrl: {type: String, regEx: SimpleSchema.RegEx.Url},

  creationDate: {type: Date},
});

Documents.attachSchema(Schemas.Document);

export default Documents;