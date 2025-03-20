import React from 'react';
import { Box } from '@chakra-ui/react';
import { HydrationProvider } from 'react-hydration-provider';

export default function DummyWrapper({ children, animate = false, otherProps }) {
  let wrapperClass = 'wrapper';
  if (animate) {
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
