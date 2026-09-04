import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Helmet } from 'react-helmet';
import { renderToString } from 'react-dom/server';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router';

import Hosts from '/imports/api/hosts/host';
import Platform from '/imports/api/platform/platform';
import appRoutes from '/imports/appRoutes';
import { getGlobalStyles } from '/imports/ui/utils/globalStylesManager';
import i18n from '/imports/startup/i18n';
import { resolveLangFromRequest } from '/imports/api/_utils/i18n/serverI18n';

let stitchesConfig = null;

export default async function serverRenderer(sink) {
  const host = sink?.request?.headers?.['host'];

  // The SSO broker domain has no Hosts doc and isn't a tenant site — skip
  // the normal Hosts-driven route render entirely and let the client
  // bundle mount BrokerAuthPage (see imports/startup/client/index.jsx).
  // Styling still needs injecting by hand here though. getGlobalStyles()
  // works fine with no theme, but theme?.body?.borderRadius falls back to
  // '0' (square) when there's no theme to read from — pass a small default
  // explicitly so the broker's form elements aren't rigid-looking.
  if (
    Meteor.settings.public?.authDomain &&
    host === Meteor.settings.public.authDomain
  ) {
    if (!stitchesConfig) {
      stitchesConfig = await import('/stitches.config');
    }
    // 0.25rem matches defaultTheme.body.borderRadius (imports/startup/constants.js)
    const globalCssString = getGlobalStyles({ body: { borderRadius: '0.25rem' } });
    sink.appendToHead(`
      <style id="global-theme">${globalCssString}</style>
      <style id="stitches">${stitchesConfig.getCssText()}</style>
    `);
    return;
  }

  const Host = await Hosts.findOneAsync({ host });
  const allHosts = await Meteor.callAsync('getAllHosts');
  const platform = await Platform.findOneAsync();
  const pages = await Meteor.callAsync('getPageTitles');

  if (!stitchesConfig) {
    stitchesConfig = await import('/stitches.config');
  }
  const globalCssString = Host ? getGlobalStyles(Host.theme) : '';
  const { getCssText } = stitchesConfig;

  const pageTitles = pages.map((p) => p.title);

  const pathname = sink?.request?.url?.pathname;
  const search = sink?.request?.url?.search;

  // Resolve the visitor's actual language (querystring -> i18next cookie ->
  // Accept-Language -> default), mirroring the client LanguageDetector's own
  // priority order, and render with a per-request clone rather than
  // mutating the shared i18n singleton — that would race under concurrent
  // requests in different languages. The clone shares already-loaded
  // resource data (see the Meteor.startup block in imports/startup/i18n.js
  // that preloads common+accounts for all languages), so this is cheap and
  // synchronous, not a fresh fetch.
  const lngParam = new URLSearchParams(search || '').get('lng');
  const resolvedLang = resolveLangFromRequest(sink.request, lngParam);
  const requestI18n = i18n.cloneInstance({ lng: resolvedLang });

  const props = {
    Host,
    allHosts,
    pageTitles,
    platform,
    i18nInstance: requestI18n,
  };

  const routes = appRoutes(props);
  const { query, dataRoutes } = createStaticHandler(routes);

  const protocol = sink?.request?.connection?.encrypted ? 'https' : 'http';
  const fullUrl = `${protocol}://${host}${pathname}${search || ''}`;
  const fetchRequest = new Request(fullUrl);

  const context = await query(fetchRequest);

  if (context instanceof Response) {
    if (context.status >= 300 && context.status < 400) {
      const location = context.headers.get('Location');
      sink.redirect(location);
      return;
    }
    throw context;
  }

  const router = createStaticRouter(dataRoutes, context);

  const appHtml = renderToString(
    <StaticRouterProvider router={router} context={context} />
  );

  const helmet = Helmet.renderStatic();

  sink.appendToHead(`
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    <style id="global-theme">${globalCssString}</style>
    <style id="stitches">${getCssText()}</style>
  `);

  sink.renderIntoElementById('root', appHtml);
}
