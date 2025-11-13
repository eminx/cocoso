import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useLocation } from 'react-router';
import { useAtomValue } from 'jotai';

import { currentHostAtom } from '/imports/state';
import { Box } from '/imports/ui/core';

const isClient = Meteor.isClient;

export default function DummyWrapper({
  animate = false,
  theme,
  children,
  ...rest
}) {
  const location = useLocation();
  const pathname = location?.pathname;

  let wrapperClass = 'wrapper';
  if (animate && isClient && !pathname?.includes('admin')) {
    wrapperClass += ' mobile-wrapper';
  }

  return (
    <Box
      className={wrapperClass}
      css={{
        backgroundColor: theme?.body?.backgroundColor,
        backgroundImage: `url("${theme?.body?.backgroundImage}")`,
        backgroundRepeat: theme?.body?.backgroundRepeat,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}
