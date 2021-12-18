import SimpleSchema from 'simpl-schema';

export const menuSchema = new SimpleSchema({
  label: {type: String},
  name: {type: String},
  isVisible: {type: Boolean},
  isHomePage: {type: Boolean},
});

export const hlsSchema = new SimpleSchema({
  h: {type: String},
  l: {type: SimpleSchema.Integer},
  s: {type: SimpleSchema.Integer},
});

export const emailTemplateSchema = new SimpleSchema({ 
  title: {type: String},
  subject: {type: String},
  appeal: {type: String},
  body: {type: String},
});

export const hostSchema = new SimpleSchema({
  // _id: {type: String},
  createdAt: {type: Date},
  host: {type: String},
  email: {type: String},
  emails: {type: Array},
  'emails.$': {type: emailTemplateSchema},
  logo: {type: String},

  settings: {type: Object},
  'settings.name': {type: String},
  'settings.email': {type: String},
  'settings.address': {type: String},
  'settings.city': {type: String},
  'settings.country': {type: String},
  'settings.menu': {type: menuSchema},
  'settings.mainColor': {type: Object},
  'settings.mainColor.hls': {type: hlsSchema},

  members: {type: Array},
  'members.$': {type: Object},
  'members.$.id': {type: String},
  'members.$.username': {type: String},
  'members.$.email': {type: String},
  'members.$.role': {type: String},
  'members.$.date': {type: Date},

  registeredBy: {type: Object},
  'verifiedBy.username': {type: String},
  'verifiedBy.userId': {type: String},
  'verifiedBy.date': {type: Date},

  verifiedBy: {type: Object},
  'verifiedBy.username': {type: String},
  'verifiedBy.userId': {type: String},
  'verifiedBy.date': {type: Date},

  unVerifiedBy: {type: Object},
  'unVerifiedBy.username': {type: String},
  'unVerifiedBy.userId': {type: String},
  'unVerifiedBy.date': {type: Date},

});