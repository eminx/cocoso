import React from 'react';
import Routes from './pages/Routes';
import { setConfiguration } from 'react-grid-system';
setConfiguration({ maxScreenClass: 'xl' });

export default function () {
  return <Routes />;
}
