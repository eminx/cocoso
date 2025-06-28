import React from 'react';
import { Box } from '@chakra-ui/react';
import { HydrationProvider } from 'react-hydration-provider';
import { useLocation } from 'react-router-dom';

export default function DummyWrapper({
  animate = false,
  style,
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
        backgroundColor={style?.body?.backgroundColor}
        backgroundImage={style?.body?.backgroundImage}
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
