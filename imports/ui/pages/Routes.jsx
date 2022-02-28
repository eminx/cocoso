import React, { lazy, Suspense } from 'react';
import { Switch, Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Progress } from '@chakra-ui/react';

import Home from '../Home';
import LayoutContainer from '../LayoutContainer';

// ROUTES
const browserHistory = createBrowserHistory();
// const NotFoundPage = lazy(() => import('./NotFoundPage'));
// Calendar
const CalendarContainer = lazy(() => import('./CalendarContainer'));
// Activities
const ActivitiesContainer = lazy(() => import('./activities/ActivitiesContainer'));
const ActivityContainer = lazy(() => import('./activities/ActivityContainer'));
const MyActivities = lazy(() => import('./activities/MyActivities'));
const NewActivityContainer = lazy(() => import('./activities/NewActivityContainer'));
const EditActivityContainer = lazy(() => import('./activities/EditActivityContainer'));
// Processes
const NewProcessContainer = lazy(() => import('./processes/NewProcessContainer'));
const EditProcessContainer = lazy(() => import('./processes/EditProcessContainer'));
const ProcessesListContainer = lazy(() => import('./processes/ProcessesListContainer'));
const ProcessContainer = lazy(() => import('./processes/ProcessContainer'));
// Resources
const Resources = lazy(() => import('./resources/Resources'));
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

export default function () {
  return (
    <Router history={browserHistory}>
      <Switch>
        <LayoutContainer history={browserHistory}>
          <Suspense fallback={<Progress size="xs" colorScheme="pink" isIndeterminate />}>
            {/* Home */}
            {/* <Route path="*" component={NotFoundPage} /> */}
            <Route exact path="/" component={Home} />
            {/* Calendar */}
            <Route exact path="/calendar" component={CalendarContainer} />
            {/* Activities */}
            <Route exact path="/activities" component={ActivitiesContainer} />
            <Route exact path="/my-activities" component={MyActivities} />
            <Route exact path="/new-activity" component={NewActivityContainer}/>
            <Route path="/event/:id" component={ActivityContainer} />
            <Route path="/activity/:id" component={ActivityContainer} />
            <Route path="/edit-activity/:id/" component={EditActivityContainer}/>
            {/* Processes */}
            <Route exact path="/new-process" component={NewProcessContainer} />
            <Route path="/processes/" component={ProcessesListContainer} />
            <Route path="/process/:id" component={ProcessContainer} />
            <Route path="/edit-process/:id/" component={EditProcessContainer} />
            {/* Resources */}
            <Route path="/resources" component={Resources} />
            {/* Pages */}
            <Route exact path="/new-page" component={NewPageContainer} />
            <Route path="/page/:id" component={Page} />
            <Route path="/edit-page/:id/" component={EditPageContainer} />
            {/* Works */}
            <Route path="/my-works" component={MyWorks} />
            <Route path="/:username/work/:workId" component={Work} />
            <Route path="/:username/edit-work/:workId" component={EditWork} />
            <Route path="/new-work" component={NewWork} />
            <Route path="/works" component={Works} />
            {/* Auth */}
            <Route path="/signup" component={SignupPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/forgot-password" component={ForgotPasswordPage} />
            <Route path="/reset-password/:token" component={ResetPasswordPage}/>
            {/* Members */}
            <Route path="/my-profile/" component={ProfileContainer} history={browserHistory}/>
            <Route path="/members" component={MembersPublic} />
            <Route path="/@:username" component={MemberPublic} />
            {/* Admin */}
            <Route path="/admin/settings" component={Settings} />
            <Route path="/admin/members" component={Members} />
            <Route path="/admin/resources" component={Resources} />
            <Route path="/admin/emails" component={Emails} />
            {/* SuperAdmin */}
            <Route path="/new-host" component={NewHost} />
          </Suspense>
        </LayoutContainer>
      </Switch>
    </Router>
  );
}
