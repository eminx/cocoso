import crypto from 'crypto';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Hosts from '../hosts/host';
import MagicLinkTokens from './magicLinkToken';
import { base64url, validateRedirect } from './oauthHelpers';

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes — long enough to check
// email, short enough to keep exposure low (vs. the 60s OAuth code TTL,
// which only needs to survive an immediate redirect).

Meteor.methods({
  async requestMagicLink({
    email,
    client_id: host,
    redirect_uri: redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: codeChallengeMethod,
  }) {
    check(email, String);
    check(host, String);
    check(redirectUri, String);
    check(state, String);
    check(codeChallenge, String);

    const redirectHost = validateRedirect(host, redirectUri);
    const hostDoc = redirectHost
      ? await Hosts.findOneAsync({ host: redirectHost })
      : null;
    if (!hostDoc) {
      throw new Meteor.Error('unknown-client');
    }

    const token = base64url(crypto.randomBytes(32));
    await MagicLinkTokens.insertAsync({
      token,
      email,
      host,
      redirectUri,
      state,
      codeChallenge,
      codeChallengeMethod: codeChallengeMethod || 'S256',
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      used: false,
      createdAt: new Date(),
    });

    const authDomain = Meteor.settings.public?.authDomain;
    const link = `https://${authDomain}/oauth/magic-link/${token}`;

    await Meteor.callAsync('sendMagicLinkEmail', email, link);
  },
});
