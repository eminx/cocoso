import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Center, Flex, Heading, IconButton, Text, VStack } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

import Drawer from './Drawer';
import ChangeLanguageMenu from './ChangeLanguageMenu';

const getRoute = (item, index) => {
  if (item.name === 'info') {
    return '/pages/about';
  }
  return `/${item.name}`;
};

export default function MenuDrawer({ currentHost, isDesktop }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tc] = useTranslation('common');

  const { menu } = currentHost?.settings;

  const menuItems = menu
    .filter((item) => item.isVisible)
    .map((item, index) => ({
      ...item,
      route: getRoute(item, index),
    }));

  const onToggle = () => setIsOpen(!isOpen);

  let menuClassName = 'menu-drawer';
  if (isOpen) {
    menuClassName += ' menu-drawer--open';
  }

  if (isDesktop) {
    return (
      <Box className={menuClassName} position="relative" flexGrow="0" flexShrink="0">
        <Box className={menuClassName} position="fixed" bg="gray.100" h="100vh" p="2">
          {!isOpen ? (
            <Center pt="4">
              <Flex flexDirection="column" align="center">
                <IconButton bg="none" icon={<HamburgerIcon fontSize="36px" />} onClick={onToggle} />
                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase">
                  {tc('menu.label')}
                </Text>
              </Flex>
            </Center>
          ) : (
            <Flex flexDirection="column" h="100%" justify="space-between" overflowY="auto">
              <Box pt="4">
                <Flex align="flex-start" justify="space-between">
                  <Heading fontSize="24px" px="4" mt="2">
                    {tc('menu.label')}
                  </Heading>
                  <IconButton bg="none" icon={<CloseIcon />} mr="4" onClick={onToggle} />
                </Flex>

                <Box p="4">
                  <MenuContent
                    menuItems={menuItems}
                    isPortalHost={currentHost?.isPortalHost}
                    tc={tc}
                    onToggle={onToggle}
                  />
                </Box>
              </Box>
              <Box pl="4">
                <Footer />
              </Box>
            </Flex>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Flex flexDirection="column" align="center" position="relative">
        <IconButton bg="none" icon={<HamburgerIcon fontSize="36px" />} onClick={onToggle} />
        <Text
          fontSize="12px"
          fontWeight="bold"
          position="absolute"
          top="36px"
          textTransform="uppercase"
        >
          {tc('menu.label')}
        </Text>
      </Flex>

      <Drawer isOpen={isOpen} placement="right" title={tc('menu.label')} onClose={onToggle}>
        <Flex flexDirection="column" h="100%" justify="space-between">
          <MenuContent
            menuItems={menuItems}
            isPortalHost={currentHost?.isPortalHost}
            tc={tc}
            onToggle={onToggle}
          />
          <Box mt="4">
            <Footer />
          </Box>
        </Flex>
      </Drawer>
    </Box>
  );
}

function MenuContent({ menuItems, isPortalHost, onToggle, tc }) {
  const location = useLocation();
  const { pathname } = location;

  const isCurrentPage = (item) => {
    if (item.name === 'info') {
      const pathSplitted = pathname.split('/');
      return pathSplitted && pathSplitted[1] === 'pages';
    }
    return item.route === pathname;
  };

  return (
    <VStack align="flex-start">
      {menuItems.map((item) => (
        <Link key={item.label} to={item.route} onClick={onToggle}>
          <Box py="1" _hover={{ textDecoration: 'underline' }}>
            <Text fontWeight={isCurrentPage(item) ? 'bold' : 'normal'}>{item.label}</Text>
          </Box>
        </Link>
      ))}
      {isPortalHost && (
        <Link key="/communities" to="/communities" onClick={onToggle}>
          <Box py="1" _hover={{ textDecoration: 'underline' }}>
            <Text fontWeight={pathname === '/communities' ? 'bold' : 'normal'}>
              {tc('platform.communities')}
            </Text>
          </Box>
        </Link>
      )}
    </VStack>
  );
}

function Footer() {
  return (
    <Box pb="4">
      <ChangeLanguageMenu />
    </Box>
  );
}