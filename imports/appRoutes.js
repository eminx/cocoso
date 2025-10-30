import React, { useState, useEffect } from 'react';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import HomeHandler from '/imports/HomeHandler';
import ActivityListHandler from '/imports/ui/pages/activities/ActivityListHandler';
import ActivityItemHandler from '/imports/ui/pages/activities/ActivityItemHandler';
import GroupListHandler from '/imports/ui/pages/groups/GroupListHandler';
import GroupItemHandler from '/imports/ui/pages/groups/GroupItemHandler';
import ResourceListHandler from '/imports/ui/pages/resources/ResourceListHandler';
import ResourceItemHandler from '/imports/ui/pages/resources/ResourceItemHandler';
import WorkListHandler from '/imports/ui/pages/works/WorkListHandler';
import WorkItemHandler from '/imports/ui/pages/works/WorkItemHandler';
import PageItemHandler from '/imports/ui/pages/pages/PageItemHandler';
import UserListHandler from '/imports/ui/pages/profile/UserListHandler';
import CalendarHandler from '/imports/ui/pages/calendar/CalendarHandler';
import UserProfileHandler from '/imports/ui/pages/profile/UserProfileHandler';
import ComposablePageHandler from '/imports/ui/pages/composablepages/ComposablePageHandler';
import CommunityListHandler from '/imports/ui/pages/hosts/CommunityListHandler';

import LoginPage from '/imports/ui/pages/auth/LoginPage';
import SignupPage from '/imports/ui/pages/auth/SignupPage';
import ForgotPasswordPage from '/imports/ui/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '/imports/ui/pages/auth/ResetPasswordPage';
// import RegistrationIntro from '/imports/ui/pages/auth/RegistrationIntro';
import Terms from '/imports/ui/entry/Terms';
import NotFoundPage from '/imports/ui/pages/NotFoundPage';
// import AdminContainer from '/imports/ui/pages/admin/AdminContainer';
// import NewHost from '/imports/ui/pages/hosts/NewHost';
// import SetupHome from '/imports/ui/pages/setup';

import {
  getHomeLoader,
  getActivities,
  getActivity,
  getCalendarEntries,
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

export default function appRoutes(props) {
  const Host = props?.Host;
  const host = Host?.host;
  const isPortalHost = Boolean(Host?.isPortalHost);

  // const adminRoutes = getAdminRoutes(Host?.settings?.menu);

  return [
    {
      element: <WrapperHybrid {...props} />,
      children: [
        {
          path: '',
          element: <HomeHandler {...props} />,
          loader: async ({ params, request }) =>
            await getHomeLoader({ Host, params, request }),
        },
        {
          path: 'activities',
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
          path: 'groups',
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
          path: 'calendar',
          element: <CalendarHandler {...props} />,
          loader: async ({ request }) =>
            await getCalendarEntries({ host, isPortalHost }),
        },
        {
          path: 'info',
          children: [
            {
              path: ':pageTitle',
              element: <PageItemHandler {...props} />,
              loader: async () => await getPages({ host }),
            },
          ],
        },
        {
          path: 'people',
          element: <UserListHandler {...props} />,
          loader: async () => await getPeople({ host, isPortalHost }),
        },
        {
          path: 'resources',
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
          path: 'works',
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
              element: <UserProfileHandler {...props} />,
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
          path: 'cp/:composablePageId',
          element: <ComposablePageHandler {...props} />,
          loader: async ({ params }) => await getComposablePage({ params }),
        },
        {
          path: 'communities',
          element: <CommunityListHandler {...props} />,
          loader: async () => getCommunities(),
        },
        // {
        //   path: 'intro',
        //   element: <RegistrationIntro {...props} />,
        // },
        {
          path: 'login',
          element: <LoginPage {...props} />,
        },
        {
          path: 'register',
          element: <SignupPage {...props} />,
        },
        {
          path: 'forgot-password',
          element: <ForgotPasswordPage {...props} />,
        },
        {
          path: 'reset-password/*',
          element: <ResetPasswordPage {...props} />,
        },
        // {
        //   path: '/setup',
        //   element: <SetupHome {...props} />,
        // },
        // {
        //   path: '/new-host',
        //   element: <NewHost {...props} />,
        // },
        {
          path: 'terms-&-privacy-policy',
          element: <Terms {...props} />,
        },
        {
          path: 'not-found',
          element: <NotFoundPage {...props} />,
        },
        {
          path: '404',
          element: <NotFoundPage {...props} />,
        },
        {
          path: '*',
          element: <NotFoundPage {...props} />,
        },
        // {
        //   path: '/admin',
        //   element: <AdminContainer {...props} />,
        //   children: [...adminRoutes],
        // },
      ],
    },
  ];
}
