import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { check } from 'meteor/check';

import { getHost } from '../../shared';
import Hosts from '../../../hosts/host';
import Platform from '../../../platform/platform';
import {
  isValidEmail,
  getEmailBody,
  extractEmailAddress,
  EmailTemplate,
} from './mail.helpers';
import { getWelcomeEmailBody, getMagicLinkEmailBody } from './templates.mails';
import type { MeteorUser } from '/imports/ui/types';

interface MailCredentials {
  smtp: {
    fromEmail: string;
  };
}

interface MeteorSettings {
  mailCredentials: MailCredentials;
}

interface HostEmail {
  subject: string;
  appeal: string;
  body: string;
}

interface HostDocument {
  _id: string;
  host: string;
  settings?: {
    name?: string;
  };
  emails?: HostEmail[];
  logo?: string;
}

Meteor.methods({
  // fromName is an override for callers with no tenant host to derive one
  // from (currently just sendMagicLinkEmail, sent from the platform-level
  // broker). Everyone else leaves it out and gets the original behavior:
  // host resolved here from the live connection, on every send.
  async sendEmail(
    id: string,
    subjectEmail: string,
    textEmail: string,
    fromName?: string
  ): Promise<void> {
    check([id, subjectEmail, textEmail], [String]);
    const fromEmail = (Meteor.settings as MeteorSettings).mailCredentials.smtp.fromEmail;

    const isEmailValid = isValidEmail(id);

    let toEmail: string | undefined;
    if (isEmailValid) {
      toEmail = id;
    }
    if (!isEmailValid) {
      const user = await Meteor.users.findOneAsync({
        $or: [{ _id: id }, { username: id }],
      }) as MeteorUser | undefined;
      toEmail = user?.emails?.[0]?.address;
    }

    if (!toEmail) {
      return;
    }

    let displayName = fromName;
    if (!displayName) {
      const host = getHost(this);
      const currentHost = await Hosts.findOneAsync({ host }) as HostDocument | undefined;
      displayName = currentHost?.settings?.name;
    }

    let fromEmailWithHostName = fromEmail;
    if (displayName) {
      const extractedEmail = extractEmailAddress(fromEmail);
      fromEmailWithHostName = `${displayName} <${extractedEmail}>`;
    }

    const data = {
      from: fromEmailWithHostName,
      to: toEmail,
      subject: subjectEmail,
      html: textEmail,
    };

    try {
      await Email.sendAsync(data);
    } catch (error) {
      console.log('email error', error);
      throw new Meteor.Error(error as string);
    }
  },

  async sendWelcomeEmail(userId: string, hostToJoin?: string): Promise<void> {
    const user = await Meteor.users.findOneAsync(userId) as MeteorUser | undefined;
    const host = hostToJoin || getHost(this);
    const currentHost = await Hosts.findOneAsync({ host }) as HostDocument | undefined;
    const welcomeText = currentHost && currentHost.emails?.[0];

    const emailBody = getWelcomeEmailBody(
      welcomeText?.appeal,
      currentHost as any,
      user?.username,
      welcomeText?.body
    );

    try {
      await Meteor.callAsync(
        'sendEmail',
        user?.emails?.[0].address,
        welcomeText?.subject,
        emailBody
      );
    } catch (error) {
      console.log('email error', error);
      throw new Meteor.Error(error as string);
    }
  },

  async sendNewContributorEmail(userId: string): Promise<void> {
    const user = await Meteor.users.findOneAsync(userId) as MeteorUser | undefined;
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host }) as HostDocument | undefined;
    const welcomeText = currentHost && currentHost.emails?.[1];

    const emailBody = getWelcomeEmailBody(
      welcomeText?.appeal,
      currentHost as any,
      user?.username,
      welcomeText?.body
    );

    try {
      await Meteor.callAsync(
        'sendEmail',
        user?.emails?.[0].address,
        welcomeText?.subject,
        emailBody
      );
    } catch (error) {
      throw new Meteor.Error(error as string);
    }
  },

  async sendNewAdminEmail(userId: string): Promise<void> {
    const user = await Meteor.users.findOneAsync(userId) as MeteorUser | undefined;
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host }) as HostDocument | undefined;
    const email = currentHost && currentHost.emails?.[2];

    try {
      await Meteor.callAsync(
        'sendEmail',
        user?.emails?.[0].address,
        email?.subject,
        getEmailBody(email as EmailTemplate, user?.username || '')
      );
    } catch (error) {
      throw new Meteor.Error(error as string);
    }
  },

  // Unlike the other email methods here, this isn't tied to a user or a
  // host — it's sent from the SSO broker (imports/startup/server/oauth.js /
  // imports/api/sso/magicLink.methods.js) to an email address that may not
  // even have an account yet. There's no tenant Host to name it after, so
  // it's signed with the platform's own name instead.
  async sendMagicLinkEmail(email: string, link: string): Promise<void> {
    check([email, link], [String]);

    const platform = await Platform.findOneAsync();

    try {
      await Meteor.callAsync(
        'sendEmail',
        email,
        'Sign in',
        getMagicLinkEmailBody(link),
        platform?.name
      );
    } catch (error) {
      console.log('email error', error);
      throw new Meteor.Error(error as string);
    }
  },
});
