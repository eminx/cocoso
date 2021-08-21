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

import ScrollToTop from './ScrollToTop';
import NotFoundPage from './NotFoundPage';

const browserHistory = createBrowserHistory();

export default function () {
  return (
    <Router history={browserHistory}>
      <Switch>
        <LayoutContainer history={browserHistory}>
          <ScrollToTop>
            <Route exact path="/" component={Home} />
            {/* <Suspense fallback={<div>Loading...</div>}> */}
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
            {/* </Suspense> */}
          </ScrollToTop>
        </LayoutContainer>
      </Switch>
    </Router>
  );
}
