import React, { lazy, Suspense } from 'react';
import { Switch, Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Home from '../Home';
import LayoutContainer from '../LayoutContainer';

// ROUTES

// Calendar
const CalendarContainer = require('./CalendarContainer');

// Activities
const ActivitiesContainer = require('./activities/ActivitiesContainer');

const ActivityContainer = require('./activities/ActivityContainer');
const MyActivities = require('./activities/MyActivities');
const NewActivityContainer = require('./activities/NewActivityContainer');

const EditActivityContainer = require('./activities/EditActivityContainer');

// Processes
const NewProcessContainer = require('./processes/NewProcessContainer');

const EditProcessContainer = require('./processes/EditProcessContainer');

const ProcessesListContainer = require('./processes/ProcessesListContainer');

const ProcessContainer = require('./processes/ProcessContainer');

// Pages
const Page = require('./pages/Page');
const NewPageContainer = require('./pages/NewPageContainer');
const EditPageContainer = require('./pages/EditPageContainer');

// Works
const Works = require('./works/Works');
const Work = require('./works/Work');
const MyWorks = require('./works/MyWorks');
const NewWork = require('./works/NewWork');
const EditWork = require('./works/EditWork');

// Members
const ProfileContainer = require('./profile/ProfileContainer');
const MembersPublic = require('./members/MembersPublic');
const MemberPublic = require('./members/Member');
const SignupPage = require('../account-manager/SignupPage');
const LoginPage = require('../account-manager/LoginPage');
const ForgotPasswordPage = require('../account-manager/ForgotPasswordPage');

const ResetPasswordPage = require('../account-manager/ResetPasswordPage');

// admin
const Settings = require('./admin/Settings');
const Members = require('./admin/Members');
const Resources = require('./admin/Resources');

// superadmin
const NewHost = require('./hosts/NewHost');

import NotFoundPage from './NotFoundPage';

const browserHistory = createBrowserHistory();

export default function () {
  return (
    <Router history={browserHistory}>
      <Switch>
        <LayoutContainer history={browserHistory}>
          {/* <Suspense fallback={<div>loading the page...</div>}> */}
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
          {/* </Suspense> */}
        </LayoutContainer>
      </Switch>
    </Router>
  );
}
