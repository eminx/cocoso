import { Meteor } from 'meteor/meteor';
import { renderWithSSR } from 'meteor/communitypackages:react-router-ssr';

import { AppRoutesSSR } from '../../ssr/AppRoutes';
import { Accounts } from 'meteor/accounts-base';

import './api';
import './migrations';

Meteor.startup(() => {
  const smtp = Meteor.settings?.mailCredentials?.smtp;

  process.env.MAIL_URL = `smtps://${encodeURIComponent(smtp.userName)}:${smtp.password}@${
    smtp.host
  }:${smtp.port}`;
  Accounts.emailTemplates.resetPassword.from = () => smtp.fromEmail;
  Accounts.emailTemplates.from = () => smtp.fromEmail;
  Accounts.emailTemplates.resetPassword.text = function (user, url) {
    const newUrl = url.replace('#/', '');
    return `To reset your password, simply click the link below. ${newUrl}`;
  };

  Meteor.onConnection(function (result) {
    const host = result.httpHeaders.host;
    renderWithSSR(AppRoutesSSR(host), {
      renderTarget: 'root',
    });
  });
});
