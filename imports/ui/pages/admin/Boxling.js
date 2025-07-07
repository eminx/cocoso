import React from 'react';
import { Box } from '@chakra-ui/react';

// import { Box } from '/imports/ui/core';

const styles = {
  backgroundColor: '#F6F6F6',
  padding: '24px',
  borderRadius: 20,
  ':hover': { backgroundColor: 'white' },
};

export default function Boxling({ children, ...otherProps }) {
  return (
    <Box bg="blueGray.50" p="6" borderRadius={20} {...otherProps}>
      {children}
    </Box>
  );
}
