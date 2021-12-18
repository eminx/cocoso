import SimpleSchema from 'simpl-schema';
import { datesAndTimesSchema  } from './activity';

export const gatheringSchema = new SimpleSchema({
  // _id: {type: String},
  host: {type: String},
  authorId: {type: String},
  authorName: {type: String},

  title: {type: String},
  subTitle: {type: String},
  longDescription: {type: String},
  imageUrl: {type: String},

  // resourceId: {type: String},
  // resource: {type: String},
  // resourceIndex: {type: SimpleSchema.Integer},
  // resourceHourlyFee: {type: String}, //undefined

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

  // latestUpdate: {type: Date},
  creationDate: {type: Date},
});