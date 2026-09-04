import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const MagicLinkTokens = new Mongo.Collection('ssoMagicLinkTokens');

// No userId field, deliberately — the account may not exist yet at request
// time. Creating one before the email is confirmed clicked would mean
// permanently creating accounts for typos or other people's addresses.
// User lookup/creation happens at consume time (imports/startup/server/
// oauth.js), once the token is proven valid.
MagicLinkTokens.schema = new SimpleSchema({
  token: { type: String },
  email: { type: String, regEx: SimpleSchema.RegEx.Email },
  host: Schemas.Hostname,
  redirectUri: { type: String },
  state: { type: String },
  codeChallenge: { type: String },
  codeChallengeMethod: { type: String, defaultValue: 'S256' },
  expiresAt: { type: Date },
  used: { type: Boolean, defaultValue: false },
  createdAt: { type: Date },
});

MagicLinkTokens.attachSchema(MagicLinkTokens.schema);

if (Meteor.isServer) {
  Meteor.startup(async () => {
    const raw = MagicLinkTokens.rawCollection();
    await raw.createIndex({ token: 1 }, { unique: true, name: 'token_unique' });
    await raw.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, name: 'expiresAt_ttl' }
    );
  });
}

export default MagicLinkTokens;
