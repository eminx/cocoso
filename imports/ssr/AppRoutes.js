import React from 'react';

export const AppRoutesSSR = [
  {
    path: '/activities',
    element: <div>activities</div>,
  },
  {
    path: '/groups',
    element: <div>groups</div>,
  },
  {
    path: '/works',
    element: <div>works</div>,
  },
  {
    path: '/resources',
    element: <div>resources</div>,
  },
  {
    path: '/calendar',
    element: <div>calendar</div>,
  },
  {
    path: '/members',
    element: <div>members</div>,
  },
  {
    path: '/activity/:activityId/*',
    element: <div>activity</div>,
  },
  {
    path: '/group/:groupId/*',
    element: <div>group</div>,
  },
  {
    path: '/@/:username/work/:workId/*',
    element: <div>work</div>,
  },
  {
    path: '/resource/:resourceId/*',
    element: <div>resource</div>,
  },
  {
    path: '/pages/:pageTitle',
    element: <div>page</div>,
  },
  {
    path: '/@/:username',
    element: <div>user</div>,
  },
];
