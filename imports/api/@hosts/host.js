import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Hosts = new Mongo.Collection('hosts');

const menuSchema = new SimpleSchema({
  label: {type: String},
  name: {type: String},
  isVisible: {type: Boolean},
  isHomePage: {type: Boolean},
});

const hlsSchema = new SimpleSchema({
  h: {type: String},
  l: {type: SimpleSchema.Integer},
  s: {type: SimpleSchema.Integer},
});

const emailTemplateSchema = new SimpleSchema({ 
  title: {type: String},
  subject: {type: String},
  appeal: {type: String},
  body: {type: String},
});

const hostSchema = new SimpleSchema({
  // _id: {type: String},
  createdAt: {type: Date},
  host: {type: String},
  email: {type: String},
  
  emails: {type: Array},
  'emails.$': {type: emailTemplateSchema},
  // logo: {type: String},

  settings: {type: Object},
  'settings.name': {type: String},
  'settings.email': {type: String},
  'settings.address': {type: String},
  'settings.city': {type: String},
  'settings.country': {type: String},
  'settings.menu': {type: Array},
  'settings.menu.$': {type: menuSchema},
  'settings.mainColor': {type: Object, optional:true },

  members: {type: Array},
  'members.$': {type: Object},
  'members.$.id': {type: String},
  'members.$.username': {type: String},
  'members.$.email': {type: String},
  'members.$.role': {type: String},
  'members.$.date': {type: Date},

  // registeredBy: {type: Object},
  // 'verifiedBy.username': {type: String},
  // 'verifiedBy.userId': {type: String},
  // 'verifiedBy.date': {type: Date},

  // verifiedBy: {type: Object},
  // 'verifiedBy.username': {type: String},
  // 'verifiedBy.userId': {type: String},
  // 'verifiedBy.date': {type: Date},

  // unVerifiedBy: {type: Object},
  // 'unVerifiedBy.username': {type: String},
  // 'unVerifiedBy.userId': {type: String},
  // 'unVerifiedBy.date': {type: Date},

});

Hosts.attachSchema(hostSchema);
export default Hosts;