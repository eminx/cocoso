import { Meteor } from 'meteor/meteor';
import { onPageLoad } from 'meteor/server-render';
import { Autoupdate } from 'meteor/autoupdate';
import { Tracker } from 'meteor/tracker';
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router';

import appRoutes from '/imports/appRoutes';
import SetupHome from '/imports/ui/pages/setup';
import '/imports/startup/i18n';

// Meteor's `autoupdate` package tracks whether the server has a newer client
// bundle than the one this tab is running (e.g. after a deploy). Lazily
// loaded routes (loadable()/import()) fetch their chunk from the server keyed
// to the currently loaded bundle version, so once the server has moved on,
// those fetches start failing with "Cannot find module" until the page
// reloads. Rather than reacting to that crash, reload proactively the next
// time navigation goes idle after a new bundle is detected — i.e. right
// after the user finishes a route transition, not while they're mid-edit on
// the current page.
function reloadOnNextIdleAfterUpdate(router) {
  let staleClientDetected = false;
  let wasNavigating = false;

  Tracker.autorun(() => {
    if (Autoupdate.newClientAvailable()) {
      staleClientDetected = true;
    }
  });

  router.subscribe((state) => {
    const isNavigating = state.navigation.state !== 'idle';

    if (staleClientDetected && wasNavigating && !isNavigating) {
      window.location.reload();
    }

    wasNavigating = isNavigating;
  });
}

onPageLoad(async () => {
  const container = document.getElementById('root');

  const currentHost = await Meteor.callAsync('getCurrentHost');
  const allHosts = await Meteor.callAsync('getAllHosts');
  const platform = await Meteor.callAsync('getPlatform');
  const pageTitles = await Meteor.callAsync('getPageTitles');

  console.log('Initializing...');
  console.log('Current Host:', currentHost);

  if (!platform || !currentHost) {
    console.log(
      'Platform or current host not found. Rendering SetupHome component.'
    );
    const root = createRoot(container);
    root.render(<SetupHome />);
    return;
  }

  const props = {
    Host: currentHost,
    allHosts,
    pageTitles,
    platform,
  };

  const router = createBrowserRouter(appRoutes(props));
  reloadOnNextIdleAfterUpdate(router);

  hydrateRoot(container, <RouterProvider router={router} />);
});
