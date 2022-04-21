import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { StateContext } from './LayoutContainer.jsx';

function Home() {
  const { currentHost } = useContext(StateContext);

  const menu = currentHost && currentHost.settings && currentHost.settings.menu;
  if (!menu || !menu[0]) {
    return 'loading...';
  }

  const visibleMenu = menu.filter((item) => item.isVisible);

  const path = visibleMenu[0].name;

  if (!path) {
    return <Redirect to="/activities" />;
  }

  if (path === 'info') {
    return <Redirect to="/page/about" />;
  }

  return <Redirect to={`/${path}`} />;
}

export default Home;
