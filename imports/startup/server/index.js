import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { onPageLoad } from 'meteor/server-render';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';

import AppRoutesSSR from '../../ssr/AppRoutes';
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

  onPageLoad((sink) => {
    const host = sink.request.headers['host'];
    const context = {};

    const App = (props) => (
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

    sink.renderIntoElementById('root', renderToString(<App location={sink.request.url} />));
    const helmet = Helmet.renderStatic();
    sink.appendToHead(helmet.meta.toString());
    sink.appendToHead(helmet.title.toString());
  });
});
