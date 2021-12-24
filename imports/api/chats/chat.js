import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

const Chats = new Mongo.Collection('chats');

Schemas.Chats = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,

  contextId: Schemas.Id,
  contextName: {type: String},

  createdBy: {type: Object},
  'createdBy.userId': Schemas.Id,
  'createdBy.username': {type: String},

  messages: {type: Array, optional: true},
  'messages.$': {type: Object},
  'messages.$.senderId': Schemas.Id,
  'messages.$.senderUsername': {type: String},
  'messages.$.content': {type: String},
  'messages.$.createdDate': {type: Date},

  isNotificationOn: {type: Boolean},
  lastMessageBy: {type: String, regEx: SimpleSchema.RegEx.Id, optional:true},
});

Chats.attachSchema(Schemas.Chats);

export default Chats;