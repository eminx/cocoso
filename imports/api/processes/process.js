import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

const Processes = new Mongo.Collection('processes');

const SchemasProcesses = {
  members: {
    memberId: Schemas.Id,
    username: { type: String },
    profileImage: { type: String, regEx: SimpleSchema.RegEx.Url, optional: true },
    isRegisteredMember: { type: Boolean, optional: true },
    joinDate: { type: Date },
  },
  documents: {
    name: { type: String },
    downloadUrl: { type: String, regEx: SimpleSchema.RegEx.Url},
  },
  meetings: {
    attendees: { type: Array },
    'attendees.$': { type: Object, optional: true },
    'attendees.$.memberId': Schemas.Id,
    'attendees.$.memberUsername': { type: String },
    'attendees.$.confirmDate': { type: Date },
    startDate: { type: String },
    startTime: { type: String },
    endDate: { type: String },
    endTime: { type: String },
    room: { type: String, optional: true }, 
    resource: { type: String, optional: true }, 
    resourceIndex: { type: String, optional: true }, 
  },
  peopleInvited: {
    email: { type: String, regEx: SimpleSchema.RegEx.Email },
    firstName: { type: String },
  },
};

Schemas.Processes = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,

  adminId: Schemas.Id,
  adminUsername: { type: String },
  
  title: { type: String },
  description: { type: String },
  readingMaterial: { type: String },
  imageUrl: Schemas.Src,
  capacity: { type: SimpleSchema.Integer },

  members: { type: Array },
  'members.$': new SimpleSchema(SchemasProcesses.members),
  documents: { type: Array, optional: true },
  'documents.$': new SimpleSchema(SchemasProcesses.documents),
  meetings: { type: Array, defaultValue: [] },
  'meetings.$': { type: new SimpleSchema(SchemasProcesses.meetings), optional: true },
  peopleInvited: { type: Array, defaultValue: [] },
  'peopleInvited.$': { type: new SimpleSchema(SchemasProcesses.peopleInvited), optional: true },

  isPublished: { type: Boolean },
  isPrivate: { type: Boolean },

  creationDate: { type: Date },
});

Processes.attachSchema(Schemas.Processes);

export default Processes;