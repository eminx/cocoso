import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { check } from 'meteor/check';

import { getHost } from '../../shared';
import Hosts from '../../../hosts/host';
import {
  isValidEmail,
  getEmailBody,
  extractEmailAddress,
} from './mail.helpers';
import { getWelcomeEmailBody } from './templates.mails';

Meteor.methods({
  async sendEmail(id, subjectEmail, textEmail) {
    check([id, subjectEmail, textEmail], [String]);
    const fromEmail = Meteor.settings.mailCredentials.smtp.fromEmail;

    const isEmailValid = isValidEmail(id);

    let toEmail;
    if (isEmailValid) {
      toEmail = id;
    }
    if (!isEmailValid) {
      const user = await Meteor.users.findOneAsync({
        $or: [{ _id: id }, { username: id }],
      });
      toEmail = user.emails?.[0]?.address;
    }

    if (!toEmail) {
      return;
    }

    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

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
      throw new Meteor.Error(error);
    }
  },

  async sendWelcomeEmail(userId, hostToJoin) {
    const user = await Meteor.users.findOneAsync(userId);
    const host = hostToJoin || getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const welcomeText = currentHost && currentHost.emails[0];

    const emailBody = getWelcomeEmailBody(
      welcomeText?.appeal,
      currentHost,
      user?.username,
      welcomeText?.body
    );

    try {
      await Meteor.callAsync(
        'sendEmail',
        user?.emails[0].address,
        welcomeText?.subject,
        emailBody
      );
    } catch (error) {
      console.log('email error', error);
      throw new Meteor.Error(error);
    }
  },

  async sendNewContributorEmail(userId) {
    const user = await Meteor.users.findOneAsync(userId);
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const welcomeText = currentHost && currentHost.emails[1];

    const emailBody = getWelcomeEmailBody(
      welcomeText?.appeal,
      currentHost,
      user?.username,
      welcomeText?.body
    );

    try {
      await Meteor.callAsync(
        'sendEmail',
        user?.emails[0].address,
        welcomeText?.subject,
        emailBody
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async sendNewAdminEmail(userId) {
    const user = await Meteor.users.findOneAsync(userId);
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const email = currentHost && currentHost.emails[2];

    try {
      await Meteor.callAsync(
        'sendEmail',
        user.emails[0].address,
        email.subject,
        getEmailBody(email, user.username)
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
