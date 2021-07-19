import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { getHost } from './shared';

function isValidEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

getWelcomeEmailBody = (welcomeEmail, username) => {
  return `${welcomeEmail.appeal} ${username},\n${welcomeEmail.body}`;
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

    const data = {
      from: fromEmail,
      to: toEmail,
      subject: subjectEmail,
      text: textEmail,
    };

    Email.send(data);
  },

  sendWelcomeEmail(userId) {
    const user = Meteor.users.findOne(userId);
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const welcomeEmail = currentHost && currentHost.emails.welcomeEmail;

    Meteor.call(
      'sendEmail',
      user.emails[0].address,
      welcomeEmail.subject,
      getWelcomeEmailBody(welcomeEmail, user.username),
      true // is new user
    );
  },
});
