import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const DirectMessages = new Mongo.Collection('directmessages');

DirectMessages.schema = new SimpleSchema({
  _id: Schemas.Id,
  // Sorted array of exactly two userIds — used as a unique conversation key
  participantIds: { type: Array },
  'participantIds.$': Schemas.Id,
  participantUsernames: { type: Array },
  'participantUsernames.$': { type: String },
  participantAvatars: { type: Array, optional: true },
  'participantAvatars.$': { type: String, optional: true },
  createdAt: { type: Date },
  // Ciphertext readable only by the recipient of the last message
  lastMessageRecipientCiphertext: { type: String, optional: true },
  // Ciphertext readable only by the sender of the last message (for their preview)
  lastMessageSenderCiphertext: { type: String, optional: true },
  lastMessageAt: { type: Date, optional: true },
  lastMessageBy: { type: String, regEx: SimpleSchema.RegEx.Id, optional: true },

  messages: { type: Array, defaultValue: [] },
  'messages.$': { type: Object },
  'messages.$.senderId': Schemas.Id,
  // Two ciphertexts per message so both parties can decrypt their own copy
  'messages.$.recipientCiphertext': { type: String },
  'messages.$.senderCiphertext': { type: String },
  'messages.$.createdAt': { type: Date },
});

DirectMessages.attachSchema(DirectMessages.schema);

export default DirectMessages;
