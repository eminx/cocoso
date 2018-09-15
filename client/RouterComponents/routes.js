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

import ProfileContainer from './profile/ProfileContainer';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <LayoutContainer match={browserHistory}>
      <Switch>
        <Route exact path="/" component={HomeContainer} />

        <Route exact path="/new-booking" component={NewBookSpaceContainer} />
        <Route path="/booking/:id" component={BookingContainer} />
        <Route path="/edit-booking/:id/" component={EditBookingContainer} />

        <Route exact path="/new-group" component={NewGroupContainer} />
        <Route path="/groups/" component={GroupsListContainer} />
        <Route path="/group/:id" component={GroupContainer} />
        <Route path="/edit-group/:id/" component={EditGroupContainer} />

        <Route path="/my-profile/" component={ProfileContainer} />
        {/*<Route path="/group/:id" component={GroupContainer} />*/}
        {/*<Route path="*" component={NotFoundPage}/>*/}
      </Switch>
    </LayoutContainer>
  </Router>
);
