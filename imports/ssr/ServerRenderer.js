import { Meteor } from 'meteor/meteor';
import React, { memo } from 'react';
import { Helmet } from 'react-helmet';
import { renderToString } from 'react-dom/server';
import { Routes, Route } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import AppRoutes from '/imports/ssr/AppRoutes';
import Hosts from '/imports/api/hosts/host';
import { getGlobalStyles } from '/imports/ui/utils/globalStylesManager';

import dataFetcher from '/imports/ssr/dataFetcher';

const RouterSSR = memo(({ context = {}, ...rest }) => {
  const sink = rest.sink;

  return (
    <StaticRouter location={sink.request.url} context={context}>
      <Routes>
        {AppRoutes(rest).map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </StaticRouter>
  );
});

let stitchesConfig = null;

export default async function ServerRenderer(sink) {
  const host = sink?.request?.headers?.['host'];
  const Host = await Hosts.findOneAsync({ host });
  const theme = Host?.theme;

  if (!stitchesConfig) {
    stitchesConfig = await import('/stitches.config');
  }
  const { getCssText } = stitchesConfig;
  const globalCssString = getGlobalStyles(theme);
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
  const data = await dataFetcher({
    pathname,
    search,
    host,
    isPortalHost: Boolean(Host.isPortalHost),
  });

  const props = {
    data,
    Host,
    pageTitles,
    sink,
  };
  const appHtml = renderToString(<RouterSSR {...props} />);

  sink.renderIntoElementById('root', appHtml);
}
