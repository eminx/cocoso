import React from 'react';
import { Grommet } from 'grommet';

import Routes from './RouterComponents/Routes';

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px'
    }
  }
};

export default function() {
  console.log('Im here');
  return (
    <Grommet theme={theme}>
      <Routes />
    </Grommet>
  );
}
