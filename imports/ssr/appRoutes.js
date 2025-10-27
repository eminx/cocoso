import React from 'react';

import { call } from '/imports/ui/utils/shared';
import { Loader } from '/imports/ui/core';
import NotFoundPage from '/imports/ui/pages/NotFoundPage';

import {
  getHomeLoader,
  getActivities,
  getActivity,
  getComposablePage,
  getCommunities,
  getGroup,
  getGroups,
  getPages,
  getPeople,
  getResources,
  getResource,
  getUser,
  getWorks,
  getWork,
} from './loaders';
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

export default function appRoutes(props) {
  const Host = props?.Host;
  const host = Host?.host;
  const isPortalHost = Boolean(Host?.isPortalHost);

  return [
    {
      path: '/',
      element: <Home {...props} />,
      loader: async ({ params, request }) =>
        await getHomeLoader({ Host, params, request }),
    },
    {
      path: '/activities',
      children: [
        {
          index: true,
          element: <ActivityList {...props} />,
          loader: async ({ request }) =>
            await getActivities({ request, host, isPortalHost }),
        },
        {
          path: ':activityId/*',
          element: <Activity {...props} />,
          loader: async ({ params }) => {
            const activityId = params.activityId;
            return await getActivity({ activityId });
          },
        },
      ],
    },
    {
      path: '/groups',
      children: [
        {
          index: true,
          element: <GroupList {...props} />,
          loader: async () => await getGroups({ host, isPortalHost }),
        },
        {
          path: ':groupId/*',
          index: true,
          element: <Group {...props} />,
          loader: async ({ params }) => {
            const groupId = params?.groupId;
            return await getGroup({ groupId });
          },
        },
      ],
    },
    {
      path: '/info',
      children: [
        {
          path: ':pageTitle',
          element: <Page {...props} />,
          loader: async () => await getPages({ host }),
        },
      ],
    },
    {
      path: '/people',
      element: <UserList {...props} />,
      loader: async () => await getPeople({ host, isPortalHost }),
    },
    {
      path: '/resources',
      children: [
        {
          index: true,
          element: <ResourceList {...props} />,
          loader: async () => await getResources({ host, isPortalHost }),
        },
        {
          path: ':resourceId/*',
          index: true,
          element: <Resource {...props} />,
          loader: async ({ params }) => {
            const resourceId = params?.resourceId;
            return await getResource({ resourceId, host, isPortalHost });
          },
        },
      ],
    },
    {
      path: '/works',
      children: [
        {
          index: true,
          element: <WorkList {...props} />,
          loader: async () => await getWorks({ host, isPortalHost }),
        },
      ],
    },
    {
      path: ':usernameSlug',
      children: [
        {
          index: true,
          path: '*',
          element: <User {...props} />,
          loader: async ({ params }) => await getUser({ params, host }),
        },
        {
          path: 'works',
          children: [
            {
              path: ':workId/*',
              element: <Work {...props} />,
              loader: async ({ params }) => {
                return await getWork({ params });
              },
            },
          ],
        },
      ],
    },
    {
      path: '/cp/:composablePageId',
      element: <ComposablePage {...props} />,
      loader: async ({ params }) => await getComposablePage({ params }),
    },
    {
      path: '/communities',
      element: <Communities {...props} />,
      loader: async () => getCommunities(),
    },
    {
      path: '/*',
      element: <NotFoundPage />,
      loader: async () => {
        return {};
      },
    },
  ];
}
