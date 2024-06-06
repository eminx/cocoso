import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

const Activities = lazy(() => import('./Activities'));
const NewActivityContainer = lazy(() => import('./NewActivityContainer'));
const ActivityContainer = lazy(() => import('./ActivityContainer'));
const EditActivityContainer = lazy(() => import('./EditActivityContainer'));

export default function ActivityRoutes({ path, history }) {
  return (
    <Route path="/" component={Activities}>
      <Route exact path="/new" component={NewActivityContainer} history={history} />
      <Route path="/:activityId/edit" component={EditActivityContainer} history={history} />
      <Route path="/:activityId" component={ActivityContainer} />
    </Route>
  );
}
