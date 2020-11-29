import { withTracker } from 'meteor/react-meteor-data';
import React, { useContext } from 'react';
import { Redirect } from 'react-router';

import Activities from './RouterComponents/activities/ActivitiesContainer';
import ProcessesList from './RouterComponents/processes/ProcessesListContainer';
import Calendar from './RouterComponents/CalendarContainer';
import Works from './RouterComponents/works/Works';
import Page from './RouterComponents/pages/Page';

import { StateContext } from './LayoutContainer';

const getHomeRoute = (currentHost) => {
  const menu = currentHost && currentHost.settings && currentHost.settings.menu;
  if (!menu || !menu[0]) {
    console.log('wtf');
    return null;
  }

  switch (menu[0].name) {
    case 'activities':
      return Activities;
    case 'processes':
      return ProcessesList;
    case 'calendar':
      return Calendar;
    case 'works':
      return Works;
    case 'info':
      return Page;
    default:
      return null;
  }
};

function Home() {
  const { currentHost } = useContext(StateContext);

  const menu = currentHost && currentHost.settings && currentHost.settings.menu;
  if (!menu || !menu[0]) {
    console.log('wtf');
    return 'loading...';
  }

  const path = menu[0].name;
  console.log(`/${path}`);

  if (path === 'info') {
    return <Redirect to="/page/about" />;
  }

  return <Redirect to={`/${path}`} />;
}

export default Home;
