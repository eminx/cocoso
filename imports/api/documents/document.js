import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Documents = new Mongo.Collection('documents');

Documents.schema = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,

  uploadedBy: Schemas.Id,
  uploadedUsername: { type: String },
  uploadedByName: { type: String },

  contextType: { type: String },
  attachedTo: Schemas.Id,

  documentLabel: { type: String },
  documentUrl: { type: String },

  creationDate: { type: Date },
});

Documents.attachSchema(Documents.schema);

Documents.publicFields = {
  documentLabel: 1,
  documentUrl: 1,
};

export default Documents;
