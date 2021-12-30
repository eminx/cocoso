import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

const Activities = new Mongo.Collection('activities');

Schemas.Activity = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,

  authorId: Schemas.Id,
  authorName: {type: String},

  title: {type: String},
  subTitle: {type: String, optional: true},
  longDescription: {type: String, optional: true},
  imageUrl: {type: String, regEx: SimpleSchema.RegEx.Url, optional: true},

  resourceId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true},
  resource: {type: String, optional: true},
  resourceIndex: {type: SimpleSchema.Integer, optional: true},
  // resourceHourlyFee: {type: String, optional: true}, //undefined

  address: {type: String, optional: true},
  capacity: {type: SimpleSchema.Integer},
  place: {type: String, optional: true},
  room: {type: String, optional: true}, //undefined

  datesAndTimes: {type: Array},
  'datesAndTimes.$': new SimpleSchema({

    startDate: {type: String},
    startTime: {type: String},
    endDate: {type: String},
    endTime: {type: String},
    capacity: {type: SimpleSchema.Integer},
    isRange: {type: Boolean, optional: true},
    conflict: {type: String, optional: true},

    attendees: {type: Array, optional: true},
    'attendees.$': {type: new SimpleSchema({
      email: Schemas.Email,
      firstName: {type: String},
      lastName: {type: String},
      numberOfPeople: {type: Number},
      registerDate: {type: Date},
    }), optional: true},
    
  }),

  practicalInfo: {type: String, optional: true}, // null
  internalInfo: {type: String, optional: true}, // null

  isSentForReview: {type: Boolean},
  isPublicActivity: {type: Boolean, optional: true},
  isRegistrationDisabled: {type: Boolean, optional: true}, //undefined
  isPublished: {type: Boolean},

  latestUpdate: {type: Date, optional: true},
  creationDate: {type: Date},
});

Activities.attachSchema(Schemas.Activity);

export default Activities;
