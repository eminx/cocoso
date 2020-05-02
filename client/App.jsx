import React from 'react';
import { Grommet } from 'grommet';

import Routes from './RouterComponents/Routes';

const theme = {
  spacing: 12,
  global: {
    font: {
      family: 'sans-serif',
      size: '15px',
      height: '24px'
    },
    colors: {
      brand: '#020202',
      focus: 'rgba(0, 0, 0, .4)'
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
