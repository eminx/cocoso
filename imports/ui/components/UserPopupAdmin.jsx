import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Modal,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

import { StateContext } from '../LayoutContainer';
import { adminMenu, superadminMenu } from '../utils/constants/general';

function UserPopupAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [tc] = useTranslation('common');
  const { currentHost, currentUser, isDesktop, platform } = useContext(StateContext);

  const isSuperAdmin = currentUser && currentUser.isSuperAdmin;
  const { isPortalHost } = currentHost;

  return (
    <Box pt="2">
      <Menu placement="bottom-end" onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
        <MenuButton position="relative" zIndex={isOpen ? '1403' : '10'}>
          <IconButton
            bg="gray.800"
            borderColor="#fff"
            borderWidth="2px"
            icon={<SettingsIcon fontSize="lg" />}
            // isRound
            size={isDesktop ? 'md' : 'sm'}
          />
          <Text
            fontSize="12px"
            position="absolute"
            top={isDesktop ? '2.5rem' : '2rem'}
            textTransform="uppercase"
          >
            Admin
          </Text>
        </MenuButton>
        <MenuList zIndex={isOpen ? '1403' : '10'}>
          <MenuGroup>
            <Box px="4" py="1">
              <Text fontWeight="bold" fontSize="lg">
                {currentHost?.settings?.name}
              </Text>
            </Box>
          </MenuGroup>

          <MenuGroup>
            <Box px="1">
              {adminMenu.map((item) => (
                <Link key={item.key} to={item.value}>
                  <MenuItem color="brand.700">{tc(`menu.admin.${item.key}`)}</MenuItem>
                </Link>
              ))}
            </Box>
          </MenuGroup>

          {isSuperAdmin && isPortalHost && <MenuDivider />}
          {isSuperAdmin && isPortalHost && (
            <MenuGroup title={platform?.name + ' ' + tc('domains.platform')}>
              <Box px="1">
                {superadminMenu.map((item) => (
                  <Link key={item.key} to={item.value}>
                    <MenuItem color="brand.700">{tc(`menu.admin.${item.key}`)}</MenuItem>
                  </Link>
                ))}
              </Box>
            </MenuGroup>
          )}
        </MenuList>
      </Menu>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
      </Modal>
    </Box>
  );
}

export default UserPopupAdmin;
