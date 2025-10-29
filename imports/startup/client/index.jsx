import { Meteor } from 'meteor/meteor';
import { onPageLoad } from 'meteor/server-render';
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router';

import appRoutes from '/imports/appRoutes';
import SetupHome from '/imports/ui/pages/setup';
import BrowserRoutes from '/imports/ui/pages/BrowserRoutes';
import '/imports/startup/i18n';

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
    Host: currentHost,
    pageTitles,
    platform,
  };

  const router = createBrowserRouter(appRoutes(props));

  hydrateRoot(container, <RouterProvider router={router} />);
});
