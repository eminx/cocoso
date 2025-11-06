import { Meteor } from 'meteor/meteor';
import React from 'react';

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
// import NewHost from '/imports/ui/pages/hosts/NewHost';
// import SetupHome from '/imports/ui/pages/setup';
// import getAdminRoutes from '/imports/ui/pages/admin/getAdminRoutes';

import AdminContainer from '/imports/ui/pages/admin/AdminContainer';
import AdminHome from '/imports/ui/pages/admin/AdminHome';
import AdminSettings from '/imports/ui/pages/admin/AdminSettings';
import AdminSettingsLogo from '/imports/ui/pages/admin/AdminSettingsLogo';
import AdminSettingsForm from '/imports/ui/pages/admin/AdminSettingsForm';
import AdminSettingsFooter from '/imports/ui/pages/admin/AdminSettingsFooter';
import MenuSettings from '/imports/ui/pages/admin/MenuSettings';
import MenuSettingsOrder from '/imports/ui/pages/admin/MenuSettingsOrder';
import MenuSettingsOptions from '/imports/ui/pages/admin/MenuSettingsOptions';
import AdminDesign from '/imports/ui/pages/admin/design';
import ThemeHandler from '/imports/ui/pages/admin/design/ThemeHandler';
import MenuDesign from '/imports/ui/pages/admin/design/MenuDesign';
import Members from '/imports/ui/pages/admin/Members';
import Emails from '/imports/ui/pages/admin/Emails';
import EmailNewsletter from '/imports/ui/pages/admin/EmailNewsletter';
import ComposablePages from '/imports/ui/pages/composablepages';
import ComposablePageForm from '/imports/ui/pages/composablepages/ComposablePageForm';
import FeatureAdminWrapper from '/imports/ui/pages/admin/features/_FeatureAdminWrapper';
import MainFeatureSettings from '/imports/ui/pages/admin/features/MainFeatureSettings';
import FeaturesWrapper from '/imports/ui/pages/admin/features/FeaturesWrapper';
import { call } from '/imports/ui/utils/shared';
import Redirector from '/imports/ui/generic/Redirector';

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
  getHostMembersForAdmin,
  getEmails,
  getComposablePageTitles,
} from './loaders';

import { updateHostSettings } from './actions';

const features = [
  'activities',
  'calendar',
  'groups',
  'pages',
  'people',
  'resources',
  'works',
];

const getAdminRoutes = (props) => [
  {
    path: 'home',
    element: <AdminHome {...props} />,
  },
  {
    path: 'settings',
    children: [
      {
        path: 'organization',
        element: <AdminSettings {...props} />,
        children: [
          { path: 'logo', element: <AdminSettingsLogo {...props} /> },
          {
            path: 'info',
            element: <AdminSettingsForm {...props} />,
          },
          {
            path: 'footer',
            element: <AdminSettingsFooter {...props} />,
          },
        ],
      },
      {
        path: 'design',
        element: <AdminDesign {...props} />,
        children: [
          {
            path: 'theme',
            element: <ThemeHandler {...props} />,
          },
          {
            path: 'navigation',
            element: <MenuDesign {...props} />,
          },
        ],
      },
      {
        path: 'menu',
        element: <MenuSettings {...props} />,
        children: [
          {
            path: 'order',
            element: <MenuSettingsOrder {...props} />,
          },
          {
            path: 'options',
            element: <MenuSettingsOptions {...props} />,
          },
        ],
      },
    ],
  },
  {
    path: 'composable-pages',
    children: [
      {
        index: true,
        element: <ComposablePages {...props} />,
        loader: async () => await getComposablePageTitles(),
      },
      {
        path: ':composablePageId',
        element: <ComposablePageForm {...props} />,
        loader: async ({ params }) => await getComposablePage({ params }),
      },
    ],
  },
  {
    path: 'features',
    // element: <FeaturesWrapper {...props} />,
    children: features.map((feature) => ({
      path: feature,
      element: <FeatureAdminWrapper {...props} />,
      children: [
        {
          path: 'menu',
          element: <MainFeatureSettings feature={feature} {...props} />,
        },
      ],
    })),
  },
  {
    path: 'users',
    element: <Members {...props} />,
    loader: async () => await getHostMembersForAdmin(),
  },
  {
    path: 'emails',
    element: <Emails {...props} />,
    loader: async () => await getEmails(),
  },
  {
    path: 'email-newsletter',
    element: <EmailNewsletter {...props} />,
  },
];

export default function appRoutes(props) {
  const Host = props?.Host;
  const host = Host?.host;
  const isPortalHost = Boolean(Host?.isPortalHost);

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
          path: '/admin',
          element: <AdminContainer {...props} />,
          children: Meteor.isServer ? null : [...getAdminRoutes(props)],
        },
        {
          path: 'not-found',
          element: <NotFoundPage {...props} />,
        },
        {
          path: '404',
          element: <NotFoundPage {...props} />,
        },
        // {
        //   path: '*',
        //   element: <NotFoundPage {...props} />,
        // },
      ],
    },
  ];
}
