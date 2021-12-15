import SimpleSchema from 'simpl-schema';

export const groupSchema = new SimpleSchema({
  // _id: {type: String},
  host: {type: String},

  adminId: {type: String},
  adminUsername: {type: String},
  
  title: {type: String},
  description: {type: String},
  readingMaterial: {type: String},
  imageUrl: {type: String},
  capacity: {type: SimpleSchema.Integer},

  documents: {type: Array},
  'documents.$': {type: Object},
  'documents.$.name': {type: String},
  'documents.$.downloadUrl': {type: String},

  meetings: {type: Array},
  'meetings.$': {type: Object},
  'meetings.$.attendees': {type: String},
  'meetings.$.startDate': {type: String},
  'meetings.$.startTime': {type: String},
  'meetings.$.endDate': {type: String},
  'meetings.$.endTime': {type: String},
  'meetings.$.room': {type: String},

  members: {type: Array},
  'members.$': {type: Object},
  'members.$.memberId': {type: String},
  'members.$.username': {type: String},
  'members.$.profileImage': {type: String},
  'members.$.isRegisteredMember': {type: Boolean},
  'members.$.joinDate': {type: Date},

  peopleInvited: {type: Array},
  'peopleInvited.$': {type: Object},
  'peopleInvited.$.email': {type: String},
  'peopleInvited.$.firstName': {type: String},

  isPublished: {type: Boolean},
  isPrivate: {type: Boolean},

  creationDate: {type: Date},
});