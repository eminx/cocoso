import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../Home';
import LayoutContainer from '../LayoutContainer';

import Terms from '../components/Terms';
import { ContentLoader } from '../components/SkeletonLoaders';

const Communities = lazy(() => import('../pages/hosts/Communities'));

// Activities
const Activities = lazy(() => import('./activities/Activities'));
const ActivityContainer = lazy(() => import('./activities/ActivityContainer'));
const EditActivityContainer = lazy(() => import('./activities/EditActivityContainer'));
const NewActivityContainer = lazy(() => import('./activities/NewActivityContainer'));

// Groups
const Groups = lazy(() => import('./groups/GroupList'));
const Group = lazy(() => import('./groups/GroupContainer'));
const EditGroupContainer = lazy(() => import('./groups/EditGroupContainer'));
const NewGroupContainer = lazy(() => import('./groups/NewGroupContainer'));

// Resources
const Resources = lazy(() => import('./resources/Resources'));
const Resource = lazy(() => import('./resources/Resource'));
const EditResource = lazy(() => import('./resources/EditResource'));
const NewResource = lazy(() => import('./resources/NewResource'));

// Calendar
const CalendarContainer = lazy(() => import('./CalendarContainer'));

// Works
const Works = lazy(() => import('./works/Works'));
const NewWork = lazy(() => import('./works/NewWork'));

// Profile
const Profile = lazy(() => import('./profile/Profile'));
const EditProfile = lazy(() => import('./profile/EditProfile'));
const Work = lazy(() => import('./works/Work'));
const EditWork = lazy(() => import('./works/EditWork'));

// Pages
const EditPage = lazy(() => import('./pages/EditPage'));
const Page = lazy(() => import('./pages/Page'));

// Members
const MembersPublic = lazy(() => import('./members/MembersPublic'));

// Admin
const Settings = lazy(() => import('./admin/Settings'));
const Members = lazy(() => import('./admin/Members'));
const Emails = lazy(() => import('./admin/Emails'));
const EmailNewsletter = lazy(() => import('./admin/EmailNewsletter'));
const Categories = lazy(() => import('./admin/Categories'));
const PreviousNewsletters = lazy(() => import('./admin/EmailNewsletter/PreviousNewsletters'));

// Super admin
const PlatformSettings = lazy(() => import('./admin/PlatformSettings'));
const PlatformRegistrationIntro = lazy(() => import('./admin/PlatformRegistrationIntro'));

// Auth
const SignupPage = lazy(() => import('./auth/SignupPage'));
const LoginPage = lazy(() => import('./auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./auth/ResetPasswordPage'));
const RegistrationIntro = lazy(() => import('./auth/RegistrationIntro'));

// SuperAdmin
const NewHost = lazy(() => import('./hosts/NewHost'));

// NotFound
const NotFoundPage = lazy(() => import('./NotFoundPage'));
const MyActivities = lazy(() => import('./activities/MyActivities'));

