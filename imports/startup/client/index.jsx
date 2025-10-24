import { Meteor } from 'meteor/meteor';
import { onPageLoad } from 'meteor/server-render';
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router';

import SetupHome from '/imports/ui/pages/setup';
import BrowserRoutes from '/imports/ui/pages/BrowserRoutes';

import '../i18n';
import AppRoutes from '/imports/ssr/AppRoutes';
// import LayoutContainer from '/imports/ui/LayoutContainer';

onPageLoad(async () => {
  const container = document.getElementById('root');

  const platform = await Meteor.callAsync('getPlatform');
  const currentHost = await Meteor.callAsync('getCurrentHost');
  const pages = await Meteor.callAsync('getPageTitles');
  const pageTitles = pages.map((p) => p.title);

  if (!platform || !currentHost) {
    const root = createRoot(container);
    root.render(<SetupHome />);
    return;
  }

  const props = {
    // initialCurrentHost: currentHost,
    // initialPageTitles: pageTitles,
    // platform,
    Host: currentHost,
    pageTitles,
  };

  // const routes = createRoutesFromElements(<BrowserRoutes />);
  const router = createBrowserRouter(AppRoutes(props));

  hydrateRoot(
    container,
    // <LayoutContainer {...props}>
    <RouterProvider router={router} />
    // </LayoutContainer>
  );
});
