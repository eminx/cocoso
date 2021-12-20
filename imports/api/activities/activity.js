import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Activities = new Mongo.Collection('activities');

const datesAndTimesSchema = new SimpleSchema({
  attendees: {type: Array, optional: true},
  'attendees.$': {type: new SimpleSchema({
    email: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    numberOfPeople: {type: String},
    registerDate: {type: Date},
  }), optional: true},
  startDate: {type: String},
  startTime: {type: String},
  endDate: {type: String},
  endTime: {type: String},
  capacity: {type: SimpleSchema.Integer},
  isRange: {type: Boolean},
  conflict: {type: String, optional: true},
});

const activitySchema = new SimpleSchema({
  // _id: {type: String},
  host: {type: String},
  authorId: {type: String},
  authorName: {type: String},

  title: {type: String},
  subTitle: {type: String, optional: true},
  longDescription: {type: String},
  imageUrl: {type: String, optional: true},

  resourceId: {type: String, optional: true},
  resource: {type: String, optional: true},
  resourceIndex: {type: SimpleSchema.Integer, optional: true},
  // resourceHourlyFee: {type: String, optional: true}, //undefined

  address: {type: Boolean, optional: true},
  capacity: {type: SimpleSchema.Integer},
  place: {type: String, optional: true},
  room: {type: String, optional: true}, //undefined

  datesAndTimes: {type: Array},
  'datesAndTimes.$': {type: datesAndTimesSchema},

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

Activities.attachSchema(activitySchema);

export default Activities;