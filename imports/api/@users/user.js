import { Accounts } from 'meteor/accounts-base';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

const SchemasUser = {
  profile: {
    firstName: {type: String},
    lastName: {type: String},
    bio: {type: String, optional: true},
    contactInfo: {type: String, optional: true},
  },
  avatar: new SimpleSchema(Schemas.Avatar),
  memberships: {
    host: Schemas.Hostname,
    role: {type: String},
    date: {type: Date},
  },
  notifications: {
    contextId: Schemas.Id,
    context: {type: String},
    count: {type: SimpleSchema.Integer},
  },
  groups: {
    groupId: Schemas.Id,
    name: {type: String},
    meAdmin: {type: Boolean},
    joinDate: {type: Date},
  },
  processes: {
    processId: Schemas.Id,
    name: {type: String},
    isAdmin: {type: Boolean},
    joinDate: {type: Date},
  },
};

// Ensuring every user has an email address, should be in server-side code
Accounts.validateNewUser((user) => {
  new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    emails: { type: Array },
    'emails.$': { type: Object },
    'emails.$.address': { type: String, regEx: SimpleSchema.RegEx.Email },
    'emails.$.verified': { type: Boolean },
    username: { type: String, min: 3, max: 21 },
    createdAt: { type: Date },
    services: { type: Object, blackbox: true },

    memberships: { type: Array, optional: true },
    'memberships.$': new SimpleSchema(SchemasUser.memberships),
    notifications: { type: Array, defaultValue: [] },
    'notifications.$': { type: new SimpleSchema(SchemasUser.notifications), optional: true },
    attending: { type: Array, optional: true },
    'attending.$': new SimpleSchema(SchemasUser.groups) ,
    processes: { type: Array, optional: true },
    'processes.$': new SimpleSchema(SchemasUser.processes),
  }).validate(user);
  // Return true to allow user creation to proceed
  return true;
});

export { SchemasUser };