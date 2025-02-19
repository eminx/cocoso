import React from 'react';
import { Box } from '@chakra-ui/react';
import { HydrationProvider } from 'react-hydration-provider';

export default function DummyWrapper({ children, otherProps }) {
  return (
    <HydrationProvider>
      <Box bg="gray.100" boxShadow="md" minH="100vh" mb="320px" {...otherProps}>
        {children}
      </Box>
    </HydrationProvider>
  );
}
