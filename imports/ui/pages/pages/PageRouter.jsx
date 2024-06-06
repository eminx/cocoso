import React, { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';

const NewPage = lazy(() => import('./NewPage'));
const Page = lazy(() => import('./Page'));
const EditPage = lazy(() => import('./EditPage'));

export default function PageRoutes({ path, history }) {
  return (
    <Route
      path="/pages"
      render={({ location }) => <Navigate to={{ pathname: '/about', state: { from: location } }} />}
    >
      <Route exact path="/new" component={NewPage} history={history} />
      <Route path="/:pageId/edit" component={EditPage} history={history} />
      <Route path="/:pageId" component={Page} />
    </Route>
  );
}
