import { Meteor } from 'meteor/meteor';
import { onPageLoad } from 'meteor/server-render';
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router';

import AppRoutes from '/imports/ui/pages/Routes';
import SetupHome from '/imports/ui/pages/setup';

import '../i18n';
import LayoutContainer from '/imports/ui/LayoutContainer';

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
    initialCurrentHost,
    initialPageTitles,
    platform,
  };

  const routes = createRoutesFromElements(AppRoutes());
  const router = createBrowserRouter(routes);

  hydrateRoot(
    container,
    <LayoutContainer {...props}>
      <RouterProvider router={router} />
    </LayoutContainer>
  );
});
