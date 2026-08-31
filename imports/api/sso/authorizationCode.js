import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const AuthorizationCodes = new Mongo.Collection('ssoAuthorizationCodes');

AuthorizationCodes.schema = new SimpleSchema({
  code: { type: String },
  userId: { type: String },
  host: Schemas.Hostname,
  redirectUri: { type: String },
  codeChallenge: { type: String },
  codeChallengeMethod: { type: String, defaultValue: 'S256' },
  expiresAt: { type: Date },
  used: { type: Boolean, defaultValue: false },
  createdAt: { type: Date },
});

AuthorizationCodes.attachSchema(AuthorizationCodes.schema);

if (Meteor.isServer) {
  Meteor.startup(async () => {
    const raw = AuthorizationCodes.rawCollection();
    await raw.createIndex({ code: 1 }, { unique: true, name: 'code_unique' });
    await raw.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, name: 'expiresAt_ttl' }
    );
  });
}

export default AuthorizationCodes;
