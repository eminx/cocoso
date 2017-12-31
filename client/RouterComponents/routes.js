import React from 'react';
import { Router, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

// route components
import HomeContainer from './HomeContainer';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <div>
      <Route exact path="/" component={HomeContainer}/>
      {/*<Route path="lists/:id" component={ListPageContainer}/>*/}
      {/*<Route path="*" component={NotFoundPage}/>*/}
    </div>
  </Router>
);