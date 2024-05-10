import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Groups = new Mongo.Collection('groups');

Groups.schema = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,

  authorId: Schemas.Id,
  authorUsername: { type: String },
  authorAvatar: { type: String, optional: true },
  title: { type: String },
  description: { type: String },
  readingMaterial: { type: String },
  imageUrl: { type: String },
  capacity: { type: SimpleSchema.Integer, defaultValue: 20 },

  members: { type: Array },
  'members.$': new SimpleSchema({
    memberId: Schemas.Id,
    username: { type: String },
    avatar: {
      type: String,
      // regEx: SimpleSchema.RegEx.Url,
      optional: true,
    },
    isAdmin: { type: Boolean, optional: true },
    joinDate: { type: Date },
  }),

  documents: { type: Array, defaultValue: [] },
  'documents.$': {
    type: new SimpleSchema({
      name: { type: String },
      downloadUrl: { type: String },
    }),
    optional: true,
  },

  peopleInvited: { type: Array, defaultValue: [] },
  'peopleInvited.$': {
    type: new SimpleSchema({
      email: { type: String, regEx: SimpleSchema.RegEx.Email },
      firstName: { type: String },
    }),
    optional: true,
  },

  isPublished: { type: Boolean },
  isPrivate: { type: Boolean },
  isArchived: { type: Boolean, optional: true },
  creationDate: { type: Date },
});

Groups.attachSchema(Groups.schema);

export default Groups;
