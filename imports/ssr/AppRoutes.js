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

export const AppRoutesSSR = (host) => [
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
    path: '/calendar',
    element: <div />,
  },
  {
    path: '/people',
    element: <UsersList host={host} />,
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
    element: <Page host={host} />,
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
    path: '/@/:username/*',
    element: <User />,
  },
  {
    path: '/*',
    element: <div />,
  },
];
