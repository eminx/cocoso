import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router';
import loadable from '@loadable/component';
import { useAtomValue } from 'jotai';

import state, { currentHostAtom } from '../../state';

import Loader from '/imports/ui/core/Loader';
import SetupHome from '/imports/ui/pages/setup';
const Terms = loadable(() => import('/imports/ui/entry/Terms'));

const ComposablePageView = loadable(() =>
  import('./composablepages/ComposablePageView')
);

const Communities = loadable(() => import('./hosts/Communities'));

// Activities
const Activities = loadable(() => import('./activities/ActivityListHandler'));
const Activity = loadable(() => import('./activities/ActivityItemHandler'));

// Groups
const Groups = loadable(() => import('./groups/GroupListHandler'));
const Group = loadable(() => import('./groups/Group'));

// Resources
const Resources = loadable(() => import('./resources/ResourceListHandler'));
const Resource = loadable(() => import('./resources/ResourceItemHandler'));

// Calendar
const Calendar = loadable(() => import('./calendar/Calendar'));

// Works
const Works = loadable(() => import('./works/WorkListHandler'));
const Work = loadable(() => import('./works/WorkItemHandler'));

// Users
const Users = loadable(() => import('./profile/Users'));
const UserProfile = loadable(() => import('./profile/UserProfile'));

// Pages
const Page = loadable(() => import('./pages/Page'));

// Auth
const SignupPage = loadable(() => import('./auth/SignupPage'));
const LoginPage = loadable(() => import('./auth/LoginPage'));
const ForgotPasswordPage = loadable(() => import('./auth/ForgotPasswordPage'));
const ResetPasswordPage = loadable(() => import('./auth/ResetPasswordPage'));
const RegistrationIntro = loadable(() => import('./auth/RegistrationIntro'));

// Admin
const AdminContainer = loadable(() => import('./admin/AdminContainer'));
const PreviousNewsletters = loadable(() =>
  import('./admin/EmailNewsletter/PreviousNewsletters')
);

// Super admin
const PlatformSettings = loadable(() => import('./admin/PlatformSettings'));
const PlatformRegistrationIntro = loadable(() =>
  import('./admin/PlatformRegistrationIntro')
);
// SuperAdmin
const NewHost = loadable(() => import('./hosts/NewHost'));

// NotFound
const NotFoundPage = loadable(() => import('./NotFoundPage'));
const MyActivities = loadable(() => import('./activities/MyActivities'));

function getComponentBasedOnFirstRoute(menuItems) {
  const visibleMenu = menuItems.filter((item) => item.isVisible);
  const firstRoute = visibleMenu && visibleMenu[0].name;

  switch (firstRoute) {
    case 'activities':
      return <Activities />;
    case 'groups':
      return <Groups />;
    case 'works':
      return <Works />;
    case 'resources':
      return <Resources />;
    case 'calendar':
      return <Calendar />;
    case 'info':
      return <Page />;
    case 'people':
      return <Users />;
    default:
      return <ComposablePageView />;
  }
}

function HomePage() {
  const currentHost = useAtomValue(currentHostAtom);
  const menu = currentHost?.settings?.menu;

  if (!menu || !menu[0]) {
    return null;
  }

  const Component = getComponentBasedOnFirstRoute(menu);
  return Component;
}

export default function BrowserRoutes() {
  return (
    // <state>
    //   <Suspense fallback={<Loader />}>
    //     <Routes>
    <Routes>
      <Route exact path="/" element={<HomePage />} />

      {/* Calendar */}
      <Route path="/calendar" element={<Calendar />} />

      <Route path="/calendar">
        <Route path=":activityId">
          <Route path="*" element={<Activity />} />
        </Route>
      </Route>

      <Route exact path="/my-activities" element={<MyActivities />} />

      {/* Newsletter Emails */}
      <Route path="/newsletters" element={<PreviousNewsletters />}>
        <Route path="*" element={<PreviousNewsletters />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/*" element={<AdminContainer />} />

      {/* Super Admin */}
      <Route
        path="/superadmin/platform/settings/*"
        element={<PlatformSettings />}
      />
      <Route
        path="/superadmin/platform/registration-intro"
        element={<PlatformRegistrationIntro />}
      />

      {/* Auth */}
      <Route exact path="/register" element={<SignupPage />} />
      <Route exact path="/login" element={<LoginPage />} />
      <Route exact path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="/reset-password">
        <Route path="*" element={<ResetPasswordPage />} />
      </Route>

      <Route path="/intro" element={<RegistrationIntro />} />

      {/* SuperAdmin */}
      <Route exact path="/new-host" element={<NewHost />} />
      <Route exact path="/setup" element={<SetupHome />} />

      <Route exact path="/terms-&-privacy-policy" element={<Terms />} />

      {/* NotFoundPage */}
      <Route exact path="/not-found" element={<NotFoundPage />} />
      <Route exact path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    //     </Routes>
    //   </Suspense>
    // </state>
  );
}
