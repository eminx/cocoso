import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { check } from 'meteor/check';

import { getHost } from '../../shared';
import Hosts from '../../../hosts/host';
import { isValidEmail, getEmailBody } from './mail.helpers';

const publicSettings = Meteor.settings.public;

Meteor.methods({
  sendEmail(id, subjectEmail, textEmail) {
    console.log(subjectEmail);
    check([id, subjectEmail, textEmail], [String]);
    const fromEmail = Meteor.settings.mailCredentials.smtp.fromEmail;
    let toEmail;

    if (isValidEmail(id)) {
      toEmail = id;
    } else if (id.length === 17) {
      toEmail = Meteor.users.findOne({ _id: id }).emails[0].address;
    } else {
      toEmail = Meteor.users.findOne({ username: id }).emails[0].address;
    }

    this.unblock();

    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    let fromEmailWithHostName = `${publicSettings.name} ${fromEmail}`;
    if (
      currentHost &&
      currentHost.settings &&
      currentHost.settings.name &&
      currentHost.settings.name.length > 2
    ) {
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

  sendWelcomeEmail(userId) {
    const user = Meteor.users.findOne(userId);
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const email = currentHost && currentHost.emails[0];

    Meteor.call(
      'sendEmail',
      user.emails[0].address,
      email.subject,
      getEmailBody(email, user.username)
    );
  },

  sendNewContributorEmail(userId) {
    const user = Meteor.users.findOne(userId);
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const email = currentHost && currentHost.emails[1];

    Meteor.call(
      'sendEmail',
      user.emails[0].address,
      email.subject,
      getEmailBody(email, user.username)
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
