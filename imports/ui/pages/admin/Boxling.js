import React from 'react';
import { Box } from '@chakra-ui/react';

export default function Boxling({ children, ...otherProps }) {
  return (
    <Box bg="blueGray.50" p="6" borderRadius={20} {...otherProps}>
      {children}
    </Box>
  );
}
