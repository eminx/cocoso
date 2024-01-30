import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Center,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
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

export default function MenuDrawer({ currentHost, isDesktop, platform }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tc] = useTranslation('common');

  const { menu } = currentHost?.settings;

  const menuItems = menu
    .filter((item) => item.isVisible)
    .map((item, index) => ({
      ...item,
      route: getRoute(item, index),
    }));

  if (platform?.showCommunitiesInMenu && currentHost?.isPortalHost) {
    menuItems.push({
      name: 'communities',
      label: tc('platform.communities'),
      route: '/communities',
    });
  }

  const onToggle = () => setIsOpen(!isOpen);

  let menuClassName = 'menu-drawer';
  if (isOpen) {
    menuClassName += ' menu-drawer--open';
  }

  return (
    <Box>
      <Flex align="center" flexDirection="column">
        <IconButton
          _hover={{
            bg: 'brand.500',
          }}
          bg="gray.800"
          borderColor="#fff"
          borderWidth="2px"
          icon={<HamburgerIcon fontSize="24px" />}
          size={isDesktop ? 'md' : 'sm'}
          onClick={onToggle}
        />
        <Text fontSize="12px" textAlign="center" textTransform="uppercase">
          {tc('menu.label')}
        </Text>
      </Flex>

      <Drawer
        bg="white"
        isOpen={isOpen}
        placement={isDesktop ? 'left' : 'right'}
        title={tc('menu.label')}
        titleColor="brand.900"
        onClose={onToggle}
      >
        <Flex flexDirection="column" h="100%" justify="space-between">
          <MenuContent
            currentHost={currentHost}
            menuItems={menuItems}
            platform={platform}
            tc={tc}
            onToggle={onToggle}
          />
          <Box color="brand.600" mt="4">
            <MenuFooter />
          </Box>
        </Flex>
      </Drawer>
    </Box>
  );
}

function MenuContent({ currentHost, menuItems, platform, tc, onToggle }) {
  const location = useLocation();
  const { pathname } = location;

  const isCurrentPage = (item) => {
    if (item.name === 'info') {
      const pathSplitted = pathname.split('/');
      return pathSplitted && pathSplitted[1] === 'pages';
    }
    return item.route === pathname;
  };

  const showPlatformItems = platform?.isFederationLayout && currentHost.isPortalHost;

  return (
    <VStack align="flex-start">
      {/* <Text color="brand.900" fontSize="xs" mt="2">
        <em>{currentHost?.settings?.name}</em>
      </Text> */}

      {menuItems.map((item) => {
        const isCurrentPageLabel = isCurrentPage(item);
        return (
          <Link key={item.name} style={{ textShadow: 'none' }} to={item.route} onClick={onToggle}>
            <Box py="1">
              <Text
                _hover={!isCurrentPageLabel && { textDecoration: 'underline' }}
                // color={isCurrentPageLabel ? 'brand' : 'brand.50'}
                color="brand.600"
                fontWeight={isCurrentPageLabel ? 'bold' : 'normal'}
              >
                {item.label}
              </Text>
            </Box>
          </Link>
        );
      })}
      {showPlatformItems && (
        <Link
          key="/communities"
          style={{ textShadow: 'none' }}
          to="/communities"
          onClick={onToggle}
        >
          <Box py="1">
            <Text
              _hover={{ textDecoration: 'underline' }}
              color="brand.600"
              fontWeight={pathname === '/communities' ? 'bold' : 'normal'}
            >
              {tc('platform.communities')}
            </Text>
          </Box>
        </Link>
      )}
    </VStack>
  );
}

function MenuFooter() {
  return (
    <Box pb="4">
      <ChangeLanguageMenu />
    </Box>
  );
}
