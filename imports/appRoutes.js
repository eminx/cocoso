import { Meteor } from 'meteor/meteor';
import React, { Suspense } from 'react';
import loadable from '@loadable/component';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import { Loader } from '/imports/ui/core';
import HomeHandler from '/imports/HomeHandler';
import ActivityListHandler from '/imports/ui/pages/activities/ActivityListHandler';
import GroupListHandler from '/imports/ui/pages/groups/GroupListHandler';
import ResourceListHandler from '/imports/ui/pages/resources/ResourceListHandler';
import WorkListHandler from '/imports/ui/pages/works/WorkListHandler';
import UserListHandler from '/imports/ui/pages/profile/UserListHandler';
import CommunityListHandler from '/imports/ui/pages/hosts/CommunityListHandler';
import ComposablePageHandler from '/imports/ui/pages/composablepages/ComposablePageHandler';
import CalendarHandler from '/imports/ui/pages/calendar/CalendarHandler';

const ActivityItemHandler = loadable(() =>
  import('/imports/ui/pages/activities/ActivityItemHandler')
);
const GroupItemHandler = loadable(() =>
  import('/imports/ui/pages/groups/GroupItemHandler')
);
const ResourceItemHandler = loadable(() =>
  import('/imports/ui/pages/resources/ResourceItemHandler')
);
const WorkItemHandler = loadable(() =>
  import('/imports/ui/pages/works/WorkItemHandler')
);
const PageItemHandler = loadable(() =>
  import('/imports/ui/pages/pages/PageItemHandler')
);
const UserProfileHandler = loadable(() =>
  import('/imports/ui/pages/profile/UserProfileHandler')
);
const LoginPage = loadable(() => import('/imports/ui/pages/auth/LoginPage'));
const SignupPage = loadable(() => import('/imports/ui/pagesh/SignupPage'));
const ForgotPasswordPage = loadable(() =>
  import('/imports/ui/pages/auth/ForgotPasswordPage')
);
const ResetPasswordPage = loadable(() =>
  import('/imports/ui/pages/auth/ResetPasswordPage')
);
const Terms = loadable(() => import('/imports/ui/entry/Terms'));
const NotFoundPage = loadable(() => import('/imports/ui/pages/NotFoundPage'));

const AdminContainer = loadable(() =>
  import('/imports/ui/pages/admin/AdminContainer')
);
const AdminHome = loadable(() => import('/imports/ui/pages/admin/AdminHome'));
const AdminSettings = loadable(() =>
  import('/imports/ui/pages/admin/AdminSettings')
);
const AdminSettingsLogo = loadable(() =>
  import('/imports/ui/pages/admin/AdminSettingsLogo')
);
const AdminSettingsForm = loadable(() =>
  import('/imports/ui/pages/admin/AdminSettingsForm')
);
const AdminSettingsFooter = loadable(() =>
  import('/imports/ui/pages/admin/AdminSettingsFooter')
);
const MenuSettings = loadable(() =>
  import('/imports/ui/pages/admin/MenuSettings')
);
const MenuSettingsOrder = loadable(() =>
  import('/imports/ui/pages/admin/MenuSettingsOrder')
);
const MenuSettingsOptions = loadable(() =>
  import('/imports/ui/pages/admin/MenuSettingsOptions')
);
const AdminDesign = loadable(() => import('/imports/ui/pages/admin/design'));
const ThemeHandler = loadable(() =>
  import('/imports/ui/pages/admin/design/ThemeHandler')
);
const MenuDesign = loadable(() =>
  import('/imports/ui/pages/admin/design/MenuDesign')
);
const Members = loadable(() => import('/imports/ui/pages/admin/Members'));
const Emails = loadable(() => import('/imports/ui/pages/admin/Emails'));
const EmailNewsletter = loadable(() =>
  import('/imports/ui/pages/admin/EmailNewsletter')
);
const ComposablePages = loadable(() =>
  import('/imports/ui/pages/composablepages')
);
const ComposablePageForm = loadable(() =>
  import('/imports/ui/pages/composablepages/ComposablePageForm')
);
const FeatureAdminWrapper = loadable(() =>
  import('/imports/ui/pages/admin/features/_FeatureAdminWrapper')
);
const MainFeatureSettings = loadable(() =>
  import('/imports/ui/pages/admin/features/MainFeatureSettings')
);
const FeaturesWrapper = loadable(() =>
  import('/imports/ui/pages/admin/features/FeaturesWrapper')
);
const Redirector = loadable(() => import('/imports/ui/generic/Redirector'));
const EditProfile = loadable(() =>
  import('/imports/ui/pages/profile/EditProfile')
);
const EditProfileGeneral = loadable(() =>
  import('/imports/ui/pages/profile/EditProfileGeneral')
);
const EditProfileLanguage = loadable(() =>
  import('/imports/ui/pages/profile/EditProfileLanguage')
);
const EditProfilePrivacy = loadable(() =>
  import('/imports/ui/pages/profile/EditProfilePrivacy')
);
const MemberActivities = loadable(() =>
  import('/imports/ui/pages/activities/MemberActivities')
);
const MemberGroups = loadable(() =>
  import('/imports/ui/pages/groups/MemberGroups')
);
const MemberWorks = loadable(() =>
  import('/imports/ui/pages/works/MemberWorks')
);

