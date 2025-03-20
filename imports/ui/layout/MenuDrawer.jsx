import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Flex, IconButton, Text, VStack } from '@chakra-ui/react';
import HamburgerIcon from 'lucide-react/dist/esm/icons/menu';

import Drawer from '../generic/Drawer';
import ChangeLanguageMenu from './ChangeLanguageMenu';
import { StateContext } from '../LayoutContainer';

function MenuContent({ menuItems, onToggle }) {
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
      {menuItems.map((item) => {
        const isCurrentPageLabel = isCurrentPage(item);
        return (
          <Link key={item.name} style={{ textShadow: 'none' }} to={item.route} onClick={onToggle}>
            <Box py="1">
              <Text
                _hover={!isCurrentPageLabel && { textDecoration: 'underline' }}
                color="brand.600"
                fontWeight={isCurrentPageLabel ? 'bold' : 'normal'}
              >
                {item.label}
              </Text>
            </Box>
          </Link>
        );
      })}
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

const getRoute = (item) => {
  if (item.name === 'info') {
    return '/info/about';
  }
  return `/${item.name}`;
};

export default function MenuDrawer() {
  const { currentHost, isDesktop, platform } = useContext(StateContext);
  const [isOpen, setIsOpen] = useState(false);
  const [tc] = useTranslation('common');

  const settings = currentHost?.settings;
  const { isBurgerMenuOnDesktop, isBurgerMenuOnMobile } = settings || {};

  if (isDesktop && !isBurgerMenuOnDesktop) {
    return null;
  }

  if (!isDesktop && !isBurgerMenuOnMobile) {
    return null;
  }

  const menu = currentHost?.settings?.menu;

  const menuItems = menu
    ?.filter((item) => item.isVisible)
    .map((item, index) => ({
      ...item,
      route: getRoute(item, index),
    }));

  if (platform?.isFederationLayout && currentHost?.isPortalHost) {
    menuItems.push({
      name: 'communities',
      label: tc('platform.communities'),
      route: '/communities',
    });
  }

  const onToggle = () => setIsOpen(!isOpen);

  return (
    <Box>
      <Flex align="center" flexDirection="column">
        <IconButton
          _hover={{
            bg: 'gray.800',
          }}
          bg="gray.600"
          borderColor="#fff"
          borderWidth="2px"
          icon={<HamburgerIcon fontSize="24px" />}
          size={isDesktop ? 'md' : 'sm'}
          onClick={onToggle}
        />

        <Text fontSize="12px" textAlign="center">
          {tc('menu.label')}
        </Text>
      </Flex>

      <Drawer
        bg="white"
        isOpen={isOpen}
        size="sm"
        title={tc('menu.label')}
        titleColor="brand.900"
        onClose={onToggle}
      >
        <Flex flexDirection="column" h="100%" justify="space-between">
          <MenuContent menuItems={menuItems} onToggle={onToggle} />

          <Box color="brand.600" mt="4">
            <MenuFooter />
          </Box>
        </Flex>
      </Drawer>
    </Box>
  );
}
