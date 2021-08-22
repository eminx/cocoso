import React from 'react';
import { Switch, Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import loadable from '@loadable/component';

import Home from '../Home';
import LayoutContainer from '../LayoutContainer';

// ROUTES

// Calendar
const CalendarContainer = loadable(() => import('./CalendarContainer'));

// Activities
const ActivitiesContainer = loadable(() =>
  import('./activities/ActivitiesContainer')
);
const ActivityContainer = loadable(() =>
  import('./activities/ActivityContainer')
);
const MyActivities = loadable(() => import('./activities/MyActivities'));
const NewActivityContainer = loadable(() =>
  import('./activities/NewActivityContainer')
);
const EditActivityContainer = loadable(() =>
  import('./activities/EditActivityContainer')
);

// Processes
const NewProcessContainer = loadable(() =>
  import('./processes/NewProcessContainer')
);
const EditProcessContainer = loadable(() =>
  import('./processes/EditProcessContainer')
);
const ProcessesListContainer = loadable(() =>
  import('./processes/ProcessesListContainer')
);
const ProcessContainer = loadable(() => import('./processes/ProcessContainer'));

// Pages
const Page = loadable(() => import('./pages/Page'));
const NewPageContainer = loadable(() => import('./pages/NewPageContainer'));
const EditPageContainer = loadable(() => import('./pages/EditPageContainer'));

// Works
const Works = loadable(() => import('./works/Works'));
const Work = loadable(() => import('./works/Work'));
const MyWorks = loadable(() => import('./works/MyWorks'));
const NewWork = loadable(() => import('./works/NewWork'));
const EditWork = loadable(() => import('./works/EditWork'));

// Members
const ProfileContainer = loadable(() => import('./profile/ProfileContainer'));
const MembersPublic = loadable(() => import('./members/MembersPublic'));
const MemberPublic = loadable(() => import('./members/Member'));
const SignupPage = loadable(() => import('../account-manager/SignupPage'));
const LoginPage = loadable(() => import('../account-manager/LoginPage'));
const ForgotPasswordPage = loadable(() =>
  import('../account-manager/ForgotPasswordPage')
);
const ResetPasswordPage = loadable(() =>
  import('../account-manager/ResetPasswordPage')
);

// admin
const Settings = loadable(() => import('./admin/Settings'));
const Members = loadable(() => import('./admin/Members'));
const Resources = loadable(() => import('./admin/Resources'));

// superadmin
const NewHost = loadable(() => import('./hosts/NewHost'));

import NotFoundPage from './NotFoundPage';

const browserHistory = createBrowserHistory();

export default function () {
  return (
    <Router history={browserHistory}>
      <Switch>
        <LayoutContainer history={browserHistory}>
          <Route exact path="/" component={Home} />

          <Route
            exact
            path="/calendar"
            component={(props) => <CalendarContainer {...props} />}
          />

          <Route
            exact
            path="/activities"
            render={(props) => <ActivitiesContainer {...props} />}
          />
          <Route
            exact
            path="/my-activities"
            render={(props) => <MyActivities {...props} />}
          />
          <Route
            exact
            path="/new-activity"
            render={(props) => <NewActivityContainer {...props} />}
          />
          <Route
            path="/event/:id"
            render={(props) => <ActivityContainer {...props} />}
          />
          <Route
            path="/activity/:id"
            render={(props) => <ActivityContainer {...props} />}
          />
          <Route
            path="/edit-activity/:id/"
            render={(props) => <EditActivityContainer {...props} />}
          />

          <Route
            exact
            path="/new-process"
            render={(props) => <NewProcessContainer {...props} />}
          />
          <Route
            path="/processes/"
            render={(props) => <ProcessesListContainer {...props} />}
          />
          <Route
            path="/process/:id"
            render={(props) => <ProcessContainer {...props} />}
          />
          <Route
            path="/edit-process/:id/"
            render={(props) => <EditProcessContainer {...props} />}
          />

          <Route
            path="/members"
            render={(props) => <MembersPublic {...props} />}
          />
          <Route
            path="/@:username"
            render={(props) => <MemberPublic {...props} />}
          />

          <Route
            exact
            path="/new-page"
            render={(props) => <NewPageContainer {...props} />}
          />
          <Route path="/page/:id" render={(props) => <Page {...props} />} />
          <Route
            path="/edit-page/:id/"
            render={(props) => <EditPageContainer {...props} />}
          />

          <Route
            path="/my-profile/"
            history={browserHistory}
            render={(props) => <ProfileContainer {...props} />}
          />

          <Route path="/my-works" render={(props) => <MyWorks {...props} />} />
          <Route
            path="/:username/work/:workId"
            render={(props) => <Work {...props} />}
          />
          <Route
            path="/:username/edit-work/:workId"
            render={(props) => <EditWork {...props} />}
          />
          <Route path="/new-work" render={(props) => <NewWork {...props} />} />
          <Route path="/works" render={(props) => <Works {...props} />} />

          <Route
            path="/admin/settings"
            render={(props) => <Settings {...props} />}
          />
          <Route
            path="/admin/members"
            render={(props) => <Members {...props} />}
          />
          <Route
            path="/admin/resources"
            render={(props) => <Resources {...props} />}
          />

          <Route path="/signup" render={(props) => <SignupPage {...props} />} />
          <Route path="/login" render={(props) => <LoginPage {...props} />} />
          <Route
            path="/forgot-password"
            render={(props) => <ForgotPasswordPage {...props} />}
          />
          <Route
            path="/reset-password/:token"
            render={(props) => <ResetPasswordPage {...props} />}
          />

          {/* <Route path="*" component={NotFoundPage} /> */}

          {/* Super admin only! */}
          <Route path="/new-host" render={(props) => <NewHost {...props} />} />
        </LayoutContainer>
      </Switch>
    </Router>
  );
}
