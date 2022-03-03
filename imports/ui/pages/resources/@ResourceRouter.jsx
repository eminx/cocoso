import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

// const NotFoundPage = lazy(() => import('../../../NotFoundPage'));
const Resources = lazy(() => import('./Resources'));
const NewResource = lazy(() => import('./NewResource'));
const Resource = lazy(() => import('./Resource'));
const EditResource = lazy(() => import('./EditResource'));

export default function ResourceRoutes({path}) {
  return (
    <Switch path={path}>
      <Route exact path="/resources" component={Resources} />
      <Route exact path="/resources/new" component={NewResource} />
      <Switch>
        <Route path="/resources/:id/edit" component={EditResource} />
        <Route path="/resources/:id" component={Resource} />
      </Switch>
    </Switch>
  );
};
