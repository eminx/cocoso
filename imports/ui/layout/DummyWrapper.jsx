import React from 'react';
import { HydrationProvider } from 'react-hydration-provider';
import { useLocation } from 'react-router-dom';

import { Box } from '/imports/ui/core';

export default function DummyWrapper({
  animate = false,
  theme,
  children,
  ...rest
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
        className={wrapperClass}
        id="main-content-container"
        css={{
          backgroundColor: theme?.body?.backgroundColor,
          backgroundImage: `url("${theme?.body?.backgroundImage}")`,
          backgroundRepeat: theme?.body?.backgroundRepeat,
        }}
        {...rest}
      >
        {children}
      </Box>
    </HydrationProvider>
  );
}
