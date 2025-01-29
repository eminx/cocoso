import React from 'react';
import { Box } from '@chakra-ui/react';

export default function DummyWrapper({ children }) {
  return (
    <Box
      minH="1800px"
      // bg="linear-gradient(0deg, var(--chakra-colors-gray-100) 0%, var(--chakra-colors-brand-50) 100%);"
      bg="gray.100"
    >
      {children}
    </Box>
  );
}
