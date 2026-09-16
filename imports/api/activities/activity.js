import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Activities = new Mongo.Collection('activities');

Activities.schema = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,

  authorId: Schemas.Id,
  authorName: { type: String },

  title: { type: String },
  subTitle: {
    type: String,
    optional: true,
  },
  longDescription: { type: String, optional: true },
  images: { type: Array, optional: true },
  'images.$': { type: String },
  imagesLegacy: { type: Array, optional: true },
  'imagesLegacy.$': { type: String, optional: true },
  resource: { type: String, optional: true },
  resourceId: { type: String, regEx: SimpleSchema.RegEx.Id, optional: true },

  address: { type: String, optional: true },
  capacity: { type: SimpleSchema.Integer, defaultValue: 40 },
  place: { type: String, optional: true },

  // Occurrence dates/times and their attendees live in the Occurrences and
  // Registrations collections (imports/api/occurrences, imports/api/registrations),
  // keyed by activityId — not embedded here. A frozen copy of the old
  // embedded shape is kept as _datesAndTimesLegacy on migrated documents
  // (imports/startup/server/index.js) — deliberately NOT declared here, so
  // it stays outside schema validation entirely rather than looking like a
  // lightly-checked live field.

  // practicalInfo: { type: String, optional: true }, // null
  // internalInfo: { type: String, optional: true }, // null

  isExclusiveActivity: { type: Boolean, optional: true },
  isSentForReview: { type: Boolean },
  isPublicActivity: { type: Boolean, optional: true },
  isRegistrationDisabled: { type: Boolean, optional: true },
  isRegistrationEnabled: { type: Boolean, optional: true, defaultValue: true },
  isPublished: { type: Boolean },

  groupId: { type: String, regEx: SimpleSchema.RegEx.Id, optional: true },
  isGroupMeeting: { type: Boolean, optional: true },
  isGroupPrivate: { type: Boolean, optional: true },

  latestUpdate: { type: Date, optional: true },
  creationDate: { type: Date },
});

Activities.attachSchema(Activities.schema);

if (Meteor.isServer) {
  Meteor.startup(async () => {
    const raw = Activities.rawCollection();
    // Now that datesAndTimes/attendees are gone, Activities is small enough
    // per host that these cover getAllActivities/getMyActivities/
    // getActivitiesByUser and the first hop of checkDatesForConflict and the
    // group-meeting lookups.
    await raw.createIndex({ host: 1 }, { name: 'host' });
    await raw.createIndex(
      { host: 1, resourceId: 1 },
      { name: 'host_resourceId' }
    );
    await raw.createIndex(
      { host: 1, authorId: 1 },
      { name: 'host_authorId' }
    );
    await raw.createIndex(
      { host: 1, isGroupMeeting: 1, groupId: 1 },
      { name: 'host_isGroupMeeting_groupId' }
    );
  });
}

export default Activities;
