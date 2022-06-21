import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

const NewPage = lazy(() => import('./NewPageContainer'));
const Page = lazy(() => import('./Page'));
const EditPage = lazy(() => import('./EditPageContainer'));

export default function PageRoutes({ path, history }) {
  return (
    <Switch path={path} history={history}>
      <Route exact path="/pages/new" component={NewPage} history={history} />
      <Switch>
        <Route path="/pages/:pageId/edit" component={EditPage} history={history} />
        <Route path="/pages/:pageId" component={Page} />
      </Switch>
    </Switch>
  );
}
