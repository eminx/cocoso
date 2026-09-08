import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { getHost } from '../../shared';
import Hosts from '../../../hosts/host';
import { validateRedirect, mintAuthorizationCode } from '../../../sso/oauthHelpers';

Meteor.methods({
  async exchangeSsoCode({ code, codeVerifier }) {
    check(code, String);
    check(codeVerifier, String);

    const authDomain = Meteor.settings.public?.authDomain;
    if (!authDomain) {
      throw new Meteor.Error('sso-disabled');
    }

    // getHost(this) is the tenant's own domain, from the trusted DDP
    // connection — never client-supplied — matching what the broker
    // validated the authorization code against when it was minted.
    const host = getHost(this);
    const redirectUri = `https://${host}/sso-callback`;

    const response = await fetch(`https://${authDomain}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        code_verifier: codeVerifier,
        redirect_uri: redirectUri,
        client_id: host,
      }),
    });

    if (!response.ok) {
      throw new Meteor.Error('sso-exchange-failed', await response.text());
    }

    return await response.json(); // { token, tokenExpires }
  },

  // Called from the broker's own client, on the same DDP connection that
  // accounts-password's built-in `resetPassword` method just authenticated.
  // Mints the same kind of one-time code the native login/register form
  // posts produce (see mintCodeAndRedirect in oauth.js), so a completed
  // password reset can redirect straight back to the tenant instead of
  // dead-ending on the broker with just a "password changed" message.
  async mintOAuthCodeForCurrentUser({
    host,
    redirectUri,
    codeChallenge,
    codeChallengeMethod,
  }) {
    check(host, String);
    check(redirectUri, String);
    check(codeChallenge, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const redirectHost = validateRedirect(host, redirectUri);
    const hostDoc = redirectHost
      ? await Hosts.findOneAsync({ host: redirectHost })
      : null;
    if (!hostDoc) {
      throw new Meteor.Error('unknown-client');
    }

    const code = await mintAuthorizationCode({
      userId: this.userId,
      host,
      redirectUri,
      codeChallenge,
      codeChallengeMethod,
    });

    return { code };
  },
});
