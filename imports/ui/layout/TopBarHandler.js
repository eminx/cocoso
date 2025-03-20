import React, { useEffect, useState } from 'react';
import { Box, Fade, Flex, Slide } from '@chakra-ui/react';

import UserPopup from './UserPopup';
import FederationIconMenu from './FederationIconMenu';

export default function TopBarHandler({ slideStart }) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Slide
        direction="top"
        in={slideStart}
        unmountOnExit
        style={{ zIndex: isOpen ? 2 : 1, pointerEvents: 'none' }}
      >
        <Fade in={scrollTop < 120}>
          <Flex justify="space-between" w="100%">
            <Box p="1" pointerEvents="all">
              <FederationIconMenu />
            </Box>
            <Box p="1" pointerEvents="all">
              <UserPopup isOpen={isOpen} setIsOpen={setIsOpen} />
            </Box>
          </Flex>
        </Fade>
      </Slide>
    </>
  );
}
