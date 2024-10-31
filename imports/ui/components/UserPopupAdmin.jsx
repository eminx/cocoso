import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
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
import { adminMenu } from '../utils/constants/general';

function UserPopupAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [tc] = useTranslation('common');
  const { currentHost, currentUser, isDesktop, platform } = useContext(StateContext);

  return (
    <Box zIndex={isOpen ? '1403' : '10'}>
      <Menu placement="bottom-end" onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
        <MenuButton zIndex={isOpen ? '1403' : '10'}>
          <Flex flexDirection="column" justify="center">
            <IconButton
              alignSelf="center"
              as="span"
              bg="gray.800"
              borderColor="#fff"
              borderWidth="2px"
              icon={<SettingsIcon fontSize="md" />}
              size={isDesktop ? 'md' : 'sm'}
            />
            <Text fontSize="12px" textAlign="center">
              Admin
            </Text>
          </Flex>
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
                  <MenuItem as="span" color="brand.700">
                    {tc(`menu.admin.${item.key}`)}
                  </MenuItem>
                </Link>
              ))}
            </Box>
          </MenuGroup>
        </MenuList>
      </Menu>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
      </Modal>
    </Box>
  );
}

export default UserPopupAdmin;
