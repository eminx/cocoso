import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import HamburgerIcon from 'lucide-react/dist/esm/icons/menu';
import { useAtomValue } from 'jotai';

import { Box, Drawer, Flex, IconButton, Text } from '/imports/ui/core';

import ChangeLanguageMenu from './ChangeLanguageMenu';
import {
  currentHostAtom,
  isDesktopAtom,
  pageTitlesAtom,
  platformAtom,
} from '../../state';
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
    <Flex
      align="flex-start"
      direction="column"
      p="2"
      css={{ ...styles, width: '100%' }}
    >
      {menuItems.map((item) => {
        const isCurrentPageLabel = isCurrentPage(item);
        if (item.name === 'info') {
          return (
            <Box key="info" pt="2">
              <InfoPagesMenu
                label={item.label}
                menuStyles={styles}
                pageTitles={pageTitles}
                pathname={pathname}
                onSelect={onToggle}
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
                css={{
                  color: styles.color,
                  fontStyle: styles.fontStyle,
                  fontWeight: isCurrentPageLabel ? 'bold' : 'normal',
                  textTransform: styles.textTransform,
                }}
                _hover={
                  !isCurrentPageLabel ? { textDecoration: 'underline' } : null
                }
              >
                {item.label}
              </Text>
            </Box>
          </Link>
        );
      })}
    </Flex>
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
  if (item.isComposablePage) {
    return `/cp/${item.name}`;
  }
  if (item.name === 'info') {
    return '/info/about';
  }
  return `/${item.name}`;
};

export default function MenuDrawer() {
  const currentHost = useAtomValue(currentHostAtom);
  const pageTitles = useAtomValue(pageTitlesAtom);
  const isDesktop = useAtomValue(isDesktopAtom);
  const platform = useAtomValue(platformAtom);

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

  const menuStyles = currentHost?.theme?.menu;

  const onToggle = () => setIsOpen(!isOpen);

  return (
    <Box>
      <Flex align="center" direction="column" gap="1" px="2">
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
        <Flex
          id="flex-menu"
          direction="column"
          height="100%"
          justify="space-between"
        >
          <MenuContent
            menuItems={menuItems}
            styles={menuStyles}
            pageTitles={pageTitles}
            onToggle={onToggle}
          />

          <Box color="theme.600" mt="4">
            <MenuFooter />
          </Box>
        </Flex>
      </Drawer>
    </Box>
  );
}
