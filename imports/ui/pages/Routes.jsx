import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Progress } from '@chakra-ui/react';

import Home from '../Home';
import LayoutContainer from '../LayoutContainer';
import ResourceRoutes from './resources/ResourceRouter';
import ProcessRoutes from './processes/ProcessRoutes';
import ActivityRoutes from './activities/ActivityRoutes';
import PageRoutes from './pages/PageRouter';
import ProfileRoutes from './profile/ProfileRouter';
import Terms from '../components/Terms';
import Communities from '../pages/hosts/Communities';

// Calendar
const CalendarContainer = lazy(() => import('./CalendarContainer'));

// Works
const Works = lazy(() => import('./works/Works'));
const NewWork = lazy(() => import('./works/NewWork'));

// Others are on profile routes

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

// SuperAdmin
const NewHost = lazy(() => import('./hosts/NewHost'));

// NotFound
const NotFoundPage = lazy(() => import('./NotFoundPage'));
const MyActivities = lazy(() => import('./activities/MyActivities'));

export default function () {
  return (
    <Switch>
      <LayoutContainer>
        <Suspense fallback={<Progress size="xs" colorScheme="pink" isIndeterminate />}>
          <Switch>
            {/* Home */}
            <Route exact path="/" render={(props) => <Home {...props} />} />

            {/* Members list public */}
            <Route exact path="/members" render={(props) => <MembersPublic {...props} />} />

            {/* Calendar */}
            <Route exact path="/calendar" render={(props) => <CalendarContainer {...props} />} />

            {/* Activities */}
            <ActivityRoutes path="/activities" />
            <Route exact path="/my-activities" render={(props) => <MyActivities {...props} />} />

            {/* Processes */}
            <ProcessRoutes path="/processes" />

            {/* Resources */}
            <ResourceRoutes path="/resources" />

            {/* Pages */}
            <PageRoutes path="/pages" />

            {/* Works */}
            <Switch path="/works">
              <Route exact path="/works" render={(props) => <Works {...props} />} />
              <Route exact path="/works/new" render={(props) => <NewWork {...props} />} />
            </Switch>

            {/* Profile & Profile Related Pages */}
            <ProfileRoutes path="/@:username" />

            {/* Communities: Only on Portal App */}
            <Route exact path="/communities" render={(props) => <Communities {...props} />} />

            {/* Newsletter Emails */}
            <Route path="/newsletters" render={(props) => <PreviousNewsletters {...props} />} />

            {/* Admin */}
            <Switch path="/admin">
              <Route path="/admin/settings" render={(props) => <Settings {...props} />} />
              <Route path="/admin/members" render={(props) => <Members {...props} />} />
              <Route exact path="/admin/emails" render={(props) => <Emails {...props} />} />
              <Route
                exact
                path="/admin/email-newsletter"
                render={(props) => <EmailNewsletter {...props} />}
              />
              <Route path="/admin/categories" render={(props) => <Categories {...props} />} />
            </Switch>

            {/* Super Admin */}
            <Route
              path="/superadmin/platform/settings"
              render={(props) => <PlatformSettings {...props} />}
            />
            <Route
              path="/superadmin/platform/registration-intro"
              render={(props) => <PlatformRegistrationIntro {...props} />}
            />

            {/* Auth */}
            <Route exact path="/register" render={(props) => <SignupPage {...props} />} />
            <Route exact path="/login" render={(props) => <LoginPage {...props} />} />
            <Route
              exact
              path="/forgot-password"
              render={(props) => <ForgotPasswordPage {...props} />}
            />
            <Route
              path="/reset-password/:token"
              render={(props) => <ResetPasswordPage {...props} />}
            />

            {/* SuperAdmin */}
            <Route exact path="/new-host" render={(props) => <NewHost {...props} />} />
            <Route exact path="/terms-&-privacy-policy" render={(props) => <Terms {...props} />} />

            {/* NotFoundPage */}
            <Route exact path="/not-found" render={(props) => <NotFoundPage {...props} />} />
            <Route exact path="/404" render={(props) => <NotFoundPage {...props} />} />
            <Route path="*">
              <NotFoundPage />
            </Route>
          </Switch>
        </Suspense>
      </LayoutContainer>
    </Switch>
  );
}
