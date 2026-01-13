import { useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import { Box, Fade, Flex, Loader, Slide } from '/imports/ui/core';

import UserPopup from './UserPopup';
import FederationIconMenu from './FederationIconMenu';
import MenuDrawer from './MenuDrawer';

export interface TopBarHandlerProps {
  slideStart?: boolean;
}

export default function TopBarHandler({ slideStart = true }: TopBarHandlerProps) {
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
    <Slide direction="top" ping={slideStart}>
      <Fade ping={scrollTop < 120}>
        <Flex justify="space-between" w="100%">
          <Box p="1" pointerEvents="all">
            <FederationIconMenu />
          </Box>
          <Flex p="1" pointerEvents="all">
            <UserPopup isOpen={isOpen} setIsOpen={setIsOpen} />
            <MenuDrawer />
          </Flex>
        </Flex>
      </Fade>
    </Slide>
  );
}
