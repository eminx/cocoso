import React, { Suspense, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import loadable from '@loadable/component';

import Terms from '/imports/ui/entry/Terms';
import Loader from '/imports/ui/core/Loader';

import LayoutContainer, { StateContext } from '../LayoutContainer';
import ComposablePageView from './composablepages/ComposablePageView';

const Communities = loadable(() => import('../pages/hosts/Communities'));

// Activities
const Activities = loadable(() => import('./activities/Activities'));
const Activity = loadable(() => import('./activities/Activity'));

// Groups
const Groups = loadable(() => import('./groups/Groups'));
const Group = loadable(() => import('./groups/Group'));

// Resources
const Resources = loadable(() => import('./resources/Resources'));
const Resource = loadable(() => import('./resources/Resource'));

// Calendar
const Calendar = loadable(() => import('./calendar/Calendar'));

// Works
const Works = loadable(() => import('./works/Works'));
const Work = loadable(() => import('./works/Work'));

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
  const { currentHost } = useContext(StateContext);
  const menu = currentHost && currentHost.settings && currentHost.settings.menu;

  if (!menu || !menu[0]) {
    return null;
  }

  const Component = getComponentBasedOnFirstRoute(menu);
  return Component;
}

export default function AppRoutes() {
  return (
    <LayoutContainer>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route exact path="/" element={<HomePage />} />

          {/* Members list public */}
          <Route path="/people" element={<Users />} />

          {/* Calendar */}
          <Route path="/calendar" element={<Calendar />} />

          {/* Activities */}
          <Route exact path="/activities" element={<Activities />} />
          <Route path="/activities/:activityId/*" element={<Activity />} />
          <Route path="/calendar/:activityId/*" element={<Activity />} />
          <Route exact path="/my-activities" element={<MyActivities />} />

          {/* Groups */}
          <Route exact path="/groups" element={<Groups />} />
          <Route path="/groups/:groupId/*" element={<Group />} />

          {/* Resources */}
          <Route exact path="/resources" element={<Resources />} />
          <Route path="/resources/:resourceId/*" element={<Resource />} />

          {/* Pages */}
          <Route exact path="/info" element={<Page />} />
          <Route path="/info/:pageTitle/*" element={<Page />} />
          <Route path="/pages/:pageTitle/*" element={<Page />} />
          <Route
            path="/cp/:composablePageId"
            element={<ComposablePageView />}
          />

          {/* Works */}
          <Route exact path="/works" element={<Works />} />

          {/* Communities: Only on Portal App */}
          <Route exact path="/communities" element={<Communities />} />

          {/* Newsletter Emails */}
          <Route path="/newsletters/*" element={<PreviousNewsletters />} />

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

          {/* Profile & Profile Related Pages */}
          <Route path="/:usernameSlug/*" element={<UserProfile />} />
          <Route path="/:usernameSlug/works/:workId/*" element={<Work />} />

          {/* Auth */}
          <Route exact path="/register" element={<SignupPage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route
            exact
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />

          <Route path="/intro" element={<RegistrationIntro />} />

          {/* SuperAdmin */}
          <Route exact path="/new-host" element={<NewHost />} />
          <Route exact path="/terms-&-privacy-policy" element={<Terms />} />

          {/* NotFoundPage */}
          <Route exact path="/not-found" element={<NotFoundPage />} />
          <Route exact path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </LayoutContainer>
  );
}
