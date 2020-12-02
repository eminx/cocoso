import { Meteor } from 'meteor/meteor';

const menu = [
  {
    label: 'activities',
    name: 'activities',
    isVisible: true,
  },
  {
    label: 'calendar',
    name: 'calendar',
    isVisible: true,
  },
  {
    label: 'processes',
    name: 'processes',
    isVisible: true,
  },
  {
    label: 'works',
    name: 'works',
    isVisible: true,
  },
  {
    label: 'members',
    name: 'members',
    isVisible: true,
  },
  {
    label: 'info',
    name: 'info',
    isVisible: true,
  },
];

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
  Accounts.emailTemplates.resetPassword.text = function (user, url) {
    url = url.replace('#/', '');
    return `To reset your password, simply click the link below. ${url}`;
  };
});
