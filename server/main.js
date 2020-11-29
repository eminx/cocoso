import { Meteor } from 'meteor/meteor';

const menu = [
  {
    label: 'activities',
    name: 'activities',
    isVisible: true,
    isHomePage: true,
  },
  {
    label: 'calendar',
    name: 'calendar',
    isVisible: true,
    isHomePage: false,
  },
  {
    label: 'processes',
    name: 'processes',
    isVisible: true,
    isHomePage: false,
  },
  {
    label: 'works',
    name: 'works',
    isVisible: true,
    isHomePage: false,
  },
  {
    label: 'info',
    name: 'info',
    isVisible: true,
    isHomePage: true,
  },
];

Meteor.startup(() => {
  const smtp = Meteor.settings.mailCredentials.smtp;

  Hosts.find().forEach((host) => {
    const existingSettings = host.settings;
    Hosts.update(host._id, {
      $set: {
        settings: {
          ...existingSettings,
          menu: menu,
        },
      },
    });
  });

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
});
