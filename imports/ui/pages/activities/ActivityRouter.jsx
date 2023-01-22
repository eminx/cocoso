import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

const Activities = lazy(() => import('./Activities'));
const NewActivity = lazy(() => import('./NewActivityContainer'));
const Activity = lazy(() => import('./ActivityContainer'));
const EditActivity = lazy(() => import('./EditActivityContainer'));

export default function ActivityRoutes({ path, history }) {
  return (
    <Switch path={path} history={history}>
      <Route path="/activities" component={Activities} />
      {/* <Route exact path="/activities/new" component={NewActivity} history={history} />
      <Switch>
        <Route path="/activities/:activityId/edit" component={EditActivity} history={history} />
        <Route path="/activities/:activityId" component={Activity} />
      </Switch> */}
    </Switch>
  );
}
