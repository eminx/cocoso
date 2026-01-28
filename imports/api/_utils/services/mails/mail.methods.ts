import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { check } from 'meteor/check';

import { getHost } from '../../shared';
import Hosts from '../../../hosts/host';
import {
  isValidEmail,
  getEmailBody,
  extractEmailAddress,
  EmailTemplate,
} from './mail.helpers';
import { getWelcomeEmailBody } from './templates.mails';
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
  async sendEmail(id: string, subjectEmail: string, textEmail: string): Promise<void> {
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

    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host }) as HostDocument | undefined;

    let fromEmailWithHostName = fromEmail;
    if (currentHost && currentHost.settings && currentHost.settings.name) {
      const extractedEmail = extractEmailAddress(fromEmail);
      fromEmailWithHostName = `${currentHost.settings.name} <${extractedEmail}>`;
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
});
