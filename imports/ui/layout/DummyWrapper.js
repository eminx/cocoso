import React from 'react';
import { Box } from '@chakra-ui/react';

export default function DummyWrapper({ children }) {
  return (
    <Box
      minH="1800px"
      bg="linear-gradient(0deg, var(--chakra-colors-brand-50) 0%, rgba(255, 255, 255, 1) 100%);"
    >
      {children}
    </Box>
  );
}