export default function () {
  return (
    <LayoutContainer>
      <Suspense fallback={null}>
        <Routes>
          <Route exact path="/" element={<Home />} />

          {/* Members list public */}
          <Route path="/people" element={<MembersPublic />} />

          {/* Calendar */}
          <Route exact path="/calendar" element={<CalendarContainer />} />

          {/* Activities */}
          <Route exact path="/activities" element={<Activities />} />
          <Route exact path="/activities/new" element={<NewActivityContainer />} />
          <Route path="/activities/:activityId/*" element={<ActivityContainer />} />
          <Route path="/activities/:activityId/edit" element={<EditActivityContainer />} />
          <Route exact path="/my-activities" element={<MyActivities />} />

          {/* Groups */}
          <Route exact path="/groups" element={<Groups />} />
          <Route exact path="/groups/new" element={<NewGroupContainer />} />
          <Route path="/groups/:groupId/*" element={<Group />} />
          <Route path="/groups/:groupId/edit" element={<EditGroupContainer />} />

          {/* Resources */}
          <Route exact path="/resources" element={<Resources />} />
          <Route exact path="/resources/new" element={<NewResource />} />
          <Route path="/resources/:resourceId/*" element={<Resource />} />
          <Route path="/resources/:resourceId/edit" element={<EditResource />} />

          {/* Pages */}
          <Route exact path="/pages" element={<Page />} />
          <Route path="/pages/:pageId/*" element={<Page />} />
          <Route path="/pages/:pageId/edit" element={<EditPage />} />

          {/* Works */}
          <Route exact path="/works" element={<Works />} />
          <Route exact path="/works/new" element={<NewWork />} />

          {/* Communities: Only on Portal App */}
          <Route exact path="/communities" element={<Communities />} />

          {/* Newsletter Emails */}
          <Route path="/newsletters" element={<PreviousNewsletters />} />

          {/* Admin */}
          <Route path="/admin/settings/*" element={<Settings />} />
          <Route path="/admin/users/*" element={<Members />} />
          <Route path="/admin/emails/*" element={<Emails />} />
          <Route exact path="/admin/email-newsletter" element={<EmailNewsletter />} />
          <Route exact path="/admin/categories" element={<Categories />} />

          {/* Super Admin */}
          <Route path="/superadmin/platform/settings/*" element={<PlatformSettings />} />
          <Route
            path="/superadmin/platform/registration-intro"
            element={<PlatformRegistrationIntro />}
          />

          {/* Profile & Profile Related Pages */}
          <Route path="/edit/*" element={<EditProfile />} />
          <Route path="/:usernameSlug/*" element={<Profile />} />
          <Route path="/:usernameSlug/works/:workId/*" element={<Work />} />
          <Route path="/:usernameSlug/works/:workId/edit" element={<EditWork />} />

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

export const allRoutes = (
  <>
    <Route exact path="/" element={<Home />} />

    {/* Members list public */}
    <Route path="/people" element={<MembersPublic />} />

    {/* Calendar */}
    <Route exact path="/calendar" element={<CalendarContainer />} />

    {/* Activities */}
    <Route exact path="/activities" element={<Activities />} />
    <Route exact path="/activities/new" element={<NewActivityContainer />} />
    <Route path="/activities/:activityId/*" element={<ActivityContainer />} />
    <Route path="/activities/:activityId/edit" element={<EditActivityContainer />} />
    <Route exact path="/my-activities" element={<MyActivities />} />

    {/* Groups */}
    <Route exact path="/groups" element={<Groups />} />
    <Route exact path="/groups/new" element={<NewGroupContainer />} />
    <Route path="/groups/:groupId/*" element={<Group />} />
    <Route path="/groups/:groupId/edit" element={<EditGroupContainer />} />

    {/* Resources */}
    <Route exact path="/resources" element={<Resources />} />
    <Route exact path="/resources/new" element={<NewResource />} />
    <Route path="/resources/:resourceId/*" element={<Resource />} />
    <Route path="/resources/:resourceId/edit" element={<EditResource />} />

    {/* Pages */}
    <Route exact path="/pages" element={<Page />} />
    <Route path="/pages/:pageId/*" element={<Page />} />
    <Route path="/pages/:pageId/edit" element={<EditPage />} />

    {/* Works */}
    <Route exact path="/works" element={<Works />} />
    <Route exact path="/works/new" element={<NewWork />} />

    {/* Communities: Only on Portal App */}
    <Route exact path="/communities" element={<Communities />} />

    {/* Newsletter Emails */}
    <Route path="/newsletters" element={<PreviousNewsletters />} />

    {/* Admin */}
    <Route path="/admin/settings/*" element={<Settings />} />
    <Route path="/admin/users/*" element={<Members />} />
    <Route path="/admin/emails/*" element={<Emails />} />
    <Route exact path="/admin/email-newsletter" element={<EmailNewsletter />} />
    <Route exact path="/admin/categories" element={<Categories />} />

    {/* Super Admin */}
    <Route path="/superadmin/platform/settings/*" element={<PlatformSettings />} />
    <Route path="/superadmin/platform/registration-intro" element={<PlatformRegistrationIntro />} />

    {/* Profile & Profile Related Pages */}
    <Route path="/edit/*" element={<EditProfile />} />
    <Route path="/:usernameSlug/*" element={<Profile />} />
    <Route path="/:usernameSlug/works/:workId/*" element={<Work />} />
    <Route path="/:usernameSlug/works/:workId/edit" element={<EditWork />} />

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
  </>
);
