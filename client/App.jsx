import React from 'react';
import { Grommet } from 'grommet';
import Routes from './RouterComponents/Routes';
import { setConfiguration } from 'react-grid-system';
setConfiguration({ maxScreenClass: 'xl' });

const theme = {
  spacing: 12,
  global: {
    font: {
      family: 'sans-serif',
      size: '15px',
      height: '24px',
    },
    colors: {
      brand: 'rgba(0,0,0, .75)',
      focus: 'rgba(0,0,0, .25)',
    },
  },
  formField: {
    border: false,
  },
  list: {
    item: {
      border: false,
    },
  },
};

export default function () {
  console.log('App is loading routes');
  return (
    <Grommet theme={theme}>
      <Routes />
    </Grommet>
  );
}
