import { Meteor } from 'meteor/meteor';
import React, { memo } from 'react';
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

let stitchesConfig = null;

export default async function serverRenderer(sink) {
  const host = sink?.request?.headers?.['host'];
  const Host = await Hosts.findOneAsync({ host });
  const platform = await Platform.findOneAsync();
  const currentUser = await Meteor.callAsync('getCurrentUser');
  const pages = await Meteor.callAsync('getPageTitles');

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

  const pageTitles = pages.map((p) => p.title);

  const pathname = sink?.request?.url?.pathname;
  const search = sink?.request?.url?.search;

  const props = {
    Host,
    pageTitles,
    platform,
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

  sink.renderIntoElementById('root', appHtml);
}
