import { Meteor } from 'meteor/meteor';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  AvatarBadge,
  Badge,
  Box,
  Button,
  Center,
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

import { StateContext } from '../LayoutContainer';
import { adminMenu, superadminMenu } from '../utils/constants/general';

function UserPopup({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tc] = useTranslation('common');
  const { canCreateContent, currentHost, role } = useContext(StateContext);

  if (!currentUser) {
    return (
      <Box px="1">
        <Link to="/login">
          <Button as="span" size="sm" variant="ghost">
            {tc('menu.guest.login')}
          </Button>
        </Link>
      </Box>
    );
  }

  const { notifications } = currentUser;
  let notificationsCounter = 0;
  if (notifications && notifications.length > 0) {
    notifications.forEach((notification) => {
      notificationsCounter += notification.count;
    });
  }

  const isNotification = notifications && notifications.length > 0;

  const isSuperAdmin = currentUser.isSuperAdmin;
  const { isPortalHost } = currentHost;
  return (
    <Box>
      <Menu placement="bottom-end" onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
        <MenuButton>
          <Avatar showBorder src={currentUser.avatar && currentUser.avatar.src}>
            {isNotification && <AvatarBadge borderColor="tomato" bg="tomato" />}
          </Avatar>
        </MenuButton>
        <MenuList>
          {isNotification && (
            <MenuGroup title={tc('menu.notifications.label')}>
              {notifications.map((item) => (
                <Link key={item.contextId + item.count} to={`/${item.context}/${item.contextId}`}>
                  <MenuItem>
                    <Text color="gray.600" isTruncated>
                      {item.title}{' '}
                    </Text>
                    <Badge colorScheme="red" size="xs">
                      {' '}
                      {item.count}
                    </Badge>
                  </MenuItem>
                </Link>
              ))}
            </MenuGroup>
          )}
          <MenuGroup title={tc('menu.member.label')}>
            <Link to={currentUser && `/@${currentUser?.username}`}>
              <MenuItem>{tc('menu.member.profile')}</MenuItem>
            </Link>
            <Link to={currentUser && `/@${currentUser?.username}/edit`}>
              <MenuItem>{tc('menu.member.settings')}</MenuItem>
            </Link>
          </MenuGroup>
          {canCreateContent && (
            <Link to="/my-activities">
              <MenuItem>{tc('menu.member.activities')}</MenuItem>
            </Link>
          )}
          {role === 'admin' && <MenuDivider />}
          {role === 'admin' && (
            <MenuGroup title={tc('menu.admin.label')}>
              {adminMenu.map((item) => (
                <Link key={item.key} to={item.value}>
                  <MenuItem>{tc(`menu.admin.${item.key}`)}</MenuItem>
                </Link>
              ))}
            </MenuGroup>
          )}
          {isSuperAdmin && isPortalHost && <MenuDivider />}
          {isSuperAdmin && isPortalHost && (
            <MenuGroup title="Super Admin">
              {superadminMenu.map((item) => (
                <Link key={item.key} to={item.value}>
                  <MenuItem>{tc(`menu.admin.${item.key}`)}</MenuItem>
                </Link>
              ))}
            </MenuGroup>
          )}

          <MenuDivider />

          <MenuGroup>
            <Center py="2">
              <Button variant="outline" onClick={() => Meteor.logout()}>
                {tc('actions.logout')}
              </Button>
            </Center>
          </MenuGroup>
        </MenuList>
      </Menu>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
      </Modal>
    </Box>
  );
}

export default UserPopup;
