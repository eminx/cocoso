import React from 'react';

import {
  // ActivitiesList,
  Activity,
  // Communities,
  // Home,
  // GroupsList,
  Group,
  Page,
  // ResourcesList,
  Resource,
  // WorksList,
  Work,
  // UsersList,
  User,
} from './components';

export const AppRoutesSSR = [
  {
    path: '/',
    element: <div />,
  },
  {
    path: '/activities',
    element: <div />,
  },
  {
    path: '/groups',
    element: <div />,
  },
  {
    path: '/resources',
    element: <div />,
  },
  {
    path: '/works',
    element: <div />,
  },
  {
    path: '/people',
    element: <div />,
  },
  {
    path: '/communities',
    element: <div />,
  },
  {
    path: '/calendar',
    element: <div />,
  },
  {
    path: '/activities/:activityId/*',
    element: <Activity />,
  },
  {
    path: '/activities/new',
    element: <div />,
  },
  {
    path: '/groups/:groupId/*',
    element: <Group />,
  },
  {
    path: '/groups/new',
    element: <div />,
  },
  {
    path: '/pages/:pageTitle',
    element: <Page />,
  },
  {
    path: '/pages/new',
    element: <div />,
  },
  {
    path: '/resources/:resourceId/*',
    element: <Resource />,
  },
  {
    path: '/resources/new',
    element: <div />,
  },
  {
    path: '/:usernameSlug/works/:workId/*',
    element: <Work />,
  },
  {
    path: '/works/new',
    element: <div />,
  },
  {
    path: '/:usernameSlug/*',
    element: <User />,
  },
  {
    path: '/*',
    element: <div />,
  },
];
