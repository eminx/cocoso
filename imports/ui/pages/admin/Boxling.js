import React from 'react';

import { Box } from '/imports/ui/core';

const styles = {
  backgroundColor: '#F6F6F6',
  padding: '24px',
  borderRadius: 20,
  ':hover': { backgroundColor: 'white' },
};

export default function Boxling({ children, ...otherProps }) {
  return (
    <Box css={styles} {...otherProps}>
      {children}
    </Box>
  );
}
