import React from 'react';
import { HydrationProvider } from 'react-hydration-provider';
import { useLocation } from 'react-router-dom';

import { Box } from '/imports/ui/core';

import GlobalStyles from './GlobalStyles';

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
      <GlobalStyles theme={theme} />
      <Box
        className={wrapperClass}
        id="main-content-container"
        css={{
          backgroundColor: theme?.body?.backgroundColor,
          backgroundImage: `url("${theme?.body?.backgroundImage}")`,
          backgroundRepeat: theme?.body?.backgroundRepeat,
        }}
        {...otherProps}
      >
        {children}
      </Box>
    </HydrationProvider>
  );
}
