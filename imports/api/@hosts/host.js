import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../@/schemas';

const Hosts = new Mongo.Collection('hosts');

const SchemasHost = {
  menu: {
    label: {type: String},
    name: {type: String},
    isVisible: {type: Boolean},
    isHomePage: {type: Boolean},
  },
  emailTemplate: { 
    title: {type: String},
    subject: {type: String},
    appeal: {type: String},
    body: {type: String},
  }
};

Schemas.Host = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Host,

  email: Schemas.Email,
  logo: {type: Schemas.Src, optional: true},

  settings: {type: Object},
  'settings.name': {type: String},
  'settings.email': Schemas.Email,
  'settings.address': {type: String},
  'settings.city': {type: String},
  'settings.country': {type: String},
  'settings.menu': {type: Array},
  'settings.menu.$': new SimpleSchema(SchemasHost.menu),
  'settings.mainColor': {type: Object, optional:true },

  members: {type: Array},
  'members.$': {type: Object},
  'members.$.id': Schemas.Id,
  'members.$.username': {type: String},
  'members.$.email': Schemas.Email,
  'members.$.role': {type: String},
  'members.$.date': {type: Date},

  emails: {type: Array},
  'emails.$': new SimpleSchema(SchemasHost.emailTemplate),

  createdAt: {type: Date},

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

Hosts.attachSchema(Schemas.Host);

export default Hosts;