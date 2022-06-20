import React, { lazy, Suspense } from 'react';
import { Switch, Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Progress } from '@chakra-ui/react';

import Home from '../Home';
import LayoutContainer from '../LayoutContainer';
import ResourceRoutes from './resources/ResourceRouter';
import ProcessRoutes from './processes/ProcessRouter';
import ActivityRoutes from './activities/ActivitiyRouter';

// ROUTES
const browserHistory = createBrowserHistory();
// Calendar
const CalendarContainer = lazy(() => import('./CalendarContainer'));
// Activities
const ActivityContainer = lazy(() => import('./activities/ActivityContainer'));
const MyActivities = lazy(() => import('./activities/MyActivities'));
// const ActivitiesContainer = lazy(() => import('./activities/ActivitiesContainer'));
// const NewActivityContainer = lazy(() => import('./activities/NewActivityContainer'));
// const EditActivityContainer = lazy(() => import('./activities/EditActivityContainer'));
// Processes
// const NewProcessContainer = lazy(() => import('./processes/NewProcessContainer'));
// const EditProcessContainer = lazy(() => import('./processes/EditProcessContainer'));
// const ProcessesListContainer = lazy(() => import('./processes/ProcessesListContainer'));
// const ProcessContainer = lazy(() => import('./processes/ProcessContainer'));
// Pages
const Page = lazy(() => import('./pages/Page'));
const NewPageContainer = lazy(() => import('./pages/NewPageContainer'));
const EditPageContainer = lazy(() => import('./pages/EditPageContainer'));
// Works
const Works = lazy(() => import('./works/Works'));
const Work = lazy(() => import('./works/Work'));
const MyWorks = lazy(() => import('./works/MyWorks'));
const NewWork = lazy(() => import('./works/NewWork'));
const EditWork = lazy(() => import('./works/EditWork'));
// Auth
const SignupPage = lazy(() => import('./auth/SignupPage'));
const LoginPage = lazy(() => import('./auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./auth/ResetPasswordPage'));
// Members
const ProfileContainer = lazy(() => import('./profile/ProfileContainer'));
const MembersPublic = lazy(() => import('./members/MembersPublic'));
const MemberPublic = lazy(() => import('./members/Member'));
// Admin
const Settings = lazy(() => import('./admin/Settings'));
const Members = lazy(() => import('./admin/Members'));
const Emails = lazy(() => import('./admin/Emails'));
// SuperAdmin
const NewHost = lazy(() => import('./hosts/NewHost'));
// NotFound
const NotFoundPage = lazy(() => import('./NotFoundPage'));

export default function () {
  return (
    <Router history={browserHistory}>
      <Switch>
        <LayoutContainer history={browserHistory}>
          <Suspense fallback={<Progress size="xs" colorScheme="pink" isIndeterminate />}>
            <Switch>
              {/* Home */}
              <Route exact path="/" component={Home} />
              {/* Calendar */}
              <Route exact path="/calendar" component={CalendarContainer} />
              {/* Activities */}
              <Route exact path="/my-activities" component={MyActivities} />
              <Route path="/event/:id" component={ActivityContainer} />
              {/* <Route exact path="/activities" component={ActivitiesContainer} />
              <Route exact path="/new-activity" component={NewActivityContainer} />
              <Route path="/activity/:id" component={ActivityContainer} />
              <Route path="/edit-activity/:id/" component={EditActivityContainer} /> */}
              <ActivityRoutes path="/activities" history={browserHistory} />
              {/* Processes */}
              {/* <Route exact path="/new-process" component={NewProcessContainer} />
              <Route exact path="/processes/" component={ProcessesListContainer} />
              <Route path="/process/:id" component={ProcessContainer} />
              <Route path="/edit-process/:id/" component={EditProcessContainer} /> */}
              <ProcessRoutes path="/processes" history={browserHistory} />
              {/* Resources */}
              <ResourceRoutes path="/resources" history={browserHistory} />
              {/* Pages */}
              <Route exact path="/new-page" component={NewPageContainer} />
              <Route path="/page/:id" component={Page} />
              <Route path="/edit-page/:id/" component={EditPageContainer} />
              {/* Works */}
              <Route exact path="/my-works" component={MyWorks} />
              <Route path="/:username/work/:workId" component={Work} />
              <Route path="/:username/edit-work/:workId" component={EditWork} />
              <Route exact path="/new-work" component={NewWork} />
              <Route exact path="/works" component={Works} />
              {/* Auth */}
              <Route exact path="/signup" component={SignupPage} />
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/forgot-password" component={ForgotPasswordPage} />
              <Route path="/reset-password/:token" component={ResetPasswordPage} />
              {/* Members */}
              <Route
                exact
                path="/my-profile/"
                component={ProfileContainer}
                history={browserHistory}
              />
              <Route exact path="/members" component={MembersPublic} />
              <Route path="/@:username" component={MemberPublic} />
              {/* Admin */}
              <Route exact path="/admin/settings" component={Settings} />
              <Route exact path="/admin/members" component={Members} />
              <Route exact path="/admin/emails" component={Emails} />
              {/* SuperAdmin */}
              <Route exact path="/new-host" component={NewHost} />
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
    </Router>
  );
}
