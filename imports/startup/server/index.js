import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { onPageLoad } from 'meteor/server-render';
import React, { memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';

import Hosts from '/imports/api/hosts/host';
import AppRoutesSSR from '/imports/ssr/AppRoutes';
import { getGlobalStyles } from '/imports/ui/utils/globalStylesManager';

import './api';
import './migrations';

const { cdn_server } = Meteor.settings;

const App = memo(({ context = {}, sink }) => {
  const host = sink.request.headers['host'];

  return (
    <StaticRouter location={sink.request.url} context={context}>
      <Routes>
        {AppRoutesSSR(host, sink).map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
            url={sink.request.url}
            sink={sink}
          />
        ))}
      </Routes>
    </StaticRouter>
  );
});

Meteor.startup(() => {
  const smtp = Meteor.settings?.mailCredentials?.smtp;

  process.env.MAIL_URL = `smtps://${encodeURIComponent(smtp.userName)}:${
    smtp.password
  }@${smtp.host}:${smtp.port}`;
  Accounts.emailTemplates.resetPassword.from = () => smtp.fromEmail;
  Accounts.emailTemplates.from = () => smtp.fromEmail;
  Accounts.emailTemplates.resetPassword.text = function (user, url) {
    const newUrl = url.replace('#/', '');
    return `To reset your password, simply click the link below. ${newUrl}`;
  };

  if (cdn_server) {
    WebAppInternals.setBundledJsCssPrefix(cdn_server);
  }

  const { getCssText } = require('/stitches.config');

  onPageLoad(async (sink) => {
    try {
      const host = sink?.request?.headers?.['host'];
      const Host = await Hosts.findOneAsync({ host });
      const theme = Host?.theme;

      // NEW: this now returns a string, not a function
      const globalCssString = getGlobalStyles(theme);

      const appHtml = renderToString(<App sink={sink} />);
      const helmet = Helmet.renderStatic();

      sink.appendToHead(`
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      <style id="global-theme">${globalCssString}</style>
      <style id="stitches">${getCssText()}</style>
    `);

      sink.renderIntoElementById('root', appHtml);
    } catch (error) {
      console.log(error);
    }
  });
});
