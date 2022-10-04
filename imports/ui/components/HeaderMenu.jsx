import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalOverlay,
  Menu as CMenu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon, AddIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

const getRoute = (item, index) => {
  if (index === 0) {
    return '/';
  }
  if (item.name === 'info') {
    return '/pages/about';
  }
  return `/${item.name}`;
};

function HeaderMenu({ canCreateContent, currentHost, isDesktop }) {
  const menu = currentHost.settings.menu;
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [tc] = useTranslation('common');

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

  const getPathname = () => {
    if (activeMenuItem.name === 'calendar') {
      return '/activities/new';
    } else if (activeMenuItem.name === 'info') {
      return '/pages/new';
    } else {
      return `/${activeMenuItem.name}/new`;
    }
  };

  const showNewButton = canCreateContent && activeMenuItem && activeMenuItem.name !== 'members';

  return (
    <Box zIndex="1401">
      <Flex align="center">
        <CMenu placement="bottom" onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
          <MenuButton aria-label="Options" variant="outline">
            <Flex align="flex-end">
              <HamburgerIcon fontSize="40px" mr="2" mb="-1px" />
              <Heading size="xl">{activeMenuItem ? activeMenuItem.label : 'Menu'}</Heading>
            </Flex>
          </MenuButton>
          <MenuList>
            {menuItems.map((item) => (
              <Link key={item.label} to={item.route}>
                <MenuItem px="4" py="3">
                  <Text fontSize="2xl">{item.label}</Text>
                </MenuItem>
              </Link>
            ))}
          </MenuList>
        </CMenu>
        {showNewButton && (
          <Link to={getPathname()}>
            <Flex direction="column" align="center" ml="4" position="relative">
              <IconButton
                colorScheme="gray.900"
                icon={<AddIcon fontSize="xl" />}
                variant="outline"
                borderRadius="50%"
                borderWidth="2px"
              />
              <Text fontSize="sm" position="absolute" top="2.5rem" textTransform="uppercase">
                {tc('actions.create')}
              </Text>
            </Flex>
          </Link>
        )}
      </Flex>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
      </Modal>
    </Box>
  );
}

export default HeaderMenu;
