import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  const smtp = Meteor.settings.mailCredentials.smtp;

  process.env.MAIL_URL =
    'smtps://' +
    encodeURIComponent(smtp.userName) +
    ':' +
    smtp.password +
    '@' +
    smtp.host +
    ':' +
    smtp.port;
  Accounts.emailTemplates.resetPassword.from = () => smtp.fromEmail;
  Accounts.emailTemplates.from = () => smtp.fromEmail;

  if (!Hosts.find({ host: 'nodal.app' })) {
    Hosts.insert({ host: 'nodal.app' });
  }

  if (!Hosts.find({ host: 'cicnetwork.herokuapp.com', settings: {} })) {
    Hosts.insert({ host: 'cicnetwork.herokuapp.com', settings: {} });
  }
});
