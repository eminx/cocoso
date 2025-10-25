import React from 'react';

import { call } from '/imports/ui/utils/shared';
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

export default function appRoutes(props) {
  const Host = props?.Host;
  const host = Host?.host;
  const isPortalHost = Boolean(Host?.isPortalHost);
  const menu = Host?.settings?.menu;
  const homeRouteName = menu && menu[0]?.name;
  const homeRoute = `/${homeRouteName}`;

  return [
    {
      path: '/',
      element: <Home {...props} />,
      loader: async () => {
        return {};
      },
    },
    {
      path: '/activities',
      children: [
        {
          index: true,
          element: <ActivityList {...props} />,
          loader: async ({ request }) => {
            const url = new URL(request.url);
            const showPast =
              url.searchParams.get('showPast') === 'true' || false;

            let activities;
            if (isPortalHost) {
              activities = await call(
                'getAllPublicActivitiesFromAllHosts',
                showPast
              );
            } else {
              activities = await call('getAllPublicActivities', showPast, host);
            }

            return {
              activities,
              showPast,
            };
          },
        },
        {
          path: ':activityId/*',
          element: <Activity {...props} />,
          loader: async ({ params }) => {
            const activity = await call('getActivityById', params.activityId);
            return {
              activity,
            };
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
          loader: async () => {
            const groups = await call(
              'getGroupsWithMeetings',
              isPortalHost,
              host
            );
            return {
              groups,
            };
          },
        },
        {
          path: ':groupId/*',
          index: true,
          element: <Group {...props} />,
          loader: async ({ params }) => {
            const groupId = params?.groupId;
            const group = await call('getGroupWithMeetings', groupId);
            const documents = await call('getDocumentsByAttachments', groupId);

            return {
              documents,
              group,
            };
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
          loader: async ({}) => {
            const pages = await call('getPages', host);
            return {
              pages,
            };
          },
        },
      ],
    },
    {
      path: '/people',
      element: <UserList {...props} />,
      loader: async () => {
        const keywords = await call('getKeywords');
        let users;
        if (isPortalHost) {
          users = await call('getAllMembersFromAllHosts');
        } else {
          users = await call('getHostMembers', host);
        }
        return {
          keywords,
          users,
        };
      },
    },
    {
      path: '/resources',
      children: [
        {
          index: true,
          element: <ResourceList {...props} />,
          loader: async () => {
            let resources;
            if (isPortalHost) {
              resources = await call('getResourcesFromAllHosts');
            } else {
              resources = await call('getResources', host);
            }
            return {
              resources,
            };
          },
        },
        {
          path: ':resourceId/*',
          index: true,
          element: <Resource {...props} />,
          loader: async ({ params }) => {
            const resource = await call(
              'getResourceById',
              params.resourceId,
              host
            );
            const documents = await call(
              'getDocumentsByAttachments',
              params.resourceId
            );
            return {
              documents,
              resource,
            };
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
          loader: async () => {
            let works;
            if (isPortalHost) {
              works = await call('getAllWorksFromAllHosts');
            } else {
              works = await call('getAllWorks', host);
            }

            return {
              works,
            };
          },
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
          loader: async ({ params }) => {
            const username = params.usernameSlug.replace('@', '');
            const user = await call('getUserInfo', username, host);
            return {
              user,
            };
          },
        },
        {
          path: 'works',
          children: [
            {
              path: ':workId/*',
              index: true,
              element: <Work {...props} />,
              loader: async ({ params }) => {
                const workId = params?.workId;
                const username = params.usernameSlug.replace('@', '');
                const work = await call('getActivityById', workId, username);
                const documents = await call(
                  'getDocumentsByAttachments',
                  workId
                );
                return {
                  documents,
                  username,
                  work,
                };
              },
            },
          ],
        },
      ],
    },
    {
      path: '/cp/:composablePageId',
      element: <ComposablePage {...props} />,
      loader: async ({ params }) => {
        const composablePage = await call(
          'getComposablePageById',
          params.composablePageId
        );
        return {
          composablePage,
        };
      },
    },
    {
      path: '/communities',
      element: <Communities {...props} />,
      loader: async () => {
        const hosts = await call('getAllHosts');
        return {
          hosts,
        };
      },
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
