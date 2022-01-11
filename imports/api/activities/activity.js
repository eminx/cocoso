import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

const Activities = new Mongo.Collection('activities');

Activities.schema = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,

  authorId: Schemas.Id,
  authorName: {type: String},

  title: {type: String},
  subTitle: {
    type: String, 
    optional: true, 
    custom: function () {
      if(this.field('isPublicActivity').value) 
        if (this.value === null || this.value === "") 
          return SimpleSchema.ErrorTypes.REQUIRED
    }
  },
  longDescription: {type: String},
  imageUrl: {type: String, regEx: SimpleSchema.RegEx.Url, optional: true},

  resourceId: {type: String, regEx: SimpleSchema.RegEx.Id},
  resource: {type: String, defaultValue: ''},
  resourceIndex: {type: SimpleSchema.Integer},
  // resourceHourlyFee: {type: String, optional: true}, //undefined

  address: {type: String, defaultValue: ''},
  capacity: {type: SimpleSchema.Integer, defaultValue: 20},
  place: {type: String, defaultValue: ''},
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
      numberOfPeople: {type: SimpleSchema.Integer},
      registerDate: {type: Date},
    }), optional: true},
    
  }),

  practicalInfo: {type: String, defaultValue: ''}, // null
  internalInfo: {type: String, defaultValue: ''}, // null

  isSentForReview: {type: Boolean},
  isPublicActivity: {type: Boolean, optional: true},
  isRegistrationDisabled: {type: Boolean, optional: true}, //undefined
  isPublished: {type: Boolean},

  latestUpdate: {type: Date, optional: true},
  creationDate: {type: Date},
});

Activities.attachSchema(Activities.schema);

export default Activities;
