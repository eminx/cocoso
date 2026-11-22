import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { onPageLoad } from 'meteor/server-render';
import React from 'react';

import Hosts from '/imports/api/hosts/host';
import Memberships from '/imports/api/memberships/membership';
import Activities from '/imports/api/activities/activity';
import Occurrences from '/imports/api/occurrences/occurrence';
import Registrations from '/imports/api/registrations/registration';
import { buildOccurrenceFields } from '/imports/api/occurrences/occurrence.helpers';
import { call } from '/imports/api/_utils/shared';

import mailtranslations from './mailtranslations';
import serverRenderer from './serverRenderer';
import './api';
import './migrations';
import './oauth';

const { cdn_server } = Meteor.settings;

function setupSMTP() {
  const smtp = Meteor.settings?.mailCredentials?.smtp;
  const authDomain = Meteor.settings?.public?.authDomain;

  if (!smtp) {
    console.warn(
      'SMTP settings not found in Meteor.settings.mailCredentials.smtp'
    );
    return;
  }
  if (!authDomain) {
    console.warn('Auth Domain not found in Meteor.settings.public.authDomain');
    return;
  }

  process.env.MAIL_URL = `smtps://${encodeURIComponent(smtp.userName)}:${
    smtp.password
  }@${smtp.host}:${smtp.port}`;

  const platformName = Meteor.settings?.public?.name;
  const fromEmail = `${platformName} ${smtp.fromEmail}`;

  const browserLang = navigator.language.split('-')[0];
  const translations = mailtranslations[browserLang] ?? mailtranslations['en'];

  Accounts.urls.verifyEmail = (token) =>
    `https://${authDomain}/verify-email/${token}`;
  Accounts.urls.resetPassword = (token) =>
    `https://${authDomain}/reset-password/${token}`;

  Accounts.emailTemplates.siteName = platformName;
  Accounts.emailTemplates.from = fromEmail;

  Accounts.emailTemplates.resetPassword.from = () => fromEmail;
  Accounts.emailTemplates.resetPassword.subject = (user) => {
    return translations.resetPassword.subject(platformName);
  };
  Accounts.emailTemplates.resetPassword.html = (user, url) => {
    const newUrl = url.replace('#/', '');
    return translations.resetPassword.html(newUrl, user.username);
  };

  Accounts.emailTemplates.verifyEmail.from = () => fromEmail;
  Accounts.emailTemplates.verifyEmail.subject = (user) => {
    return translations.verifyEmail.subject(platformName);
  };
  Accounts.emailTemplates.verifyEmail.html = (user, url) => {
    return translations.verifyEmail.html(url, user.username);
  };
}

Meteor.startup(async () => {
  setupSMTP();

  if (cdn_server) {
    WebAppInternals.setBundledJsCssPrefix(cdn_server);
  }

  onPageLoad(async (sink) => {
    try {
      await serverRenderer(sink);
    } catch (error) {
      console.error('SSR Error:', error);
      sink.renderIntoElementById('root', '<div>Server rendering failed</div>');
    }
  });
});
