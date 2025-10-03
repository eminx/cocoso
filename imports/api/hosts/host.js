import { Mongo } from 'meteor/mongo';
import 'meteor/aldeed:collection2/static';
import SimpleSchema from 'simpl-schema';

import { Schemas } from '../_utils/schemas';

const Hosts = new Mongo.Collection('hosts');

const SchemasHost = {
  menu: {
    description: { type: String, optional: true },
    isHomePage: { type: Boolean, optional: true },
    isVisible: { type: Boolean },
    isComposablePage: {
      type: Boolean,
      defaultValue: false,
      optional: true,
    },
    label: { type: String },
    name: { type: String },
  },
  emailTemplate: {
    title: { type: String, optional: true },
    key: { type: String, optional: true },
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
  'settings.backgroundColor': { type: String, optional: true },
  'settings.backgroundImage': { type: String, optional: true },
  'settings.footer': { type: String, optional: true },
  'settings.isBurgerMenuOnDesktop': {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
  'settings.isBurgerMenuOnMobile': {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },

  theme: { type: Object, optional: true },
  'theme.hue': { type: String, optional: true },
  'theme.body': { type: Object, optional: true },
  'theme.body.backgroundColor': { type: String, optional: true },
  'theme.body.backgroundImage': { type: String, optional: true },
  'theme.body.backgroundRepeat': { type: String, optional: true },
  'theme.body.borderRadius': { type: String, optional: true },
  'theme.body.fontFamily': { type: String, optional: true },
  'theme.menu': { type: Object, optional: true },
  'theme.menu.backgroundColor': { type: String, optional: true },
  'theme.menu.borderColor': { type: String, optional: true },
  'theme.menu.borderRadius': { type: String, optional: true },
  'theme.menu.borderStyle': { type: String, optional: true },
  'theme.menu.borderWidth': { type: String, optional: true },
  'theme.menu.color': { type: String, optional: true },
  'theme.menu.fontStyle': { type: String, optional: true },
  'theme.menu.textTransform': { type: String, optional: true },
  'theme.variant': { type: String, optional: true },

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

  isPortalHost: { type: Boolean, optional: true },

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
