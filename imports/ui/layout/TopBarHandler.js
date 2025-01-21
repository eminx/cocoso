import React, { useContext, useEffect, useState } from 'react';
import { Box, Fade, Flex, Slide } from '@chakra-ui/react';

import UserPopup from '../components/UserPopup';
import FederationIconMenu from './FederationIconMenu';
import { StateContext } from '../LayoutContainer';

export default function TopBarHandler({ slideStart }) {
  const { isDesktop, platform } = useContext(StateContext);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isFederationLayout = platform?.isFederationLayout;

  return (
    <>
      <Slide direction="top" in={slideStart} unmountOnExit style={{ zIndex: 1403 }}>
        {/* <Box position="relative">
        <Box bg="brand.50" position="absolute" top="0" w="100%" h="48px" zIndex={0} />
      </Box> */}
        <Fade in={scrollTop < 120}>
          <Flex justify="space-between" w="100%">
            <Box>
              <FederationIconMenu />
            </Box>
            <Box p="2">
              <UserPopup />
            </Box>
          </Flex>
        </Fade>
      </Slide>
      {!isDesktop && isFederationLayout && <Box h="48px" w="100%" />}
    </>
  );
}
