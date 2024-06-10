import React from 'react';

import {
  ActivitiesList,
  Activity,
  Communities,
  Home,
  GroupsList,
  Group,
  Page,
  ResourcesList,
  Resource,
  WorksList,
  Work,
  UsersList,
  User,
} from './components';

export const AppRoutesSSR = (host) => [
  {
    path: '/',
    element: <Home host={host} />,
  },
  {
    path: '/activities',
    element: <ActivitiesList host={host} />,
  },
  {
    path: '/groups',
    element: <GroupsList host={host} />,
  },
  {
    path: '/works',
    element: <WorksList host={host} />,
  },
  {
    path: '/resources',
    element: <ResourcesList host={host} />,
  },
  {
    path: '/people',
    element: <UsersList host={host} />,
  },
  {
    path: '/communities',
    element: <Communities host={host} />,
  },
  {
    path: '/calendar',
    element: <div />,
  },
  {
    path: '/activities/new',
    element: <div />,
  },
  {
    path: '/activities/:activityId/*',
    element: <Activity />,
  },
  {
    path: '/groups/new',
    element: <div />,
  },
  {
    path: '/groups/:groupId/*',
    element: <Group />,
  },
  {
    path: '/pages/new',
    element: <div />,
  },
  {
    path: '/pages/:pageTitle',
    element: <Page host={host} />,
  },
  {
    path: '/resources/new',
    element: <div />,
  },
  {
    path: '/resources/:resourceId/*',
    element: <Resource />,
  },
  {
    path: '/works/new',
    element: <div />,
  },
  {
    path: '/:usernameSlug/works/:workId/*',
    element: <Work />,
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
