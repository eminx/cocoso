import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

// const NotFoundPage = lazy(() => import('../../../NotFoundPage'));
const Resources = lazy(() => import('./Resources'));
const NewResource = lazy(() => import('./NewResource'));
const Resource = lazy(() => import('./Resource'));
const EditResource = lazy(() => import('./EditResource'));

export default function ResourceRoutes({ path, history }) {
  return (
    <Switch path={path} history={history}>
      <Route exact path="/resources" component={Resources} />
      <Route exact path="/resources/new" component={NewResource} history={history} />
      <Switch>
        <Route path="/resources/:id/edit" component={EditResource} history={history} />
        <Route path="/resources/:id" component={Resource} />
      </Switch>
    </Switch>
  );
};
