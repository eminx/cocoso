import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
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
import AddIcon from 'lucide-react/dist/esm/icons/plus-square';
import { useTranslation } from 'react-i18next';
import { StateContext } from '../LayoutContainer';

const getRoute = (item, index) => {
  if (item.name === 'info') {
    return '/pages/new';
  }
  return `/${item.name}/new`;
};

function NewButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { canCreateContent, currentHost, currentUser, isDesktop, role } = useContext(StateContext);
  const [tc] = useTranslation('common');
  const location = useLocation();
  const navigate = useNavigate();

  const menu = currentHost?.settings.menu;

  if (!currentUser || !canCreateContent) {
    return null;
  }

  const isAdmin = role === 'admin';

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

  const { pathname } = location;

  const isCurrentPage = (name) => {
    if (name === 'info') {
      return pathname.substring(0, 6) === '/pages';
    }
    return name === pathname?.substring(1, pathname.length);
  };

  const activeMenuItem = menuItems.find(
    (item) => isCurrentPage(item.name) && item.name !== 'people'
  );

  const getPathname = (item) => {
    if (item.name === 'calendar') {
      return '/activities/new';
    } else if (item.name === 'info') {
      return '/pages/new';
    } else if (item.name === 'communities' && currentUser?.isSuperAdmin) {
      return '/new-host';
    } else {
      return `/${item.name}/new`;
    }
  };

  if (!canCreateContent) {
    return null;
  }

  if (!activeMenuItem || ['members', 'people'].includes(activeMenuItem.name)) {
    return null;
  }

  return (
    <IconButton
      _hover={{ bg: 'brand.200' }}
      as="span"
      bg="brand.100"
      borderColor="#fff"
      borderWidth="2px"
      color="gray.800"
      cursor="pointer"
      // borderRadius="50%"
      icon={<AddIcon data-oid="7mjs0p3" />}
      mx="2"
      size={isDesktop ? 'md' : 'sm'}
      onClick={() => navigate(getPathname(activeMenuItem))}
      data-oid="xlktben"
    />
  );

  return (
    <Box zIndex={isOpen ? '1403' : '10'} ml="2" data-oid="si26xpy">
      <Menu
        isOpen={isOpen}
        placement="bottom-end"
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        data-oid="ggy9pd8"
      >
        <MenuButton data-oid=".9:1n54">
          <IconButton
            _hover={{ bg: 'brand.200' }}
            as="span"
            bg="brand.100"
            borderColor="#fff"
            borderWidth="2px"
            color="gray.800"
            // borderRadius="50%"
            icon={<AddIcon data-oid="-qbvl1e" />}
            size={isDesktop ? 'md' : 'sm'}
            data-oid="8v3rj7e"
          />
        </MenuButton>
        <MenuList zIndex={isOpen ? '1403' : '10'} data-oid="vkqoghp">
          <Text mx="4" mt="1" data-oid="8eud96-">
            {tc('labels.newPopupLabel')}:
          </Text>
          {activeMenuItem && <MenuDivider data-oid="ie0h8c1" />}
          {activeMenuItem && (
            <MenuItem
              key={activeMenuItem.name}
              color="brand.600"
              pl="5"
              onClick={() => navigate(getPathname(activeMenuItem))}
              data-oid="4ykoul_"
            >
              <Text fontWeight="bold" data-oid="m7-rqkn">
                {activeMenuItem.label}
              </Text>{' '}
              <Text pl="1" data-oid="1trlbf8">
                ({tc('labels.thislisting')})
              </Text>
            </MenuItem>
          )}
          <MenuDivider data-oid="scojgwr" />
          <Box pl="2" data-oid="2f1ie35">
            {menuItems
              .filter((itemm) => itemm.name !== 'people' && itemm.name !== activeMenuItem?.name)
              .map((item) => (
                <MenuItem
                  key={item.name}
                  color="brand.600"
                  fontWeight="bold"
                  onClick={() => navigate(getPathname(item))}
                  data-oid="z:i:7rp"
                >
                  {item.label}
                </MenuItem>
              ))}
          </Box>
        </MenuList>
      </Menu>
      {/* <Center position="relative">
         <Text fontSize="12px" lineHeight="1" position="absolute" top="3px" textAlign="center">
           {tc('actions.create')}
         </Text>
        </Center> */}
      <Modal isOpen={isOpen} data-oid="1xfqk2s">
        <ModalOverlay data-oid="y-q729:" />
      </Modal>
    </Box>
  );
}

export default NewButton;
