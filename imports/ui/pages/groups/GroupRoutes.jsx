import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

const Groups = lazy(() => import('./GroupList'));
const NewGroup = lazy(() => import('./NewGroupContainer'));
const Group = lazy(() => import('./GroupContainer'));
const EditGroup = lazy(() => import('./EditGroupContainer'));

export default function GroupRoutes({ path, history }) {
  return (
    <Switch path={path} history={history}>
      <Route exact path="/groups" component={Groups} />
      <Route exact path="/groups/new" component={NewGroup} history={history} />
      <Switch>
        <Route path="/groups/:groupId/edit" component={EditGroup} history={history} />
        <Route path="/groups/:groupId" component={Group} />
      </Switch>
    </Switch>
  );
}
