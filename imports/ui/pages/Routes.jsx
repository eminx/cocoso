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
const Categories = lazy(() => import('./admin/Categories'));

// Super admin
const PlatformSettings = lazy(() => import('./admin/PlatformSettings'));

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
            <Route exact path="/" component={Home} />
            {/* Members list public */}
            <Route exact path="/members" component={MembersPublic} />
            {/* Calendar */}
            <Route exact path="/calendar" component={CalendarContainer} />
            {/* Activities */}
            <ActivityRoutes path="/activities" />
            <Route exact path="/my-activities" component={MyActivities} />
            {/* Processes */}
            <ProcessRoutes path="/processes" />
            {/* Resources */}
            <ResourceRoutes path="/resources" />
            {/* Pages */}
            <PageRoutes path="/pages" />
            {/* Works */}
            <Switch path="/works">
              <Route exact path="/works" component={Works} />
              <Route exact path="/works/new" component={NewWork} />
            </Switch>
            {/* Profile & Profile Related Pages */}
            <ProfileRoutes path="/@:username" />
            {/* Communities: Only on Portal App */}
            <Route exact path="/communities" component={Communities} />
            {/* Admin */}
            <Switch path="/admin">
              <Route path="/admin/settings" component={Settings} />
              <Route path="/admin/members" component={Members} />
              <Route exact path="/admin/emails" component={Emails} />
              <Route path="/admin/categories" component={Categories} />
            </Switch>
            {/* Super Admin */}
            <Route path="/superadmin/platform/settings" component={PlatformSettings} />
            {/* Auth */}
            <Route exact path="/register" component={SignupPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/forgot-password" component={ForgotPasswordPage} />
            <Route path="/reset-password/:token" component={ResetPasswordPage} />
            {/* SuperAdmin */}
            <Route exact path="/new-host" component={NewHost} />
            <Route exact path="/terms-&-privacy-policy" component={Terms} />
            {/* NotFoundPage */}
            <Route exact path="/not-found" component={NotFoundPage} />
            <Route exact path="/404" component={NotFoundPage} />
            <Route path="*">
              <NotFoundPage />
            </Route>
          </Switch>
        </Suspense>
      </LayoutContainer>
    </Switch>
  );
}
