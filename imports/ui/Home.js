import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { MainLoader } from './components/SkeletonLoaders';

import { StateContext } from './LayoutContainer';

function Home() {
  const { currentHost } = useContext(StateContext);

  const menu = currentHost && currentHost.settings && currentHost.settings.menu;
  if (!menu || !menu[0]) {
    return <MainLoader />;
  }

  const visibleMenu = menu.filter((item) => item.isVisible);

  const path = visibleMenu[0].name;

  if (!path) {
    return <Navigate to="/activities" />;
  }

  if (path === 'info') {
    return <Navigate to="/pages/about" />;
  }

  return <Navigate to={`/${path}`} />;
}

export default Home;
