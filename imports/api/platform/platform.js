import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Platform = new Mongo.Collection('platform');

Platform.schema = new SimpleSchema({
  _id: Schemas.Id,
  name: { type: String },
  email: Schemas.Email,
  footer: { type: String, optional: true },
  portalHost: { type: String },
  logo: { type: String, optional: true },
  showFooterInAllCommunities: { type: Boolean, optional: true },
  showCommunitiesInMenu: { type: Boolean, optional: true },
  isFederationLayout: { type: Boolean, optional: true },
  createdAt: { type: Date },
  topbar: { type: Object, optional: true },
  'topbar.closed': { type: String, optional: true },
  'topbar.open': { type: String, optional: true },
  lastUpdatedAt: { type: Date, optional: true },
});

Platform.attachSchema(Platform.schema);

export default Platform;
