import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

const Processes = new Mongo.Collection('processes');

const SchemasProcesses = {
  members: {
    memberId: { type: String },
    username: { type: String },
    profileImage: { type: String, optional: true },
    isRegisteredMember: { type: Boolean, optional: true },
    joinDate: { type: Date },
  },
  documents: {
    name: { type: String },
    downloadUrl: { type: String },
  },
  meetings: {
    attendees: { type: String },
    startDate: { type: String },
    startTime: { type: String },
    endDate: { type: String },
    endTime: { type: String },
    room: { type: String }, 
  },
  peopleInvited: {
    email: { type: String },
    firstName: { type: String },
  },
};

Schemas.Processes = new SimpleSchema({
  _id: { type: String },
  host: { type: String },

  adminId: { type: String },
  adminUsername: { type: String },
  
  title: { type: String },
  description: { type: String },
  readingMaterial: { type: String },
  imageUrl: { type: String },
  capacity: { type: SimpleSchema.Integer },

  members: { type: Array },
  'members.$': new SimpleSchema(SchemasProcesses.members),
  documents: { type: Array, optional: true },
  'documents.$': new SimpleSchema(SchemasProcesses.documents),
  meetings: { type: Array, optional: true },
  'meetings.$': new SimpleSchema(SchemasProcesses.meetings),
  peopleInvited: { type: Array, optional: true },
  'peopleInvited.$': new SimpleSchema(SchemasProcesses.peopleInvited),

  isPublished: { type: Boolean },
  isPrivate: { type: Boolean },

  creationDate: { type: Date },
});

Processes.attachSchema(Schemas.Processes);

export default Processes;