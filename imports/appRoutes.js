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
  Communities,
  ComposablePage,
  Home,
  Page,
  UserList,
  User,
} from './ssr/components';

import ActivityListHandler from '/imports/ui/pages/activities/ActivityListHandler';
import ActivityItemHandler from '/imports/ui/pages/activities/ActivityItemHandler';
import GroupListHandler from '/imports/ui/pages/groups/GroupListHandler';
import GroupItemHandler from '/imports/ui/pages/groups/GroupItemHandler';
import ResourceListHandler from '/imports/ui/pages/resources/ResourceListHandler';
import ResourceItemHandler from '/imports/ui/pages/resources/ResourceItemHandler';
import WorkListHandler from '/imports/ui/pages/works/WorkListHandler';
import WorkItemHandler from '/imports/ui/pages/works/WorkItemHandler';

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
          element: <ActivityListHandler {...props} />,
          loader: async ({ request }) =>
            await getActivities({ request, host, isPortalHost }),
        },
        {
          path: ':activityId/*',
          element: <ActivityItemHandler {...props} />,
          loader: async ({ params }) => await getActivity({ params }),
        },
      ],
    },
    {
      path: '/groups',
      children: [
        {
          index: true,
          element: <GroupListHandler {...props} />,
          loader: async () => await getGroups({ host, isPortalHost }),
        },
        {
          path: ':groupId/*',
          index: true,
          element: <GroupItemHandler {...props} />,
          loader: async ({ params }) => await getGroup({ params }),
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
          element: <ResourceListHandler {...props} />,
          loader: async () => await getResources({ host, isPortalHost }),
        },
        {
          path: ':resourceId/*',
          index: true,
          element: <ResourceItemHandler {...props} />,
          loader: async ({ params }) => await getResource({ params }),
        },
      ],
    },
    {
      path: '/works',
      children: [
        {
          index: true,
          element: <WorkListHandler {...props} />,
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
              element: <WorkItemHandler {...props} />,
              loader: async ({ params }) => await getWork({ params }),
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
