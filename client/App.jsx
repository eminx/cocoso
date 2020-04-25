import React from 'react';
import { Grommet } from 'grommet';

import Routes from './RouterComponents/Routes';

const theme = {
  global: {
    font: {
      family: 'Roboto, sans-serif',
      size: '16px',
      height: '24px'
    },
    colors: {
      brand: '#020202'
    }
  },
  formField: {
    border: 'none'
  }
};

export default function() {
  return (
    <Grommet theme={theme}>
      <Routes />
    </Grommet>
  );
}
