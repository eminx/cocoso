import React from 'react';
import { Grommet } from 'grommet';

import Routes from './RouterComponents/Routes';

const theme = {
  global: {
    font: {
      family: 'sans-serif',
      size: '14px',
      height: '20px'
    },
    colors: {
      brand: '#ea3924'
    }
  }
};

export default function() {
  return (
    <Grommet theme={theme}>
      <Routes />
    </Grommet>
  );
}
