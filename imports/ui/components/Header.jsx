import React, { useContext, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Box, Flex, Heading, HStack, Image, useMediaQuery } from '@chakra-ui/react';

import UserPopup from './UserPopup';
import { StateContext } from '../LayoutContainer';
import NewButton from './NewButton';
import MenuDrawer from './MenuDrawer';

const getRoute = (item, index) => {
  if (index === 0) {
    return '/';
  }
  if (item.name === 'info') {
    return '/pages/about';
  }
  return `/${item.name}`;
};

function Header() {
  const { canCreateContent, currentHost, currentUser, isDesktop } = useContext(StateContext);
  const history = useHistory();
  // const { name, subname } = currentHost?.settings;

  const { menu } = currentHost?.settings;
  const menuItems = menu
    .filter((item) => item.isVisible)
    .map((item, index) => ({
      ...item,
      route: getRoute(item, index),
    }));

  const pathname = history.location.pathname;
  const isCurrentPage = (name) => {
    if (name === 'info') {
      return pathname.substring(0, 6) === '/pages';
    }
    return name === pathname.substring(1, pathname.length);
  };

  const activeMenuItem = menuItems.find((item) => isCurrentPage(item.name));

  const currentHostName = currentHost?.settings?.name;

  return (
    <Box p="4" w="100%">
      <Flex w="100%" align="flex-start" justify="space-between">
        <Box>
          <Link to="/">
            <Box maxHeight="80px" w="180px">
              <Image
                fit="contain"
                maxHeight="80px"
                maxWidth="160px"
                src={currentHost && currentHost.logo}
              />
            </Box>
          </Link>
        </Box>

        <HStack align="center" justify="flex-end" spacing="4" zIndex="1403">
          <NewButton canCreateContent={canCreateContent} currentHost={currentHost} />
          <UserPopup currentUser={currentUser} />
          {!isDesktop && <MenuDrawer currentHost={currentHost} isDesktop={false} />}
        </HStack>
      </Flex>

      <Box pb="4" pt="12">
        <Heading color="gray.800" size="lg">
          {currentHostName} / {activeMenuItem?.label}
        </Heading>
      </Box>
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
