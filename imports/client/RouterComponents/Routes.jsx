import React, { lazy, Suspense } from 'react';
import { Switch, Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Home from '../Home';
import LayoutContainer from '../LayoutContainer';

// ROUTES

// Calendar
import CalendarContainer from './CalendarContainer';

// Activities
import ActivitiesContainer from './activities/ActivitiesContainer';

import ActivityContainer from './activities/ActivityContainer';
import MyActivities from './activities/MyActivities';
import NewActivityContainer from './activities/NewActivityContainer';

import EditActivityContainer from './activities/EditActivityContainer';

// Processes
import NewProcessContainer from './processes/NewProcessContainer';

import EditProcessContainer from './processes/EditProcessContainer';

import ProcessesListContainer from './processes/ProcessesListContainer';

import ProcessContainer from './processes/ProcessContainer';

// Pages
import Page from './pages/Page';
import NewPageContainer from './pages/NewPageContainer';
import EditPageContainer from './pages/EditPageContainer';

// Works
import Works from './works/Works';
import Work from './works/Work';
import MyWorks from './works/MyWorks';
import NewWork from './works/NewWork';
import EditWork from './works/EditWork';

// Members
import ProfileContainer from './profile/ProfileContainer';
import MembersPublic from './members/MembersPublic';
import MemberPublic from './members/Member';
import SignupPage from '../account-manager/SignupPage';
import LoginPage from '../account-manager/LoginPage';
import ForgotPasswordPage from '../account-manager/ForgotPasswordPage';

import ResetPasswordPage from '../account-manager/ResetPasswordPage';

// admin
import Settings from './admin/Settings';
import Members from './admin/Members';
import Resources from './admin/Resources';

// superadmin
import NewHost from './hosts/NewHost';

import NotFoundPage from './NotFoundPage';

const browserHistory = createBrowserHistory();

export default function () {
  return (
    <Router history={browserHistory}>
      <Switch>
        <LayoutContainer history={browserHistory}>
          {/* <Suspense fallback={<div>loading the page...</div>}> */}
          <Route exact path="/" component={Home} />

          <Route exact path="/calendar" component={CalendarContainer} />

          <Route exact path="/activities" component={ActivitiesContainer} />
          <Route exact path="/my-activities" component={MyActivities} />
          <Route exact path="/new-activity" component={NewActivityContainer} />
          <Route path="/event/:id" component={ActivityContainer} />
          <Route path="/activity/:id" component={ActivityContainer} />
          <Route path="/edit-activity/:id/" component={EditActivityContainer} />

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

          <Route path="/signup" component={SignupPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/forgot-password" component={ForgotPasswordPage} />
          <Route path="/reset-password/:token" component={ResetPasswordPage} />

          {/* <Route path="*" component={NotFoundPage} /> */}

          {/* Super admin only! */}
          <Route path="/new-host" component={NewHost} />
          {/* </Suspense> */}
        </LayoutContainer>
      </Switch>
    </Router>
  );
}
