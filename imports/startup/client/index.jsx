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
import appRoutes from '../../ssr/appRoutes';
// import LayoutContainer from '/imports/ui/LayoutContainer';

onPageLoad(async () => {
  const container = document.getElementById('root');

  const platform = await Meteor.callAsync('getPlatform');
  const currentHost = await Meteor.callAsync('getCurrentHost');
  const pageTitles = await Meteor.callAsync('getPageTitles');

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
  const router = createBrowserRouter(appRoutes(props));

  hydrateRoot(
    container,
    // <LayoutContainer {...props}>
    <RouterProvider router={router} />
    // </LayoutContainer>
  );
});
