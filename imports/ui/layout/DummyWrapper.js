import React from 'react';
import { Box } from '@chakra-ui/react';

export default function DummyWrapper({ children }) {
  return (
    <Box
      bg="linear-gradient(0deg, var(--chakra-colors-purple-100) 0%, var(--chakra-colors-brand-100) 100%);"
      // bg="gray.100"
      boxShadow="sm"
      minH="110vh"
      mb="148px"
    >
      {children}
    </Box>
  );
}
