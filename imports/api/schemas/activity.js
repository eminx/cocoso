import SimpleSchema from 'simpl-schema';

export const datesAndTimesSchema = new SimpleSchema({
  attendees: {type: Array},
  'attendees.$': {type: new SimpleSchema({
    email: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    numberOfPeople: {type: String},
    registerDate: {type: Date},
  })},
  // conflict: null/undefined
  capacity: {type: SimpleSchema.Integer},
  startDate: {type: String},
  startTime: {type: String},
  endDate: {type: String},
  endTime: {type: String},
  isRange: {type: Boolean},
});

export const activitySchema = new SimpleSchema({
  // _id: {type: String},
  host: {type: String},
  authorId: {type: String},
  authorName: {type: String},

  title: {type: String},
  subTitle: {type: String},
  longDescription: {type: String},
  imageUrl: {type: String},

  resourceId: {type: String},
  resource: {type: String},
  resourceIndex: {type: SimpleSchema.Integer},
  resourceHourlyFee: {type: String}, //undefined

  address: {type: Boolean},
  capacity: {type: SimpleSchema.Integer},
  place: {type: String},
  room: {type: String}, //undefined

  datesAndTimes: {type: Array},
  'datesAndTimes.$': {type: datesAndTimesSchema},

  practicalInfo: {type: String}, // null
  internalInfo: {type: String}, // null

  isSentForReview: {type: Boolean},
  isPublicActivity: {type: Boolean},
  isBookingsDisabled: {type: Boolean}, //undefined
  isPublished: {type: Boolean},

  latestUpdate: {type: Date},
  creationDate: {type: Date},
});