import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Platform = new Mongo.Collection('platform');

Platform.schema = new SimpleSchema({
  _id: Schemas.Id,
  createdAt: { type: Date },
  email: Schemas.Email,
  footer: { type: String, optional: true },
  isFederationLayout: { type: Boolean, optional: true },
  lastUpdatedAt: { type: Date, optional: true },
  logo: { type: String, optional: true },
  name: { type: String },
  portalHost: { type: String },
  showFooterInAllCommunities: { type: Boolean, optional: true },
  showCommunitiesInMenu: { type: Boolean, optional: true },
  topbar: { type: Object, optional: true },
  'topbar.closed': { type: String, optional: true },
  'topbar.open': { type: String, optional: true },
});

Platform.attachSchema(Platform.schema);

export default Platform;
