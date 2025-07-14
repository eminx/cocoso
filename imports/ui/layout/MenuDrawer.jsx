import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HamburgerIcon from 'lucide-react/dist/esm/icons/menu';

import {
  Box,
  Drawer,
  Flex,
  IconButton,
  Text,
  VStack,
} from '/imports/ui/core';

import ChangeLanguageMenu from './ChangeLanguageMenu';
import { StateContext } from '../LayoutContainer';
import { InfoPagesMenu } from './Header';

function MenuContent({ menuItems, pageTitles, styles, onToggle }) {
  const location = useLocation();
  const { pathname } = location;

  const isCurrentPage = (item) => {
    if (item.name === 'info') {
      const pathSplitted = pathname.split('/');
      return pathSplitted && pathSplitted[1] === 'pages';
    }
    if (pathname === '/') {
      return item.route === menuItems[0]?.route;
    }
    return item.route === pathname;
  };

  return (
    <VStack
      align="flex-start"
      style={{ ...styles, padding: '1rem', width: '100%' }}
    >
      {menuItems.map((item) => {
        const isCurrentPageLabel = isCurrentPage(item);
        if (item.name === 'info') {
          return (
            <Box py="2" key="info">
              <InfoPagesMenu
                label={item.label}
                pageTitles={pageTitles}
                pathname={pathname}
              />
            </Box>
          );
        }
        return (
          <Link
            key={item.name}
            style={{ textShadow: 'none' }}
            to={item.route}
            onClick={onToggle}
          >
            <Box p="2">
              <Text
                _hover={
                  !isCurrentPageLabel && { textDecoration: 'underline' }
                }
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
  const { currentHost, isDesktop, pageTitles, platform } =
    useContext(StateContext);
  const [isOpen, setIsOpen] = useState(false);
  const [tc] = useTranslation('common');

  const settings = currentHost?.settings;
  const { isBurgerMenuOnDesktop, isBurgerMenuOnMobile } =
    settings || {};

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

  const menuStyles = currentHost?.theme?.menu;

  const onToggle = () => setIsOpen(!isOpen);

  return (
    <Box>
      <Flex align="center" flexDirection="column" px="2">
        <IconButton
          icon={<HamburgerIcon fontSize="24px" />}
          size={isDesktop ? 'md' : 'sm'}
          variant="outline"
          onClick={onToggle}
        />

        <Text style={{ fontSize: '12px' }} textAlign="center">
          {tc('menu.label')}
        </Text>
      </Flex>

      <Drawer
        open={isOpen}
        styles={{ backgroundColor: 'var(--cocoso-colors-theme-100)' }}
        title={tc('menu.label')}
        onClose={onToggle}
      >
        <Flex flexDirection="column" h="100%" justify="space-between">
          <MenuContent
            menuItems={menuItems}
            styles={menuStyles}
            pageTitles={pageTitles}
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
