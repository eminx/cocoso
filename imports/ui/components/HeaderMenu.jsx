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

function HeaderMenu({ currentHost, isMobile, screenClass }) {
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

  if (['lg', 'xl', 'xxl'].includes(screenClass)) {
    return (
      <Wrap align="center" pt="lg" spacing="4">
        {menuItems.map((item) => (
          <Box as="button" key={item.name} onClick={() => handleClick(item)}>
            <Text
              borderBottom={
                activeMenuItem && activeMenuItem.label === item.label ? '1px solid #010101' : 'none'
              }
              mx="1"
              textTransform="capitalize"
            >
              {item.label}
            </Text>
          </Box>
        ))}
      </Wrap>
    );
  }

  return (
    <Box align="center">
      <CMenu placement="bottom" closeOnSelect>
        <MenuButton>
          <HStack>
            <Text textTransform="capitalize">{activeMenuItem ? activeMenuItem.label : 'Menu'}</Text>
            <ChevronDownIcon />
          </HStack>
        </MenuButton>
        <MenuList>
          {menuItems.map((item) => (
            <MenuItem key={item.label} onClick={() => handleClick(item)}>
              {item.label}
            </MenuItem>
          ))}
        </MenuList>
      </CMenu>
    </Box>
  );
}

export default HeaderMenu;