// import NewHost from '/imports/ui/pages/hosts/NewHost';
// import SetupHome from '/imports/ui/pages/setup';
// import getAdminRoutes from '/imports/ui/pages/admin/getAdminRoutes';
// import RegistrationIntro from '/imports/ui/pages/auth/RegistrationIntro';

import { call } from '/imports/api/_utils/shared';
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
  getActivitiesByUser,
  getGroupsByUser,
  getWorksByUser,
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

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Route loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong while loading this page.</h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Use it in your route wrapper
const createRouteElement = (Component, props, skipSuspense = true) => {
  if (props.skipSuspense) {
    return (
      <RouteErrorBoundary>
        <Component {...props} />
      </RouteErrorBoundary>
    );
  }
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<Loader />}>
        <Component {...props} />
      </Suspense>
    </RouteErrorBoundary>
  );
};

const getAdminRoutes = (props) => [
  {
    path: 'home',
    element: createRouteElement(AdminHome, props),
  },
  {
    path: 'my-profile',
    element: createRouteElement(EditProfile, props),
    children: [
      {
        path: 'general',
        element: createRouteElement(EditProfileGeneral, props),
      },
      {
        path: 'language',
        element: createRouteElement(EditProfileLanguage, props),
      },
      {
        path: 'privacy',
        element: createRouteElement(EditProfilePrivacy, props),
      },
    ],
  },
  {
    path: 'settings',
    children: [
      {
        path: 'organization',
        element: createRouteElement(AdminSettings, props),
        children: [
          {
            path: 'logo',
            element: createRouteElement(AdminSettingsLogo, props),
          },
          {
            path: 'info',
            element: createRouteElement(AdminSettingsForm, props),
          },
          {
            path: 'footer',
            element: createRouteElement(AdminSettingsFooter, props),
          },
        ],
      },
      {
        path: 'design',
        element: createRouteElement(AdminDesign, props),
        children: [
          {
            path: 'theme',
            element: createRouteElement(ThemeHandler, props),
          },
          {
            path: 'navigation',
            element: createRouteElement(MenuDesign, props),
          },
        ],
      },
      {
        path: 'menu',
        element: createRouteElement(MenuSettings, props),
        children: [
          {
            path: 'order',
            element: createRouteElement(MenuSettingsOrder, props),
          },
          {
            path: 'options',
            element: createRouteElement(MenuSettingsOptions, props),
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
        element: createRouteElement(ComposablePages, props),
        loader: async () => await getComposablePageTitles(),
      },
      {
        path: ':composablePageId',
        element: createRouteElement(ComposablePageForm, props),
        loader: async ({ params }) => await getComposablePage({ params }),
      },
    ],
  },
  {
    path: 'features',
    // element: createRouteElement(FeaturesWrapper, props),
    children: features.map((feature) => ({
      path: feature,
      children: [
        {
          index: true,
          element: createRouteElement(FeatureAdminWrapper, props),
        },
        {
          path: 'menu',
          element: createRouteElement(MainFeatureSettings, {
            ...props,
            feature,
          }),
        },
      ],
    })),
  },
  {
    path: 'users',
    element: createRouteElement(Members, props),
    loader: async () => await getHostMembersForAdmin(),
  },
  {
    path: 'emails',
    element: createRouteElement(Emails, props),
    loader: async () => await getEmails(),
  },
  {
    path: 'email-newsletter',
    element: createRouteElement(EmailNewsletter, props),
  },
];

export default function appRoutes(props) {
  const Host = props?.Host;
  const host = Host?.host;
  const isPortalHost = Boolean(Host?.isPortalHost);

  return [
    {
      element: createRouteElement(WrapperHybrid, props, true),
      children: [
        {
          path: '',
          element: createRouteElement(HomeHandler, props, true),
          loader: async ({ params, request }) =>
            await getHomeLoader({ Host, params, request }),
        },
        {
          path: 'activities',
          children: [
            {
              index: true,
              element: createRouteElement(ActivityListHandler, props, true),
              loader: async ({ request }) =>
                await getActivities({ request, host, isPortalHost }),
            },
            {
              path: ':activityId/*',
              element: createRouteElement(ActivityItemHandler, props),
              loader: async ({ params }) => await getActivity({ params }),
            },
          ],
        },
        {
          path: 'groups',
          children: [
            {
              index: true,
              element: createRouteElement(GroupListHandler, props, true),
              loader: async () => await getGroups({ host, isPortalHost }),
            },
            {
              path: ':groupId/*',
              index: true,
              element: createRouteElement(GroupItemHandler, props),
              loader: async ({ params }) => await getGroup({ params }),
            },
          ],
        },
        {
          path: 'calendar',
          children: [
            {
              index: true,
              element: createRouteElement(CalendarHandler, props, true),
              loader: async ({ request }) =>
                await getCalendarEntries({ host, isPortalHost }),
            },
            {
              path: ':activityId/*',
              element: createRouteElement(ActivityItemHandler, props),
              loader: async ({ params }) => await getActivity({ params }),
            },
          ],
        },
        {
          path: 'info',
          children: [
            {
              path: ':pageTitle',
              element: createRouteElement(PageItemHandler, props, true),
              loader: async () => await getPages({ host }),
            },
          ],
        },
        {
          path: 'people',
          element: createRouteElement(UserListHandler, props, true),
          loader: async () => await getPeople({ host, isPortalHost }),
        },
        {
          path: 'resources',
          children: [
            {
              index: true,
              element: createRouteElement(ResourceListHandler, props, true),
              loader: async () => await getResources({ host, isPortalHost }),
            },
            {
              path: ':resourceId/*',
              index: true,
              element: createRouteElement(ResourceItemHandler, props),
              loader: async ({ params }) => await getResource({ params }),
            },
          ],
        },
        {
          path: 'works',
          children: [
            {
              index: true,
              element: createRouteElement(WorkListHandler, props, true),
              loader: async () => await getWorks({ host, isPortalHost }),
            },
          ],
        },
        {
          path: ':usernameSlug',
          element: createRouteElement(UserProfileHandler, props),
          loader: async ({ params }) => await getUser({ params, host }),
          children: [
            {
              path: 'activities',
              element: createRouteElement(MemberActivities, props),
              loader: async ({ params }) =>
                await getActivitiesByUser({ params, host }),
            },
            {
              path: 'groups',
              element: createRouteElement(MemberGroups, props),
              loader: async ({ params }) =>
                await getGroupsByUser({ params, host }),
            },
            {
              path: 'works',
              children: [
                {
                  index: true,
                  element: createRouteElement(MemberWorks, props),
                  loader: async ({ params }) =>
                    await getWorksByUser({ params, host }),
                },
                {
                  path: ':workId/*',
                  element: createRouteElement(WorkItemHandler, props),
                  loader: async ({ params }) => await getWork({ params }),
                },
              ],
            },
          ],
        },
        {
          path: 'cp/:composablePageId',
          element: createRouteElement(ComposablePageHandler, props, true),
          loader: async ({ params }) =>
            await getComposablePage({ params, Host }),
        },
        {
          path: 'communities',
          element: createRouteElement(CommunityListHandler, props, true),
          loader: async () => getCommunities(),
        },
        // {
        //   path: 'intro',
        //   element: createRouteElement(RegistrationIntro, props,true),
        // },
        {
          path: 'login',
          element: createRouteElement(LoginPage, props),
        },
        {
          path: 'register',
          element: createRouteElement(SignupPage, props),
        },
        {
          path: 'forgot-password',
          element: createRouteElement(ForgotPasswordPage, props),
        },
        {
          path: 'reset-password/*',
          element: createRouteElement(ResetPasswordPage, props),
        },
        // {
        //   path: '/setup',
        //   element: createRouteElement(SetupHome, props),
        // },
        // {
        //   path: '/new-host',
        //   element: createRouteElement(NewHost, props),
        // },
        {
          path: 'terms-&-privacy-policy',
          element: createRouteElement(Terms, props),
        },
        {
          path: 'admin',
          element: createRouteElement(AdminContainer, props),
          children: Meteor.isServer ? null : [...getAdminRoutes(props)],
        },
        {
          path: 'not-found',
          element: createRouteElement(NotFoundPage, props),
        },
        {
          path: '404',
          element: createRouteElement(NotFoundPage, props),
        },
        // {
        //   path: '*',
        //   element: createRouteElement(NotFoundPage, props),
        // },
      ],
    },
  ];
}
