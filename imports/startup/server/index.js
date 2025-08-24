import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { onPageLoad } from 'meteor/server-render';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { I18nextProvider, useSSR } from 'react-i18next';

import i18n from '/imports/startup/i18n';
import AppRoutesSSR from '../../ssr/AppRoutes';
import './api';
import './migrations';

import Hosts from '/imports/api/hosts/host';

const { cdn_server } = Meteor.settings;

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

  onPageLoad((sink) => {
    const host = sink.request.headers['host'];
    const context = {};

    if (typeof document === 'undefined') {
      React.useLayoutEffect = React.useEffect;
    }

    const App = (props) => (
      <I18nextProvider i18n={i18n}>
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
      </I18nextProvider>
    );

    sink.renderIntoElementById(
      'root',
      renderToString(<App location={sink.request.url} />)
    );
    const helmet = Helmet.renderStatic();
    sink.appendToHead(helmet.meta.toString());
    sink.appendToHead(helmet.title.toString());
    sink.appendToHead(helmet.link.toString());
  });

  Hosts.find({ $or: [{ theme: { $exists: false } }, { theme: null }] }).forEach(
    (host) => {
      const hue =
        host.settings && host.settings.hue ? host.settings.hue : '222'; // fallback if needed
      Hosts.update(
        { _id: host._id },
        {
          $set: {
            theme: {
              hue,
              body: {
                backgroundColor: '#eee',
                backgroundImage: 'none',
                backgroundRepeat: 'no-repeat',
                borderRadius: '0.5rem',
                fontFamily: 'Sarabun',
              },
              menu: {
                backgroundColor: '#f5f5f5',
                borderColor: '#ddd',
                borderRadius: '0.5rem',
                borderStyle: 'solid',
                borderWidth: '2px',
                color: '#090909',
                fontStyle: 'normal',
                textTransform: 'none',
              },
              variant: 'custom',
            },
          },
        }
      );
    }
  );
});
