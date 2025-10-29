import { useTracker } from 'meteor/react-meteor-data';
import React, { Suspense, useEffect, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import { Box, Fade, Flex, Loader, Slide } from '/imports/ui/core';
import { currentUserAtom, roleAtom } from '/imports/state';

import UserPopup from './UserPopup';
import FederationIconMenu from './FederationIconMenu';
import MenuDrawer from './MenuDrawer';

export default function TopBarHandler({ slideStart = true }) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useTracker(() => Meteor.user(), []);
  const setCurrentUser = useSetAtom(currentUserAtom);
  const setRole = useSetAtom(roleAtom);

  useEffect(() => {
    setCurrentUser(currentUser);
    const hostWithinUser = currentUser?.memberships?.find(
      (membership) => membership?.host === window.location.host
    );
    setRole(hostWithinUser?.role || null);
  }, [currentUser]);

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
  );
}
