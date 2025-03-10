import React, { useEffect, useState } from 'react';
import { Flex, Slide } from '@chakra-ui/react';

const flexProps = {
  align: 'flex-start',
  // bg: 'rgba(50, 48, 45, .95)',
  bg: 'brand.900',
  borderTop: '1px solid',
  borderTopColor: 'gray.400',
  justify: 'center',
  minH: '86px',
  p: '4',
  pb: '2',
  width: '100%',
};

const slideProps = (slideStart) => ({
  direction: 'bottom',
  in: slideStart,
  unmountOnExit: true,
});

export default function SlideWidget({ slideStart, children, ...otherProps }) {
  const [position, setPosition] = useState('fixed');

  const contentContainer = document?.getElementById('main-content-container');
  const contentContainerHeight = contentContainer.offsetHeight;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > contentContainerHeight - 620) {
        if (position === 'relative') {
          return;
        }
        setPosition('relative');
      } else {
        setPosition('fixed');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Slide {...slideProps(slideStart)} style={{ zIndex: 10, position }}>
      <Flex {...flexProps} {...otherProps}>
        {children}
      </Flex>
    </Slide>
  );
}
