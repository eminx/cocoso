import React, { lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

const EditProfileContainer = lazy(() => import('./EditProfileContainer'));
const MyWorks = lazy(() => import('../works/MyWorks'));
const Work = lazy(() => import('../works/Work'));
const EditWork = lazy(() => import('../works/EditWork'));

const MyActivities = lazy(() => import('../activities/MyActivities'));
const MemberPublic = lazy(() => import('../members/Member'));

export default function PageRoutes({ path, history }) {
  return (
    <Switch path={path} history={history}>
      <Route path="/@:username/edit" component={EditProfileContainer} />
      <Route path="/@:username/works" component={MyWorks} />
      <Route path="/@:username/works/:workId" component={Work} />
      <Route path="/@:username/works/:workId/edit" component={EditWork} />
      <Route path="/@:username/activities" component={MyActivities} />
      <Route path="/@:username" component={MemberPublic} />
    </Switch>
  );
}
