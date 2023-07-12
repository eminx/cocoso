import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Center,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

const getRoute = (item, index) => {
  if (item.name === 'info') {
    return '/pages/new';
  }
  return `/${item.name}/new`;
};

function NewButton({ canCreateContent, currentHost, isAdmin }) {
  const menu = currentHost.settings.menu;
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [tc] = useTranslation('common');

  const menuItems = menu
    .filter((item) => {
      if (isAdmin) {
        return item.isVisible;
      } else {
        return item.isVisible && !['info', 'resources'].includes(item.name);
      }
    })
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

  const activeMenuItem = menuItems.find(
    (item) => isCurrentPage(item.name) && item.name !== 'members'
  );

  const getPathname = (item) => {
    if (item.name === 'calendar') {
      return '/activities/new';
    } else if (item.name === 'info') {
      return '/pages/new';
    } else {
      return `/${item.name}/new`;
    }
  };

  if (!canCreateContent) {
    return null;
  }

  return (
    <Box>
      <Menu
        isOpen={isOpen}
        placement="bottom-end"
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      >
        <MenuButton
          _hover={{ bg: 'brand.500' }}
          as={IconButton}
          bg="brand.600"
          borderColor="#fff"
          borderRadius="8px"
          borderWidth="2px"
          h="48px"
          icon={<AddIcon color="brand.50" />}
          w="48px"
        />
        <MenuList>
          <Text mx="4" mt="1">
            {tc('labels.newPopupLabel')}:
          </Text>
          {activeMenuItem && <MenuDivider />}
          {activeMenuItem && (
            <MenuItem
              key={activeMenuItem.name}
              pl="5"
              onClick={() => history.push(getPathname(activeMenuItem))}
            >
              <Text fontWeight="bold" textTransform="capitalize">
                {activeMenuItem.label}
              </Text>{' '}
              <Text pl="1">({tc('labels.thislisting')})</Text>
            </MenuItem>
          )}
          <MenuDivider />
          <Box pl="2">
            {menuItems
              .filter((itemm) => itemm.name !== 'members' && itemm.name !== activeMenuItem?.name)
              .map((item) => (
                <MenuItem
                  key={item.name}
                  fontWeight="bold"
                  textTransform="capitalize"
                  onClick={() => history.push(getPathname(item))}
                >
                  {item.label}
                </MenuItem>
              ))}
          </Box>
        </MenuList>
      </Menu>
      <Center position="relative">
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="brand.800"
          position="absolute"
          textAlign="center"
          textTransform="uppercase"
          top="-1px"
        >
          {tc('actions.create')}
        </Text>
      </Center>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
      </Modal>
    </Box>
  );
}

export default NewButton;
