import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Spiderable from 'meteor/ostrio:spiderable-middleware';

import './api';
import './migrations';

const { ostrio } = Meteor.settings;

Meteor.startup(() => {
  const smtp = Meteor.settings.mailCredentials.smtp;

  process.env.MAIL_URL = `smtps://${encodeURIComponent(smtp.userName)}:${smtp.password}@${
    smtp.host
  }:${smtp.port}`;
  Accounts.emailTemplates.resetPassword.from = () => smtp.fromEmail;
  Accounts.emailTemplates.from = () => smtp.fromEmail;
  Accounts.emailTemplates.resetPassword.text = function (user, url) {
    const newUrl = url.replace('#/', '');
    return `To reset your password, simply click the link below. ${newUrl}`;
  };
});

if (ostrio) {
  WebApp.connectHandlers.use(
    new Spiderable({
      rootURL: Meteor.absoluteUrl(),
      serviceURL: ostrio.serviceURL,
      auth: `${ostrio.APIUser}:${ostrio.APIPass}`,
    })
  );
}
