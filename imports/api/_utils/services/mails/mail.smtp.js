import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { check } from 'meteor/check';

import { getHost } from '../../shared';
import Hosts from '../../../hosts/host';
import { isValidEmail, getEmailBody } from './mail.helpers';
import { getWelcomeEmailBody } from './templates.mails';

Meteor.methods({
  sendEmail(id, subjectEmail, textEmail) {
    check([id, subjectEmail, textEmail], [String]);
    const fromEmail = Meteor.settings.mailCredentials.smtp.fromEmail;

    let toEmail;
    if (isValidEmail(id)) {
      toEmail = id;
    } else {
      const user = Meteor.users.findOne({ $or: [{ _id: id }, { username: id }] });
      if (user) {
        toEmail = user.emails[0]?.address;
      }
    }

    if (!isValidEmail(toEmail)) {
      return;
    }

    this.unblock();

    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

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

    Email.send(data);
  },

  sendWelcomeEmail(userId, hostToJoin) {
    const user = Meteor.users.findOne(userId);
    const host = hostToJoin || getHost(this);
    const currentHost = Hosts.findOne({ host });
    const welcomeText = currentHost && currentHost.emails[0];

    const emailBody = getWelcomeEmailBody(
      welcomeText?.appeal,
      currentHost,
      user?.username,
      welcomeText?.body
    );

    Meteor.call(
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

  sendNewContributorEmail(userId) {
    const user = Meteor.users.findOne(userId);
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const welcomeText = currentHost && currentHost.emails[1];

    const emailBody = getWelcomeEmailBody(
      welcomeText?.appeal,
      currentHost,
      user?.username,
      welcomeText?.body
    );

    Meteor.call(
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

  sendNewAdminEmail(userId) {
    const user = Meteor.users.findOne(userId);
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const email = currentHost && currentHost.emails[2];

    Meteor.call(
      'sendEmail',
      user.emails[0].address,
      email.subject,
      getEmailBody(email, user.username)
    );
  },
});
