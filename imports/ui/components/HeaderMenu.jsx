import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  HStack,
  Menu as CMenu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Wrap,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

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

  if (isDesktop) {
    return (
      <Wrap align="center" bg="gray.100" py="2" px="4" spacing="4">
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
            <Text textTransform="uppercase" fontWeight="bold">
              {activeMenuItem ? activeMenuItem.label : 'Menu'}
            </Text>
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
