import React from 'react';
import { Switch, Router, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import LayoutContainer from '../LayoutContainer';

// route components
import HomeContainer from './HomeContainer';
import NewBookSpaceContainer from './NewBookSpaceContainer';
import NewGroupContainer from './NewGroupContainer';
import BookingContainer from './BookingContainer';

import Memberetc from './Memberetc';
import EditBookingContainer from './EditBookingContainer';
import EditGroupContainer from './EditGroupContainer';
import GroupsListContainer from './GroupsListContainer';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <LayoutContainer match={browserHistory}>
    	<Switch>
	      <Route exact path="/" component={HomeContainer}/>
	      <Route exact path="/new-booking" component={NewBookSpaceContainer} />
	      <Route exact path="/new-group" component={NewGroupContainer} />
	      <Route path="/booking/:id" component={BookingContainer} />
	      <Route path="/edit-booking/:id/" component={EditBookingContainer} />
	      <Route path="/edit-group/:id/" component={EditGroupContainer} />
	      <Route exact path="/member" component={Memberetc} />
	      <Route path="/groups/" component={GroupsListContainer} />
	      <Route path="/group/:id" component={GroupContainer} />
	      {/*<Route path="/group/:id" component={GroupContainer} />*/}
	      {/*<Route path="*" component={NotFoundPage}/>*/}
	    </Switch>
    </LayoutContainer>
  </Router>
);