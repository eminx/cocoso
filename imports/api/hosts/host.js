import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Hosts = new Mongo.Collection('hosts');

const SchemasHost = {
  menu: {
    label: { type: String },
    name: { type: String },
    isVisible: { type: Boolean },
    isHomePage: { type: Boolean, optional: true },
  },
  emailTemplate: {
    title: { type: String },
    subject: { type: String },
    appeal: { type: String },
    body: { type: String },
  },
};

Hosts.schema = new SimpleSchema({
  _id: Schemas.Id,
  host: Schemas.Hostname,

  logo: { type: String, optional: true },

  settings: { type: Object },
  'settings.name': { type: String },
  'settings.email': Schemas.Email,
  'settings.address': { type: String },
  'settings.city': { type: String },
  'settings.country': { type: String },
  'settings.lang': { type: String, optional: true },
  'settings.menu': { type: Array },
  'settings.menu.$': new SimpleSchema(SchemasHost.menu),
  'settings.mainColor': { type: Object, optional: true },

  members: { type: Array },
  'members.$': { type: Object, optional: true },
  'members.$.avatar': { type: String, optional: true },
  'members.$.date': { type: Date },
  'members.$.email': Schemas.Email,
  'members.$.id': Schemas.Id,
  'members.$.role': { type: String },
  'members.$.username': { type: String },
  'members.$.isPublic': { type: Boolean, optional: true },

  emails: { type: Array },
  'emails.$': new SimpleSchema(SchemasHost.emailTemplate),

  createdAt: { type: Date },

  registeredBy: { type: Object, optional: true },
  'registeredBy.username': { type: String },
  'registeredBy.userId': { type: String },
  'registeredBy.date': { type: Date },

  verifiedBy: { type: Object, optional: true },
  'verifiedBy.username': { type: String },
  'verifiedBy.userId': { type: String },
  'verifiedBy.date': { type: Date },

  unVerifiedBy: { type: Object, optional: true },
  'unVerifiedBy.username': { type: String },
  'unVerifiedBy.userId': { type: String },
  'unVerifiedBy.date': { type: Date },
});

Hosts.attachSchema(Hosts.schema);

export default Hosts;
