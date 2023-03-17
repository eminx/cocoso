import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Platform = new Mongo.Collection('platform');

Platform.schema = new SimpleSchema({
  _id: Schemas.Id,
  name: { type: String },
  portalHost: { type: String },
  logo: { type: String, optional: true },
  email: Schemas.Email,
  createdAt: { type: Date },
  lastUpdatedAt: { type: Date, optional: true },
});

Platform.attachSchema(Platform.schema);

export default Platform;
