import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Memberships = new Mongo.Collection('memberships');

Memberships.schema = new SimpleSchema({
  userId: { type: String, regEx: SimpleSchema.RegEx.Id },
  host: Schemas.Hostname,
  role: { type: String, allowedValues: ['participant', 'contributor', 'admin'] },
  isPublic: { type: Boolean, defaultValue: true },
  date: { type: Date },
});

Memberships.attachSchema(Memberships.schema);

if (Meteor.isServer) {
  Meteor.startup(async () => {
    const raw = Memberships.rawCollection();
    await raw.createIndex({ userId: 1, host: 1 }, { unique: true, name: 'userId_host_unique' });
    await raw.createIndex({ host: 1, role: 1 }, { name: 'host_role' });
  });
}

export default Memberships;
