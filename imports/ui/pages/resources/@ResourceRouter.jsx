import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

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
        <Route path="/resources/:resourceId/edit" component={EditResource} history={history} />
        <Route path="/resources/:resourceId" component={Resource} />
      </Switch>
    </Switch>
  );
};
