import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';

import LayoutContainer, { StateContext } from '../LayoutContainer';
import Terms from '../entry/Terms';
// import Loader from '../generic/Loader';

import Communities from '../pages/hosts/Communities';

// Activities
import Activities from './activities/Activities';
import Activity from './activities/Activity';

// Groups
import Groups from './groups/Groups';
import Group from './groups/Group';

// Resources
import Resources from './resources/Resources';
import Resource from './resources/Resource';

// Calendar
import Calendar from './calendar/Calendar';

// Works
import Works from './works/Works';

// Profile
import UserProfile from './profile/UserProfile';
import EditProfile from './profile/EditProfile';
import Work from './works/Work';

// Pages
import Page from './pages/Page';

// Users
import Users from './profile/Users';

// Admin
import AdminContainer from './admin/AdminContainer';
import PreviousNewsletters from './admin/EmailNewsletter/PreviousNewsletters';

// Super admin
import PlatformSettings from './admin/PlatformSettings';
import PlatformRegistrationIntro from './admin/PlatformRegistrationIntro';

// Auth
import SignupPage from './auth/SignupPage';
import LoginPage from './auth/LoginPage';
import ForgotPasswordPage from './auth/ForgotPasswordPage';
import ResetPasswordPage from './auth/ResetPasswordPage';
import RegistrationIntro from './auth/RegistrationIntro';

// SuperAdmin
import NewHost from './hosts/NewHost';

// NotFound
import NotFoundPage from './NotFoundPage';
import MyActivities from './activities/MyActivities';

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
      {/* <Suspense fallback={<Loader relative={false} />}> */}
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
      {/* </Suspense> */}
    </LayoutContainer>
  );
}
