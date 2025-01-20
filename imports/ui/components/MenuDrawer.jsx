import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Flex, IconButton, Text, VStack } from '@chakra-ui/react';
import HamburgerIcon from 'lucide-react/dist/esm/icons/menu';
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

  if (platform?.isFederationLayout && currentHost?.isPortalHost) {
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
    <Box data-oid="fbd8tmk">
      <Flex align="center" flexDirection="column" data-oid="44_zesj">
        <IconButton
          _hover={{
            bg: 'brand.500',
          }}
          bg="gray.800"
          borderColor="#fff"
          borderWidth="2px"
          icon={<HamburgerIcon fontSize="24px" data-oid="ai23j-z" />}
          size={isDesktop ? 'md' : 'sm'}
          onClick={onToggle}
          data-oid=":_:ez0a"
        />

        <Text fontSize="12px" textAlign="center" data-oid="nq1tb:y">
          {tc('menu.label')}
        </Text>
      </Flex>

      <Drawer
        bg="white"
        isOpen={isOpen}
        title={tc('menu.label')}
        titleColor="brand.900"
        onClose={onToggle}
        data-oid="7cjcqew"
      >
        <Flex flexDirection="column" h="100%" justify="space-between" data-oid="_m5ogm-">
          <MenuContent menuItems={menuItems} onToggle={onToggle} data-oid="dl3ap8w" />

          <Box color="brand.600" mt="4" data-oid="snvzfa.">
            <MenuFooter data-oid="l:0za7a" />
          </Box>
        </Flex>
      </Drawer>
    </Box>
  );
}

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
    <VStack align="flex-start" data-oid="j34t3s-">
      {menuItems.map((item) => {
        const isCurrentPageLabel = isCurrentPage(item);
        return (
          <Link
            key={item.name}
            style={{ textShadow: 'none' }}
            to={item.route}
            onClick={onToggle}
            data-oid="agu2p:w"
          >
            <Box py="1" data-oid="1-.2j-c">
              <Text
                _hover={!isCurrentPageLabel && { textDecoration: 'underline' }}
                color="brand.600"
                fontWeight={isCurrentPageLabel ? 'bold' : 'normal'}
                data-oid="uwrky-l"
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
    <Box pb="4" data-oid="xjq8:u_">
      <ChangeLanguageMenu data-oid="31dodvu" />
    </Box>
  );
}
