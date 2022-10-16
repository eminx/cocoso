import React, { useContext, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Center, Flex, Heading, Image, useMediaQuery } from '@chakra-ui/react';

import UserPopup from './UserPopup';
import { StateContext } from '../LayoutContainer';
import HeaderMenu from './HeaderMenu';

function Header() {
  const { canCreateContent, currentHost, currentUser, isDesktop } = useContext(StateContext);
  const { pathname } = useLocation();
  const logo = useRef(null);
  const [isMobile] = useMediaQuery('(max-width: 640px)');
  const hideMenu = ['/login', '/signup', '/reset-password', '/forgot-password'].includes(pathname);
  // const { name, subname } = currentHost?.settings;

  return (
    <Box p="4" w="100%">
      <Flex w="100%" align="flex-start" justify="space-between">
        <Box>
          <Link to="/">
            <Box maxHeight="80px" w="180px">
              <Image
                ref={logo}
                fit="contain"
                maxHeight="80px"
                maxWidth="180px"
                src={currentHost && currentHost.logo}
              />
            </Box>
          </Link>
        </Box>
        {!isMobile && !hideMenu && (
          <Center h="100%" mt="4">
            <HeaderMenu canCreateContent={canCreateContent} currentHost={currentHost} />
          </Center>
        )}

        <Flex w="180px" zIndex="1402" justify="flex-end" align="flex-start">
          <UserPopup currentUser={currentUser} />
        </Flex>
      </Flex>

      {isMobile && !hideMenu && (
        <Center mt="6" mb="4">
          <HeaderMenu canCreateContent={canCreateContent} currentHost={currentHost} />
        </Center>
      )}
    </Box>
  );
}

function MainHeading({ name, subname }) {
  return (
    <Box px="3">
      <Heading fontWeight="normal" mt="2" size="md" textAlign="center">
        {name}
      </Heading>
      {subname && subname.length > 0 && (
        <Heading
          size={isDesktop ? 'md' : 'sm'}
          fontWeight="light"
          textAlign={isDesktop ? 'left' : 'center'}
        >
          {subname}
        </Heading>
      )}
    </Box>
  );
}

export default Header;
