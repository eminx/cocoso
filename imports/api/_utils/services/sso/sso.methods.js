import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { getHost } from '../../shared';

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
});
