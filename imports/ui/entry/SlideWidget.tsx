import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Flex, Slide } from '/imports/ui/core';

const NEAR_BOTTOM_THRESHOLD = 160; // px from page bottom before widget hides
const WIDGET_HEIGHT = 86; // matches minHeight in flexProps

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
    minHeight: `${WIDGET_HEIGHT}px`,
  },
};

export interface SlideWidgetProps extends React.ComponentProps<typeof Flex> {
  children?: React.ReactNode;
}

export default function SlideWidget({
  children,
  ...otherProps
}: SlideWidgetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const initialDoneRef = useRef(false);
  const isVisibleRef = useRef(false);

  const checkNearBottom = () =>
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - NEAR_BOTTOM_THRESHOLD;

  // Initial slide-up after 1200ms, but only if not already at the bottom
  useEffect(() => {
    const timer = setTimeout(() => {
      initialDoneRef.current = true;
      if (!checkNearBottom()) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Scroll: slide down when near footer, slide up when scrolling back
  const handleScroll = useCallback(() => {
    if (!initialDoneRef.current) return;
    const nearBottom = checkNearBottom();
    if (nearBottom && isVisibleRef.current) {
      isVisibleRef.current = false;
      setIsVisible(false);
    } else if (!nearBottom && !isVisibleRef.current) {
      isVisibleRef.current = true;
      setIsVisible(true);
    }
  }, []);

  // Throttle scroll to 100ms
  const rafRef = useRef<number | null>(null);
  const throttledScroll = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      handleScroll();
    });
  }, [handleScroll]);

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [throttledScroll]);

  return (
    <>
      {/* .cocoso-slide already sets position:fixed — no style override needed */}
      <Slide id="slide-widget" direction="bottom" ping={isVisible}>
        <Flex {...flexProps} {...otherProps}>
          {children}
        </Flex>
      </Slide>
      {/* Permanent spacer — widget is always fixed so this space is always needed */}
      <div style={{ height: `${WIDGET_HEIGHT}px`, width: '100%' }} />
    </>
  );
}
