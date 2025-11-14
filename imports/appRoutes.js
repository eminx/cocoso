import { Meteor } from 'meteor/meteor';
import React from 'react';
import loadable from '@loadable/component';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import HomeHandler from '/imports/HomeHandler';
import { Loader, Skeleton } from '/imports/ui/core';

// Keep main public listing and entry pages eager for SSR compatibility
import ActivityListHandler from '/imports/ui/pages/activities/ActivityListHandler';
import GroupListHandler from '/imports/ui/pages/groups/GroupListHandler';
import ResourceListHandler from '/imports/ui/pages/resources/ResourceListHandler';
import WorkListHandler from '/imports/ui/pages/works/WorkListHandler';
import UserListHandler from '/imports/ui/pages/profile/UserListHandler';

// Entry/detail pages - keep eager for SSR
import ActivityItemHandler from '/imports/ui/pages/activities/ActivityItemHandler';
import GroupItemHandler from '/imports/ui/pages/groups/GroupItemHandler';
import ResourceItemHandler from '/imports/ui/pages/resources/ResourceItemHandler';
import WorkItemHandler from '/imports/ui/pages/works/WorkItemHandler';
import PageItemHandler from '/imports/ui/pages/pages/PageItemHandler';
import UserProfileHandler from '/imports/ui/pages/profile/UserProfileHandler';
import ComposablePageHandler from '/imports/ui/pages/composablepages/ComposablePageHandler';

import CalendarHandler from '/imports/ui/pages/calendar/CalendarHandler';

const CommunityListHandler = loadable(() =>
  import('/imports/ui/pages/hosts/CommunityListHandler')
);

const LoginPage = loadable(() => import('/imports/ui/pages/auth/LoginPage'));
const SignupPage = loadable(() => import('/imports/ui/pages/auth/SignupPage'));
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
const ActivitiesAdmin = loadable(() =>
  import('./ui/pages/admin/listing/ActivitiesAdmin')
);
const CalendarAdmin = loadable(() =>
  import('./ui/pages/admin/listing/CalendarAdmin')
);
const GroupsAdmin = loadable(() =>
  import('./ui/pages/admin/listing/GroupsAdmin')
);
const PagesAdmin = loadable(() =>
  import('./ui/pages/admin/listing/PagesAdmin')
);
const PeopleAdmin = loadable(() =>
  import('./ui/pages/admin/listing/PeopleAdmin')
);
const ResourcesAdmin = loadable(() =>
  import('./ui/pages/admin/listing/ResourcesAdmin')
);
const WorksAdmin = loadable(() =>
  import('./ui/pages/admin/listing/WorksAdmin')
);
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
const RegistrationIntro = loadable(() =>
  import('/imports/ui/pages/auth/RegistrationIntro')
);
const SetupHome = loadable(() => import('/imports/ui/pages/setup'));
const NewHost = loadable(() => import('/imports/ui/pages/setup/NewHost'));

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

const listingFeatures = [
  'activities',
  'calendar',
  'groups',
  'info',
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
const createRouteElement = (Component, props) => {
  return (
    <RouteErrorBoundary>
      <Component {...props} />
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
    path: 'listing',
    children: [
      {
        path: 'activities/*',
        element: createRouteElement(ActivitiesAdmin, props),
      },
      {
        path: 'calendar/*',
        element: createRouteElement(CalendarAdmin, props),
      },
      {
        path: 'groups/*',
        element: createRouteElement(GroupsAdmin, props),
      },
      {
        path: 'info/*',
        element: createRouteElement(PagesAdmin, props),
      },
      {
        path: 'people/*',
        element: createRouteElement(PeopleAdmin, props),
      },
      {
        path: 'resources/*',
        element: createRouteElement(ResourcesAdmin, props),
      },
      {
        path: 'works/*',
        element: createRouteElement(WorksAdmin, props),
      },
    ],
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
      element: createRouteElement(WrapperHybrid, props),
      children: [
        {
          path: '',
          element: createRouteElement(HomeHandler, props),
          loader: async ({ params, request }) =>
            await getHomeLoader({ Host, params, request }),
        },
        {
          path: 'activities',
          children: [
            {
              index: true,
              element: createRouteElement(ActivityListHandler, props),
              loader: async ({ request }) =>
                await getActivities({ request, host, isPortalHost }),
            },
            {
              path: ':activityId',
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
              element: createRouteElement(GroupListHandler, props),
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
              element: createRouteElement(CalendarHandler, props),
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
              element: createRouteElement(PageItemHandler, props),
              loader: async () => await getPages({ host }),
            },
          ],
        },
        {
          path: 'people',
          element: createRouteElement(UserListHandler, props),
          loader: async () => await getPeople({ host, isPortalHost }),
        },
        {
          path: 'resources',
          children: [
            {
              index: true,
              element: createRouteElement(ResourceListHandler, props),
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
              element: createRouteElement(WorkListHandler, props),
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
              element: createRouteElement(MemberWorks, props),
              loader: async ({ params }) =>
                await getWorksByUser({ params, host }),
            },
          ],
        },
        {
          path: ':usernameSlug/works/:workId/*',
          element: createRouteElement(WorkItemHandler, props),
          loader: async ({ params }) => await getWork({ params }),
        },
        {
          path: 'cp/:composablePageId',
          element: createRouteElement(ComposablePageHandler, props),
          loader: async ({ params }) =>
            await getComposablePage({ params, Host }),
        },
        {
          path: 'communities',
          element: createRouteElement(CommunityListHandler, props),
          loader: async () => getCommunities(),
        },
        {
          path: 'intro',
          element: createRouteElement(RegistrationIntro, props),
        },
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
        {
          path: '*',
          element: createRouteElement(NotFoundPage, props),
        },
      ],
    },
  ];
}
