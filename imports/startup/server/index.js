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

import serverRenderer from './serverRenderer';
import './api';
import './migrations';
import './oauth';

const { cdn_server } = Meteor.settings;

function setupSMTP() {
  const smtp = Meteor.settings?.mailCredentials?.smtp;

  if (!smtp) {
    console.warn(
      'SMTP settings not found in Meteor.settings.mailCredentials.smtp'
    );
    return;
  }

  process.env.MAIL_URL = `smtps://${encodeURIComponent(smtp.userName)}:${
    smtp.password
  }@${smtp.host}:${smtp.port}`;
  Accounts.emailTemplates.resetPassword.from = () => smtp.fromEmail;
  Accounts.emailTemplates.from = () => smtp.fromEmail;
  Accounts.emailTemplates.resetPassword.text = function (user, url) {
    const newUrl = url.replace('#/', '');
    return `To reset your password, simply click the link below. ${newUrl}`;
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
