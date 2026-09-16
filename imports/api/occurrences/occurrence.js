import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Occurrences = new Mongo.Collection('occurrences');

Occurrences.schema = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,
  activityId: Schemas.Id,

  startDate: { type: String },
  startTime: { type: String },
  endDate: { type: String },
  endTime: { type: String },
  // Derived from the strings above, recomputed on every write. This is the
  // only thing that gets indexed for range queries — everything else
  // (resource, capacity, public/private, group) lives on Activities and is
  // looked up for the small, already date-bounded result a query returns.
  startDateTime: { type: Date },
  endDateTime: { type: Date },

  creationDate: { type: Date },
});

Occurrences.attachSchema(Occurrences.schema);

if (Meteor.isServer) {
  Meteor.startup(async () => {
    const raw = Occurrences.rawCollection();
    // Single-tenant path: every regular community page load.
    await raw.createIndex(
      { host: 1, startDateTime: 1 },
      { name: 'host_startDateTime' }
    );
    // Portal/federation path: queries that intentionally span all hosts
    // (getAllActivitiesFromAllHosts, getAllPublicActivitiesFromAllHosts,
    // getAllGroupMeetingsFuture(isPortalHost)) have no host predicate, so
    // the compound index above can't help them — they need this instead.
    await raw.createIndex({ startDateTime: 1 }, { name: 'startDateTime' });
    await raw.createIndex({ activityId: 1 }, { name: 'activityId' });
  });
}

export default Occurrences;
