import { Accounts } from 'meteor/accounts-base';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

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
    notifications: { type: Array, optional: true },
    'notifications.$': new SimpleSchema(SchemasUser.notifications),
    attending: { type: Array, optional: true },
    'attending.$': new SimpleSchema(SchemasUser.groups) ,
    processes: { type: Array, optional: true },
    'processes.$': new SimpleSchema(SchemasUser.processes),

  }).validate(user);
  // Return true to allow user creation to proceed
  return true;
});

const SchemasUser = {
  profile: {
    firstName: {type: String},
    lastName: {type: String},
    bio: {type: String, optional: true},
    contactInfo: {type: String, optional: true},
  },
  avatar: Schemas.Avatar,
  memberships: {
    host: {type: String},
    role: {type: String},
    date: {type: Date},
  },
  notifications: {
    context: {type: String},
    contextId: {type: String},
    count: {type: SimpleSchema.Integer},
  },
  groups: {
    groupId: {type: String},
    joinDate: {type: Date},
    meAdmin: {type: Boolean},
    name: {type: String},
  },
  processes: {
    isAdmin: {type: Boolean},
    joinDate: {type: Date},
    name: {type: String},
    processId: {type: String},
  },
};


export { SchemasUser };