import React, { lazy, Suspense, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';

import LayoutContainer, { StateContext } from '../LayoutContainer';
import Terms from '../entry/Terms';
import Loader from '../generic/Loader';

const Communities = lazy(() => import('../pages/hosts/Communities'));

// Activities
const Activities = lazy(() => import('./activities/Activities'));
const Activity = lazy(() => import('./activities/Activity'));

// Groups
const Groups = lazy(() => import('./groups/Groups'));
const Group = lazy(() => import('./groups/Group'));

// Resources
const Resources = lazy(() => import('./resources/Resources'));
const Resource = lazy(() => import('./resources/Resource'));

// Calendar
const Calendar = lazy(() => import('./calendar/Calendar'));

// Works
const Works = lazy(() => import('./works/Works'));
const Work = lazy(() => import('./works/Work'));

// Users
const Users = lazy(() => import('./profile/Users'));
const UserProfile = lazy(() => import('./profile/UserProfile'));

// Pages
const Page = lazy(() => import('./pages/Page'));

// Auth
const SignupPage = lazy(() => import('./auth/SignupPage'));
const LoginPage = lazy(() => import('./auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./auth/ResetPasswordPage'));
const RegistrationIntro = lazy(() => import('./auth/RegistrationIntro'));

// Admin
const EditProfile = lazy(() => import('./profile/EditProfile'));
const AdminContainer = lazy(() => import('./admin/AdminContainer'));
const PreviousNewsletters = lazy(() => import('./admin/EmailNewsletter/PreviousNewsletters'));

// Super admin
const PlatformSettings = lazy(() => import('./admin/PlatformSettings'));
const PlatformRegistrationIntro = lazy(() => import('./admin/PlatformRegistrationIntro'));
// SuperAdmin
const NewHost = lazy(() => import('./hosts/NewHost'));

// NotFound
const NotFoundPage = lazy(() => import('./NotFoundPage'));
const MyActivities = lazy(() => import('./activities/MyActivities'));

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
    default:
      return <Users />;
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

          {/* Works */}
          <Route exact path="/works" element={<Works />} />

          {/* Communities: Only on Portal App */}
          <Route exact path="/communities" element={<Communities />} />

          {/* Newsletter Emails */}
          <Route path="/newsletters/*" element={<PreviousNewsletters />} />

          {/* Admin */}
          <Route path="/admin/*" element={<AdminContainer />} />

          {/* Super Admin */}
          <Route path="/superadmin/platform/settings/*" element={<PlatformSettings />} />
          <Route
            path="/superadmin/platform/registration-intro"
            element={<PlatformRegistrationIntro />}
          />

          {/* Profile & Profile Related Pages */}
          <Route path="/edit/*" element={<EditProfile />} />
          <Route path="/:usernameSlug/*" element={<UserProfile />} />
          <Route path="/:usernameSlug/works/:workId/*" element={<Work />} />

          {/* Auth */}
          <Route exact path="/register" element={<SignupPage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

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
