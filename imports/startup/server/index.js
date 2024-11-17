import { Meteor } from 'meteor/meteor';
import { renderWithSSR } from 'meteor/communitypackages:react-router-ssr';
import { Accounts } from 'meteor/accounts-base';

import { AppRoutesSSR } from '../../ssr/AppRoutes';
import './api';
import './migrations';

const { cdn_server } = Meteor.settings;

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

  if (cdn_server) {
    WebAppInternals.setBundledJsCssPrefix(cdn_server);
  }
});

renderWithSSR(AppRoutesSSR, {
  renderTarget: 'root',
});
