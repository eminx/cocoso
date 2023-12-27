import React, { lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

const EditProfile = lazy(() => import('./EditProfile'));
const Work = lazy(() => import('../works/Work'));
const EditWork = lazy(() => import('../works/EditWork'));
const Profile = lazy(() => import('./Profile'));

export default function PageRoutes({ path, history }) {
  return (
    <Switch path={path} history={history}>
      <Route path="/@:username/edit" component={EditProfile} />
      <Route path="/@:username/works/:workId/edit" component={EditWork} />
      <Route path="/@:username/works/:workId" component={Work} />
      <Route path="/@:username/:profileRoute" history={history} component={Profile} />
      <Route path="/@:username" history={history} component={Profile} />
    </Switch>
  );
}
