import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { getHost } from '../@/shared';

const publicSettings = Meteor.settings.public;

function isValidEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

getEmailBody = (email, username) => {
  return `${email.appeal} ${username},\n${email.body}`;
};

Meteor.methods({
  sendEmail(id, subjectEmail, textEmail, isNewUser) {
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

    let fromEmailWithHostName = publicSettings.name + ' ' + fromEmail;
    if (
      currentHost &&
      currentHost.settings &&
      currentHost.settings.name &&
      currentHost.settings.name.length > 2
    ) {
      fromEmailWithHostName = currentHost.settings.name + ' ' + fromEmail;
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
