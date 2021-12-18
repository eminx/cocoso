import SimpleSchema from 'simpl-schema';

export const chatSchema = new SimpleSchema({
  // _id: {type: String},
  host: {type: String},

  contextId: {type: String},
  contextName: {type: String},

  createdBy: {type: Object},
  'createdBy.userId': {type: String},
  'createdBy.username': {type: String},

  messages: {type: Array},
  'messages.$': {type: Object},
  'messages.$.senderId': {type: String},
  'messages.$.senderUsername': {type: String},
  'messages.$.content': {type: String},
  'messages.$.createdDate': {type: Date},

  isNotificationOn: {type: Boolean},
  lastMessageBy: {type: Date},
});