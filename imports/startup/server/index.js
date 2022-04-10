import './api';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Resources from '../../api/resources/resource';
import Chats from '../../api/chats/chat';

Meteor.startup(() => {
  // import { freshInstallment } from './installation';

  // freshInstallment();

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

  Resources.find().forEach((r) => {
    Chats.insert({
      host: r.host,
      contextId: r._id,
      contextName: r.label,
      createdBy: {
        userId: 'P7gktqsquKYsDZAxe',
        username: 'emin',
      },
      isNotificationOn: false,
      messages: new Array(),
    });
  });
});

import './migrations';
