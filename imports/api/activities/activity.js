import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

const Activities = new Mongo.Collection('activities');

const SchemasActivity  = {
  datesAndTimes: {
    startDate: {type: String},
    startTime: {type: String},
    endDate: {type: String},
    endTime: {type: String},
    capacity: {type: SimpleSchema.Integer},
    isRange: {type: Boolean},
    conflict: {type: String, optional: true},

    attendees: {type: Array, optional: true},
    'attendees.$': {type: Object, optional: true},
    'attendees.$.email': Schemas.Email,
    'attendees.$.firstName': {type: String},
    'attendees.$.lastName': {type: String},
    'attendees.$.numberOfPeople': {type: SimpleSchema.Integer},
    'attendees.$.registerDate': {type: Date},
  }
};

Schemas.Activity = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,

  authorId: Schemas.Id,
  authorName: {type: String},

  title: {type: String},
  subTitle: {type: String, optional: true},
  longDescription: {type: String},
  imageUrl: {type: String, regEx: SimpleSchema.RegEx.Url, optional: true},

  resourceId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true},
  resource: {type: String, optional: true},
  resourceIndex: {type: SimpleSchema.Integer, optional: true},
  // resourceHourlyFee: {type: String, optional: true}, //undefined

  address: {type: Boolean, optional: true},
  capacity: {type: SimpleSchema.Integer},
  place: {type: String, optional: true},
  room: {type: String, optional: true}, //undefined

  datesAndTimes: {type: Array},
  'datesAndTimes.$': new SimpleSchema(SchemasActivity.datesAndTimes),

  practicalInfo: {type: String, optional: true}, // null
  internalInfo: {type: String, optional: true}, // null

  isSentForReview: {type: Boolean},
  isPublicActivity: {type: Boolean, optional: true},
  // isBookingsDisabled: {type: Boolean, optional: true}, //undefined
  isActivitiesDisabled: {type: Boolean, optional: true},
  isPublished: {type: Boolean},

  latestUpdate: {type: Date, optional: true},
  creationDate: {type: Date},
});

Activities.attachSchema(Schemas.Activity);

export default Activities;