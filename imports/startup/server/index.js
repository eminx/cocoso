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

function setupSMTP() {
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
}

const RouterSSR = memo(({ context = {}, ...rest }) => {
  const sink = rest.sink;

  return (
    <StaticRouter location={sink.request.url} context={context}>
      <Routes>
        {AppRoutesSSR(rest).map((route) => (
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

async function dataFetcherSSR(pathname, isPortalHost = false) {
  if (pathname === '/activities') {
    if (isPortalHost) {
      return await Meteor.callAsync('getAllPublicActivitiesFromAllHosts');
    }
    return await Meteor.callAsync('getAllPublicActivities');
  }
}

async function ServerRenderer(sink) {
  const host = sink?.request?.headers?.['host'];
  const Host = await Hosts.findOneAsync({ host });
  const pages = await Meteor.callAsync('getPageTitles');

  const pageTitles = pages.map((p) => p.title);
  const theme = Host?.theme;

  const { getCssText } = require('/stitches.config');
  const globalCssString = getGlobalStyles(theme);

  const helmet = Helmet.renderStatic();
  sink.appendToHead(`
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    <style id="global-theme">${globalCssString}</style>
    <style id="stitches">${getCssText()}</style>
  `);

  const pathname = sink?.request?.url?.pathname;
  const data = await dataFetcherSSR(pathname, Boolean(Host.isPortalHost));
  const props = {
    data,
    Host,
    pageTitles,
    sink,
  };
  const appHtml = renderToString(<RouterSSR {...props} />);

  sink.renderIntoElementById('root', appHtml);
}

Meteor.startup(() => {
  setupSMTP();

  if (cdn_server) {
    WebAppInternals.setBundledJsCssPrefix(cdn_server);
  }

  onPageLoad(async (sink) => {
    try {
      await ServerRenderer(sink);
    } catch (error) {
      console.log(error);
    }
  });
});
