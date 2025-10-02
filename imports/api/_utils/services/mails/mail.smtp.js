import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { check } from 'meteor/check';

import { getHost } from '../../shared';
import Hosts from '../../../hosts/host';
import { isValidEmail, getEmailBody } from './mail.helpers';
import { getWelcomeEmailBody } from './templates.mails';

Meteor.methods({
  async sendEmail(id, subjectEmail, textEmail) {
    check([id, subjectEmail, textEmail], [String]);
    const fromEmail = Meteor.settings.mailCredentials.smtp.fromEmail;

    let toEmail;
    if (isValidEmail(id)) {
      toEmail = id;
    } else {
      const user = await Meteor.users.findOneAsync({ $or: [{ _id: id }, { username: id }] });
      if (user) {
        toEmail = user.emails[0]?.address;
      }
    }

    if (!isValidEmail(toEmail)) {
      return;
    }

    this.unblock();

    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    let fromEmailWithHostName = fromEmail;
    if (currentHost && currentHost.settings && currentHost.settings.name) {
      fromEmailWithHostName = `${currentHost.settings.name} ${fromEmail}`;
    }

    const data = {
      from: fromEmailWithHostName,
      to: toEmail,
      subject: subjectEmail,
      html: textEmail,
    };

    await Email.sendAsync(data);
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

    await Meteor.callAsync(
      'sendEmail',
      user?.emails[0].address,
      welcomeText?.subject,
      emailBody,
      (error, respond) => {
        if (error) {
          console.log(error);
        }
      }
    );
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

    await Meteor.callAsync(
      'sendEmail',
      user?.emails[0].address,
      welcomeText?.subject,
      emailBody,
      (error, respond) => {
        if (error) {
          console.log(error);
        }
      }
    );
  },

  async sendNewAdminEmail(userId) {
    const user = await Meteor.users.findOneAsync(userId);
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const email = currentHost && currentHost.emails[2];

    await Meteor.callAsync(
      'sendEmail',
      user.emails[0].address,
      email.subject,
      getEmailBody(email, user.username)
    );
  },
});
