import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

const Resources = lazy(() => import('./Resources'));
const NewResource = lazy(() => import('./NewResource'));
const Resource = lazy(() => import('./Resource'));
const EditResource = lazy(() => import('./EditResource'));

export default function ResourceRoutes({ path, history }) {
  return (
    <Route path="/resources" component={Resources}>
      <Route exact path="/new" component={NewResource} history={history} />
      <Route path=":resourceId/edit" component={EditResource} history={history} />
      <Route path=":resourceId" component={Resource} />
    </Route>
  );
}
