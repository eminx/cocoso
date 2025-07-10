import React from 'react';
import { Box } from '@chakra-ui/react';
import { HydrationProvider } from 'react-hydration-provider';
import { useLocation } from 'react-router-dom';

export default function DummyWrapper({
  animate = false,
  theme,
  children,
  otherProps,
}) {
  const location = useLocation();
  const pathname = location?.pathname;

  let wrapperClass = 'wrapper';
  if (animate && !pathname.includes('admin')) {
    wrapperClass += ' mobile-wrapper';
  }

  return (
    <HydrationProvider>
      <Box
        backgroundColor={theme?.body?.backgroundColor}
        backgroundImage={theme?.body?.backgroundImage}
        backgroundRepeat={theme?.body?.backgroundRepeat}
        boxShadow="md"
        className={wrapperClass}
        id="main-content-container"
        {...otherProps}
      >
        {children}
      </Box>
    </HydrationProvider>
  );
}
