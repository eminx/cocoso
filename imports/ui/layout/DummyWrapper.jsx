import { Meteor } from 'meteor/meteor';
import React from 'react';
import { HydrationProvider } from 'react-hydration-provider';

import { Box } from '/imports/ui/core';

const isClient = Meteor.isClient;

export default function DummyWrapper({
  animate = false,
  theme,
  children,
  ...rest
}) {
  const pathname = isClient ? window?.location?.pathname : null;

  let wrapperClass = 'wrapper';
  if (animate && isClient && !pathname?.includes('admin')) {
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
