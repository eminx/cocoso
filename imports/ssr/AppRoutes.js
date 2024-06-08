import React from 'react';

import {
  ActivitiesList,
  Activity,
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

export const AppRoutesSSR = [
  {
    path: '/activities',
    element: <ActivitiesList />,
  },
  {
    path: '/groups',
    element: <GroupsList />,
  },
  {
    path: '/works',
    element: <WorksList />,
  },
  {
    path: '/resources',
    element: <ResourcesList />,
  },
  {
    path: '/calendar',
    element: <div />,
  },
  {
    path: '/people',
    element: <UsersList />,
  },
  {
    path: '/activity/:activityId/*',
    element: <Activity />,
  },
  {
    path: '/group/:groupId/*',
    element: <Group />,
  },
  {
    path: '/pages/:pageTitle',
    element: <Page />,
  },
  {
    path: '/resource/:resourceId/*',
    element: <Resource />,
  },
  {
    path: '/@/:username/work/:workId/*',
    element: <Work />,
  },
  {
    path: '/@/:username',
    element: <User />,
  },
];
