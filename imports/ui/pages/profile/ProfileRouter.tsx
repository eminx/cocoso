import React from 'react';
import { Route } from 'react-router';
import loadable from '@loadable/component';

const EditProfile = loadable(() => import('./EditProfile'));
const Work = loadable(() => import('../works/WorkItemHandler'));
const EditWork = loadable(() => import('../works/EditWork'));
const Profile = loadable(() => import('../../entry/UserHybrid'));

export default function PageRoutes({ path, history }) {
  return (
    <Route path="/@:username" history={history} component={Profile}>
      <Route path="/edit" component={EditProfile} />
      <Route path="/works/:workId/edit" component={EditWork} />
      <Route path="/works/:workId" component={Work} />
      <Route path="/:profileRoute" history={history} component={Profile} />
    </Route>
  );
}
