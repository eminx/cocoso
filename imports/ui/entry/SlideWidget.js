import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Flex, Slide } from '/imports/ui/core';

// Custom throttle hook
function useThrottle(callback, delay) {
  const timeoutId = useRef(null);
  const lastCall = useRef(0);

  // Memoize the throttled function
  const throttledFunction = useCallback(
    (...args) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCall.current;

      // Immediate execution if enough time has passed
      if (timeSinceLastCall >= delay) {
        lastCall.current = now;
        callback(...args);
      } else {
        // Clear existing timeout and schedule new one
        clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(() => {
          lastCall.current = Date.now();
          callback(...args);
        }, delay - timeSinceLastCall);
      }
    },
    [callback, delay]
  );

  // Cleanup method to cancel pending timeouts
  const cancel = useCallback(() => {
    clearTimeout(timeoutId.current);
  }, []);

  return { throttledFunction, cancel };
}

const flexProps = {
  align: 'center',
  bg: 'theme.900',
  justify: 'center',
  p: '4',
  pb: '2',
  css: {
    borderTop: '1px solid',
    borderTopColor: 'var(--cocoso-colors-gray-400)',
    width: '100%',
    minHeight: '86px',
  },
};

const slideProps = (slideStart) => ({
  direction: 'bottom',
  ping: slideStart,
});

export default function SlideWidget({ slideStart, children, ...otherProps }) {
  const [position, setPosition] = useState('fixed');
  const [widgetHeight, setWidgetHeight] = useState(0);
  const positionRef = useRef(position);
  const containerRef = useRef();

  // Sync ref with position state
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    const newWidgetHeight =
      document?.getElementById('slide-widget')?.offsetHeight || 0;
    setWidgetHeight(newWidgetHeight);

    // Get initial container height (adjust selector as needed)
    const containerHeight = document.getElementById(
      'main-content-container'
    )?.offsetHeight;
    containerRef.current =
      containerHeight - (window.innerHeight - newWidgetHeight);
  }, []);

  // Memoize scroll handler with useCallback
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const threshold = containerRef.current || 0;

    if (scrollTop > threshold) {
      setPosition('relative');
    } else {
      setPosition('fixed');
    }
  }, []);

  // Get throttled functions
  const { throttledFunction, cancel } = useThrottle(handleScroll, 100);

  // Setup scroll listener
  useEffect(() => {
    window.addEventListener('scroll', throttledFunction);

    // Cleanup: remove listener and cancel pending calls
    return () => {
      window.removeEventListener('scroll', throttledFunction);
      cancel();
    };
  }, [throttledFunction, cancel]);

  return (
    <>
      <Slide id="slide-widget" {...slideProps(slideStart)}>
        <Flex {...flexProps} {...otherProps}>
          {children}
        </Flex>
      </Slide>
      {position === 'fixed' ? (
        <div style={{ height: `${widgetHeight}px`, width: '100%' }} />
      ) : null}
    </>
  );
}
