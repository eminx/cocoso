import SimpleSchema from 'simpl-schema';

export const userRoles = [
  'super',
  'admin',
  'participant',
  'contributor',
  'guest'
];

export const avatarSchema = new SimpleSchema({
  src: {type: String},
  date: {type: Date},
});

export const userSchema = new SimpleSchema({
  // _id: {type: String},
  createdAt: {type: Date},
  emails: {type: Array},
  'emails.$': {type: Object},
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  'emails.$.verified': {type: Boolean},
  username: {type: String},

  firstName: {type: String},
  lastName: {type: String},
  avatar: {type: avatarSchema},
  bio: {type: String},
  contactInfo: {type: String},

  isRegisteredMember: {type: Boolean},
  isSuperAdmin: {type: Boolean},
  
  memberships: {type: Array},
  'memberships.$': {type: Object},
  'memberships.$.host': {type: String},
  'memberships.$.role': {type: String},
  'memberships.$.date': {type: Date},

  verifiedBy: {type: Object},
  'verifiedBy.username': {type: String},
  'verifiedBy.userId': {type: String},
  'verifiedBy.date': {type: Date},

  unVerifiedBy: {type: Object},
  'unVerifiedBy.username': {type: String},
  'unVerifiedBy.userId': {type: String},
  'unVerifiedBy.date': {type: Date},

  groups: {type: Array},
  'groups.$': {type: Object},
  'groups.$.groupId': {type: String},
  'groups.$.joinDate': {type: Date},
  'groups.$.meAdmin': {type: Boolean},
  'groups.$.name': {type: String},

  notifications: {type: Array},
  'notifications.$': {type: Object},
  'notifications.$.context': {type: String},
  'notifications.$.contextId': {type: String},
  'notifications.$.count': {type: SimpleSchema.Integer},

  processes: {type: Array},
  'processes.$': {type: Object},
  'processes.$.isAdmin': {type: Boolean},
  'processes.$.joinDate': {type: Date},
  'processes.$.name': {type: String},
  'processes.$.processId': {type: String},

  services: {type: Array},
  'services.$': {type: Object},
  'services.$.isAdmin': {type: Boolean},
  'services.$.joinDate': {type: Date},
  'services.$.name': {type: String},
  'services.$.processId': {type: String},

});