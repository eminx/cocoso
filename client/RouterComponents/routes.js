import React from 'react';
import { Switch, Router, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import LayoutContainer from '../LayoutContainer';

// route components
import HomeContainer from './HomeContainer';

import BookingContainer from './bookings/BookingContainer';
import NewBookSpaceContainer from './bookings/NewBookSpaceContainer';
import EditBookingContainer from './bookings/EditBookingContainer';

import NewGroupContainer from './groups/NewGroupContainer';
import EditGroupContainer from './groups/EditGroupContainer';
import GroupsListContainer from './groups/GroupsListContainer';
import GroupContainer from './groups/GroupContainer';

import NewPublicationContainer from './publications/NewPublicationContainer';
import EditPublicationContainer from './publications/EditPublicationContainer';
import PublicationsListContainer from './publications/PublicationsListContainer';
import PublicationContainer from './publications/PublicationContainer';

import PageContainer from './pages/PageContainer';
import NewPageContainer from './pages/NewPageContainer';
import EditPageContainer from './pages/EditPageContainer';

import ProfileContainer from './profile/ProfileContainer';
import UsersContainer from './users/UsersContainer';

import DocumentsListContainer from './documents/DocumentsListContainer';

import ScrollToTop from './ScrollToTop';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <LayoutContainer history={browserHistory}>
        <ScrollToTop>
          {/* <Switch> */}
          <Route exact path="/" component={HomeContainer} />
          <Route exact path="/calendar" component={CalendarContainer} />

          <Route exact path="/new-booking" component={NewBookSpaceContainer} />
          <Route path="/event/:id" component={BookingContainer} />
          <Route path="/booking/:id" component={BookingContainer} />
          <Route path="/edit-booking/:id/" component={EditBookingContainer} />

          <Route exact path="/new-group" component={NewGroupContainer} />
          <Route path="/groups/" component={GroupsListContainer} />
          <Route path="/group/:id" component={GroupContainer} />
          <Route path="/edit-group/:id/" component={EditGroupContainer} />

          <Route
            exact
            path="/new-publication"
            component={NewPublicationContainer}
          />
          <Route path="/publications/" component={PublicationsListContainer} />
          <Route path="/publication/:id" component={PublicationContainer} />
          <Route
            path="/edit-publication/:id/"
            component={EditPublicationContainer}
          />

          <Route exact path="/new-page" component={NewPageContainer} />
          <Route path="/page/:id" component={PageContainer} />
          <Route path="/edit-page/:id/" component={EditPageContainer} />

          <Route
            path="/my-profile/"
            history={browserHistory}
            component={ProfileContainer}
          />

          <Route path="/documents" component={DocumentsListContainer} />

          <Route path="/users" component={UsersContainer} />

          {/*<Route path="*" component={NotFoundPage}/>*/}
          {/* </Switch> */}
        </ScrollToTop>
      </LayoutContainer>
    </Switch>
  </Router>
);
