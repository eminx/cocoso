import { Meteor } from 'meteor/meteor';
import React, { memo } from 'react';
import { Helmet } from 'react-helmet';
import { renderToString } from 'react-dom/server';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router';

import AppRoutes from '/imports/ssr/AppRoutes';
import Hosts from '/imports/api/hosts/host';
import { getGlobalStyles } from '/imports/ui/utils/globalStylesManager';

let stitchesConfig = null;

export default async function ServerRenderer(sink) {
  const host = sink?.request?.headers?.['host'];
  const Host = await Hosts.findOneAsync({ host });

  if (!stitchesConfig) {
    stitchesConfig = await import('/stitches.config');
  }
  const globalCssString = Host ? getGlobalStyles(Host.theme) : '';
  const { getCssText } = stitchesConfig;
  const helmet = Helmet.renderStatic();

  sink.appendToHead(`
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    <style id="global-theme">${globalCssString}</style>
    <style id="stitches">${getCssText()}</style>
  `);

  const pages = await Meteor.callAsync('getPageTitles');
  const pageTitles = pages.map((p) => p.title);

  const pathname = sink?.request?.url?.pathname;
  const search = sink?.request?.url?.search;

  // const data = await dataFetcher({
  //   host,
  //   isPortalHost: Boolean(Host.isPortalHost),
  //   menu,
  //   pathname,
  //   search,
  // });

  const props = {
    Host,
    pageTitles,
    sink,
  };

  // Create routes with props
  const routes = AppRoutes(props);

  // Create static handler and router for SSR
  const { query, dataRoutes } = createStaticHandler(routes);

  // Create fetch request for the current URL
  const protocol = sink?.request?.connection?.encrypted ? 'https' : 'http';
  const fullUrl = `${protocol}://${host}${pathname}${search || ''}`;
  const fetchRequest = new Request(fullUrl);

  // Execute data loading
  const context = await query(fetchRequest);

  if (context instanceof Response) {
    throw context;
  }

  // Handle redirects or responses
  if (context instanceof Response) {
    // Handle redirects or other responses
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

  sink.renderIntoElementById('root', appHtml);
}
