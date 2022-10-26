import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

const Processes = lazy(() => import('./ProcessesList'));
const NewProcess = lazy(() => import('./NewProcessContainer'));
const Process = lazy(() => import('./ProcessContainer'));
const EditProcess = lazy(() => import('./EditProcessContainer'));

export default function ProcessRoutes({ path, history }) {
  return (
    <Switch path={path} history={history}>
      <Route exact path="/processes" component={Processes} />
      <Route exact path="/processes/new" component={NewProcess} history={history} />
      <Switch>
        <Route path="/processes/:processId/edit" component={EditProcess} history={history} />
        <Route path="/processes/:processId" component={Process} />
      </Switch>
    </Switch>
  );
}
