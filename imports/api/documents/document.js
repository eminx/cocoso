import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Documents = new Mongo.Collection('documents');

const documentSchema = new SimpleSchema({
  // _id: {type: String},
  host: {type: String},
  contextType: {type: String},
  documentLabel: {type: String},
  documentUrl: {type: String},
  uploadedBy: {type: String},
  uploadedUsername: {type: String},
  uploadedByName: {type: String},
  creationDate: {type: Date},
});

Documents.attachSchema(documentSchema);
export default Documents;