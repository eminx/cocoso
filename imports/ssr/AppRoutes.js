import React from 'react';

import { Loader } from '/imports/ui/core';

import {
  ActivityList,
  Activity,
  Communities,
  ComposablePage,
  Home,
  GroupList,
  Group,
  Page,
  ResourceList,
  Resource,
  WorkList,
  Work,
  UserList,
  User,
} from './components';
import NotFoundPage from '/imports/ui/pages/NotFoundPage';

export default function AppRoutesSSR(host, sink) {
  const props = {
    host,
    sink,
  };

  return [
    {
      path: '/',
      element: <Home {...props} />,
    },
    {
      path: '/activities',
      element: <ActivityList {...props} />,
    },
    {
      path: '/activities/:activityId/*',
      element: <Activity {...props} />,
    },
    {
      path: '/calendar',
      element: <Loader />,
    },
    {
      path: '/communities',
      element: <Communities {...props} />,
    },
    {
      path: '/cp/:composablePageId/*',
      element: <ComposablePage {...props} />,
    },

    {
      path: '/groups',
      element: <GroupList {...props} />,
    },
    {
      path: '/groups/:groupId/*',
      element: <Group {...props} />,
    },
    {
      path: '/info/:pageTitle',
      element: <Page {...props} />,
    },
    {
      path: '/pages/:pageTitle',
      element: <Page {...props} />,
    },
    {
      path: '/people',
      element: <UserList {...props} />,
    },
    {
      path: '/resources',
      element: <ResourceList {...props} />,
    },
    {
      path: '/resources/:resourceId/*',
      element: <Resource {...props} />,
    },
    {
      path: '/works',
      element: <WorkList {...props} />,
    },
    {
      path: '/:usernameSlug/*',
      element: <User {...props} />,
    },
    {
      path: '/:usernameSlug/works/:workId/*',
      element: <Work {...props} />,
    },
    {
      path: '/*',
      element: <NotFoundPage />,
    },
  ];
}
