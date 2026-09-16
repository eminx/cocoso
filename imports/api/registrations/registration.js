import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Registrations = new Mongo.Collection('registrations');

Registrations.schema = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,
  occurrenceId: Schemas.Id,
  // Denormalized, immutable ancestor FK (a registration's activity never
  // changes) — avoids a double join (Registrations -> Occurrences ->
  // Activities) for "all registrations for this activity" admin views.
  activityId: Schemas.Id,

  email: Schemas.Email,
  username: { type: String, optional: true },
  firstName: { type: String, optional: true },
  lastName: { type: String, optional: true },
  numberOfPeople: { type: SimpleSchema.Integer, optional: true },

  registerDate: { type: Date },
});

Registrations.attachSchema(Registrations.schema);

if (Meteor.isServer) {
  Meteor.startup(async () => {
    const raw = Registrations.rawCollection();
    await raw.createIndex({ occurrenceId: 1 }, { name: 'occurrenceId' });
    await raw.createIndex(
      { occurrenceId: 1, email: 1 },
      { name: 'occurrenceId_email' }
    );
    await raw.createIndex({ email: 1 }, { name: 'email' });
    await raw.createIndex({ activityId: 1 }, { name: 'activityId' });
  });
}

export default Registrations;
