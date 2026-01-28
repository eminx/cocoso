import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Flex, Slide } from '/imports/ui/core';

// Custom throttle hook
function useThrottle(callback: (...args: any[]) => void, delay: number) {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const lastCall = useRef(0);

  // Memoize the throttled function
  const throttledFunction = useCallback(
    (...args: any[]) => {
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
  align: 'flex-start',
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

const slideProps = (slideStart: boolean) => ({
  direction: 'bottom' as const,
  ping: slideStart,
});

export interface SlideWidgetProps extends React.ComponentProps<typeof Flex> {
  children?: React.ReactNode;
}

export default function SlideWidget({
  children,
  ...otherProps
}: SlideWidgetProps) {
  const [slideStart, setSlideStart] = useState(false);
  const [position, setPosition] = useState<'fixed' | 'relative'>('fixed');
  const [widgetHeight, setWidgetHeight] = useState(0);
  const positionRef = useRef(position);
  const containerRef = useRef<number>(0);
  const initialSlideDone = useRef(false);

  // Initial slide animation
  useEffect(() => {
    setTimeout(() => {
      setSlideStart(true);
      initialSlideDone.current = true;
    }, 1200);
  }, []);

  // Sync ref with position state and retrigger slide animation when transitioning back to fixed
  useEffect(() => {
    const prevPosition = positionRef.current;
    positionRef.current = position;

    // When transitioning from relative back to fixed, retrigger the slide animation
    if (
      initialSlideDone.current &&
      prevPosition === 'relative' &&
      position === 'fixed'
    ) {
      setSlideStart(false);
      // Use requestAnimationFrame to ensure the state change is processed before retriggering
      requestAnimationFrame(() => {
        setTimeout(() => {
          setSlideStart(true);
        }, 50);
      });
    }
  }, [position]);

  useEffect(() => {
    const updateWidgetHeight = () => {
      const widget = document?.getElementById('slide-widget');
      if (widget) {
        const newWidgetHeight = widget.offsetHeight || 0;
        setWidgetHeight(newWidgetHeight);

        // Get initial container height (adjust selector as needed)
        const containerHeight = document.getElementById(
          'main-content-container'
        )?.offsetHeight;
        if (containerHeight) {
          containerRef.current =
            containerHeight - (window.innerHeight - newWidgetHeight);
        }
      }
    };

    // Initial measurement - wait for widget to be rendered and slide animation to complete
    const timer = setTimeout(() => {
      updateWidgetHeight();
    }, 1800); // Wait for slide animation (1200ms) + some buffer

    // Update on resize
    window.addEventListener('resize', updateWidgetHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateWidgetHeight);
    };
  }, []);

  // Memoize scroll handler with useCallback
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const threshold = containerRef.current || 0;

    if (scrollTop > threshold) {
      if (positionRef.current !== 'relative') {
        setPosition('relative');
      }
    } else {
      if (positionRef.current !== 'fixed') {
        setPosition('fixed');
      }
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
      <Slide
        id="slide-widget"
        {...slideProps(slideStart)}
        style={{
          position: position === 'fixed' ? 'fixed' : 'relative',
          bottom: position === 'fixed' ? 0 : 'auto',
          width: '100%',
          zIndex: 1000,
          left: 0,
          right: 0,
        }}
      >
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
