import React from 'react';
import { Box } from '@chakra-ui/react';
import { HydrationProvider } from 'react-hydration-provider';

export default function DummyWrapper({ children, isDesktop = true, otherProps }) {
  let wrapperClass = 'wrapper';
  if (!isDesktop) {
    wrapperClass += ' mobile-wrapper';
  }

  return (
    <HydrationProvider>
      <Box boxShadow="md" className={wrapperClass} id="main-content-container" {...otherProps}>
        {children}
      </Box>
    </HydrationProvider>
  );
}
