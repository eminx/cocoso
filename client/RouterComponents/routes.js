import React from 'react';
import { Router, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import LayoutContainer from '../LayoutContainer';

// route components
import HomeContainer from './HomeContainer';
import NewGatheringContainer from './NewGatheringContainer';
import GatheringContainer from './GatheringContainer';
import NewStreamContainer from './NewStreamContainer';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <LayoutContainer match={browserHistory}>
      <Route exact path="/" component={HomeContainer}/>
      <Route exact path="/create-a-gathering" component={NewGatheringContainer}/>
      <Route exact path="/create-a-stream" component={NewStreamContainer}/>
      <Route path="/gathering/:id" component={GatheringContainer}/>
      {/*<Route path="*" component={NotFoundPage}/>*/}
    </LayoutContainer>
  </Router>
);