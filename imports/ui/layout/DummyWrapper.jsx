import { Meteor } from 'meteor/meteor';
import React from 'react';
import { HydrationProvider } from 'react-hydration-provider';
import { useAtomValue } from 'jotai';

import { Box } from '/imports/ui/core';
import { currentHostAtom } from '/imports/state';

const isClient = Meteor.isClient;

export default function DummyWrapper({ animate = false, children, ...rest }) {
  const currentHost = useAtomValue(currentHostAtom);
  const theme = currentHost?.theme;
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
