import React, { Suspense, useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import { Fade, Slide } from '/imports/ui/core';

import UserPopup from './UserPopup';
import FederationIconMenu from './FederationIconMenu';
import MenuDrawer from './MenuDrawer';
import Loader from '../core/Loader';

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
        // direction="top"
        ping={slideStart}
        unmountOnExit
        // style={{ zIndex: isOpen ? 2 : 1, pointerEvents: 'none' }}
      >
        {/* <Fade in={scrollTop < 120}> */}
        <Flex justify="space-between" w="100%">
          <Box p="1" pointerEvents="all">
            <Suspense fallback={<Loader />}>
              <FederationIconMenu />
            </Suspense>
          </Box>
          <Flex p="1" pointerEvents="all">
            <UserPopup isOpen={isOpen} setIsOpen={setIsOpen} />
            <MenuDrawer />
          </Flex>
        </Flex>
        {/* </Fade> */}
      </Slide>
    </>
  );
}
