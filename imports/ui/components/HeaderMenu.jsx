import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalOverlay,
  Menu as CMenu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Wrap,
} from '@chakra-ui/react';
import { ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';

const getRoute = (item, index) => {
  if (index === 0) {
    return '/';
  }
  if (item.name === 'info') {
    return '/pages/about';
  }
  return `/${item.name}`;
};

const activeMenuItemStyle = {
  borderBottom: '2px solid #010101',
  // fontWeight: 'bold',
};

function HeaderMenu({ currentHost, isDesktop }) {
  const menu = currentHost.settings.menu;
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = menu
    .filter((item) => item.isVisible)
    .map((item, index) => ({
      ...item,
      route: getRoute(item, index),
    }));

  const pathname = history.location.pathname;

  const handleClick = (item) => {
    history.push(item.route);
  };

  const isCurrentPage = (name) => {
    if (name === 'info') {
      return pathname.substring(0, 6) === '/pages';
    }
    return name === pathname.substring(1, pathname.length);
  };

  const activeMenuItem = menuItems.find((item) => isCurrentPage(item.name));

  return (
    <Box zIndex="1500">
      <CMenu onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
        <MenuButton aria-label="Options" variant="outline">
          <Flex align="flex-end">
            <HamburgerIcon fontSize="40px" mr="2" />
            <Heading size="xl">{activeMenuItem ? activeMenuItem.label : 'Menu'}</Heading>
          </Flex>
        </MenuButton>
        <MenuList>
          {menuItems.map((item) => (
            <MenuItem key={item.label} px="4" py="3" onClick={() => handleClick(item)}>
              <Text fontSize="2xl">{item.label}</Text>
            </MenuItem>
          ))}
        </MenuList>
      </CMenu>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
      </Modal>
    </Box>
  );

  if (isDesktop) {
    return (
      <Wrap align="center" py="2" px="4" spacing="4">
        {menuItems.map((item) => (
          <Box as="button" key={item.name} onClick={() => handleClick(item)}>
            <Text
              style={
                activeMenuItem && activeMenuItem.label === item.label ? activeMenuItemStyle : null
              }
              textTransform="uppercase"
            >
              {item.label}
            </Text>
          </Box>
        ))}
      </Wrap>
    );
  }

  return (
    <Box align="center" zIndex={10}>
      <CMenu placement="bottom" closeOnSelect>
        <MenuButton>
          <HStack>
            <Text textTransform="uppercase">{activeMenuItem ? activeMenuItem.label : 'Menu'}</Text>
            <ChevronDownIcon />
          </HStack>
        </MenuButton>
        <MenuList>
          {menuItems.map((item) => (
            <MenuItem key={item.label} textTransform="uppercase" onClick={() => handleClick(item)}>
              {item.label}
            </MenuItem>
          ))}
        </MenuList>
      </CMenu>
    </Box>
  );
}

export default HeaderMenu;
