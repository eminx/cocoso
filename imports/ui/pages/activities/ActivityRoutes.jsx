import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

const Activities = lazy(() => import('./Activities'));
const NewActivityContainer = lazy(() => import('./NewActivityContainer'));
const ActivityContainer = lazy(() => import('./ActivityContainer'));
const EditActivityContainer = lazy(() => import('./EditActivityContainer'));

export default function ActivityRoutes({ path, history }) {
  return (
    <Switch path={path} history={history}>
      <Route exact path="/activities" component={Activities} />
      <Route exact path="/activities/new" component={NewActivityContainer} history={history} />
      <Switch>
        <Route
          path="/activities/:activityId/edit"
          component={EditActivityContainer}
          history={history}
        />
        <Route path="/activities/:activityId" component={ActivityContainer} />
      </Switch>
    </Switch>
  );
}
