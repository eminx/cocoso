import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Keywords = new Mongo.Collection('keywords');

Keywords.schema = new SimpleSchema({
  _id: Schemas.Id,
  assignedMembers: { type: Array, defaultValue: [] },
  'assignedMembers.$': {
    type: new SimpleSchema({
      userId: Schemas.Id,
      username: { type: String },
    }),
    optional: true,
  },
  creatorId: Schemas.Id,
  creatorUsername: { type: String },
  creationDate: { type: Date },
  host: Schemas.Hostname,
  hostname: { type: String },
  label: { type: String },
});

Keywords.attachSchema(Keywords.schema);

export default Keywords;
