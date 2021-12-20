import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

const Chats = new Mongo.Collection('chats');

Schemas.Chats = new SimpleSchema({
  _id: {type: String},
  host: {type: String},

  contextId: {type: String},
  contextName: {type: String},

  createdBy: {type: Object},
  'createdBy.userId': {type: String},
  'createdBy.username': {type: String},

  messages: {type: Array, optional: true},
  'messages.$': {type: Object},
  'messages.$.senderId': {type: String},
  'messages.$.senderUsername': {type: String},
  'messages.$.content': {type: String},
  'messages.$.createdDate': {type: Date},

  isNotificationOn: {type: Boolean},
  lastMessageBy: {type: Date, optional:true},
});

Chats.attachSchema(Schemas.Chats);

export default Chats;