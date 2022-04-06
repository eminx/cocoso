import React, { lazy, Suspense } from 'react';
import { Switch, Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Progress } from '@chakra-ui/react';

import Home from '../Home';
import LayoutContainer from '../LayoutContainer';

// ROUTES

// Calendar
const CalendarContainer = lazy(() => import('./CalendarContainer'));

// Activities
const ActivitiesContainer = lazy(() =>
  import('./activities/ActivitiesContainer')
);

const ActivityContainer = lazy(() => import('./activities/ActivityContainer'));
const MyActivities = lazy(() => import('./activities/MyActivities'));
const NewActivityContainer = lazy(() =>
  import('./activities/NewActivityContainer')
);

const EditActivityContainer = lazy(() =>
  import('./activities/EditActivityContainer')
);

// Processes
const NewProcessContainer = lazy(() =>
  import('./processes/NewProcessContainer')
);

const EditProcessContainer = lazy(() =>
  import('./processes/EditProcessContainer')
);

const ProcessesListContainer = lazy(() =>
  import('./processes/ProcessesListContainer')
);

const ProcessContainer = lazy(() => import('./processes/ProcessContainer'));

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

// Members
const ProfileContainer = lazy(() => import('./profile/ProfileContainer'));
const MembersPublic = lazy(() => import('./members/MembersPublic'));
const MemberPublic = lazy(() => import('./members/Member'));
const SignupPage = lazy(() => import('./auth/SignupPage'));
const LoginPage = lazy(() => import('./auth/LoginPage'));
const ForgotPasswordPage = lazy(() =>
  import('./auth/ForgotPasswordPage')
);
const ResetPasswordPage = lazy(() =>
  import('./auth/ResetPasswordPage')
);

// admin
const Settings = lazy(() => import('./admin/Settings'));
const Members = lazy(() => import('./admin/Members'));
const Resources = lazy(() => import('./admin/Resources'));
const Emails = lazy(() => import('./admin/Emails'));

// superadmin
const NewHost = lazy(() => import('./hosts/NewHost'));

const NotFoundPage = lazy(() => import('./NotFoundPage'));

const browserHistory = createBrowserHistory();

export default function () {
  return (
    <Router history={browserHistory}>
      <Switch>
        <LayoutContainer history={browserHistory}>
          <Suspense
            fallback={<Progress size="xs" colorScheme="pink" isIndeterminate />}
          >
            <Route exact path="/" component={Home} />

            <Route exact path="/calendar" component={CalendarContainer} />

            <Route exact path="/activities" component={ActivitiesContainer} />
            <Route exact path="/my-activities" component={MyActivities} />
            <Route
              exact
              path="/new-activity"
              component={NewActivityContainer}
            />
            <Route path="/event/:id" component={ActivityContainer} />
            <Route path="/activity/:id" component={ActivityContainer} />
            <Route
              path="/edit-activity/:id/"
              component={EditActivityContainer}
            />

            <Route exact path="/new-process" component={NewProcessContainer} />
            <Route path="/processes/" component={ProcessesListContainer} />
            <Route path="/process/:id" component={ProcessContainer} />
            <Route path="/edit-process/:id/" component={EditProcessContainer} />

            <Route path="/members" component={MembersPublic} />
            <Route path="/@:username" component={MemberPublic} />

            <Route exact path="/new-page" component={NewPageContainer} />
            <Route path="/page/:id" component={Page} />
            <Route path="/edit-page/:id/" component={EditPageContainer} />

            <Route
              path="/my-profile/"
              history={browserHistory}
              component={ProfileContainer}
            />

            <Route path="/my-works" component={MyWorks} />
            <Route path="/:username/work/:workId" component={Work} />
            <Route path="/:username/edit-work/:workId" component={EditWork} />
            <Route path="/new-work" component={NewWork} />
            <Route path="/works" component={Works} />

            <Route path="/admin/settings" component={Settings} />
            <Route path="/admin/members" component={Members} />
            <Route path="/admin/resources" component={Resources} />
            <Route path="/admin/emails" component={Emails} />

            <Route path="/signup" component={SignupPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/forgot-password" component={ForgotPasswordPage} />
            <Route
              path="/reset-password/:token"
              component={ResetPasswordPage}
            />

            {/* <Route path="*" component={NotFoundPage} /> */}

            {/* Super admin only! */}
            <Route path="/new-host" component={NewHost} />
          </Suspense>
        </LayoutContainer>
      </Switch>
    </Router>
  );
}
