import React, { Suspense, useEffect, useState } from 'react';
import { Box, Fade, Flex, Slide } from '@chakra-ui/react';

import UserPopup from './UserPopup';
import FederationIconMenu from './FederationIconMenu';
import MenuDrawer from './MenuDrawer';
import Loader from '/imports/ui/generic/Loader';

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

  // const burgerMenuStyle = {
  //   position: 'fixed',
  //   top: isDesktop ? '72px' : '60px',
  //   right: '8px',
  // };

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
              <Suspense fallback={<Loader />}>
                <FederationIconMenu />
              </Suspense>
            </Box>
            <Flex p="1" pointerEvents="all">
              <UserPopup isOpen={isOpen} setIsOpen={setIsOpen} />
              <MenuDrawer />
            </Flex>
          </Flex>
        </Fade>
      </Slide>

      {/* <Fade in={scrollTop < 120}>
        <Box style={burgerMenuStyle}>
          <MenuDrawer in={slideStart} />
        </Box>
      </Fade> */}
    </>
  );
}
