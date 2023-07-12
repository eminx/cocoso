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
  Link as CLink,
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
  const [t] = useTranslation('members');
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
  const { host, isPortalHost } = currentHost;

  const roleTranslated = t(`roles.${role}`);

  return (
    <Box>
      <Menu placement="bottom-end" onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
        <MenuButton>
          <Avatar
            _hover={{ bg: 'brand.500' }}
            bg="brand.600"
            borderRadius="8px"
            showBorder
            size="md"
            src={currentUser.avatar && currentUser.avatar.src}
          >
            {isNotification && <AvatarBadge borderColor="tomato" bg="tomato" />}
          </Avatar>
        </MenuButton>
        <MenuList>
          <MenuGroup>
            <Box px="4" py="1">
              <Text fontWeight="bold" fontSize="xl">
                {currentUser.username}{' '}
                <Text as="span" fontSize="sm" fontWeight="light" textTransform="lowercase">
                  {roleTranslated}
                </Text>
              </Text>
            </Box>
          </MenuGroup>
          {isNotification && (
            <MenuGroup title={tc('menu.notifications.label')}>
              <Box px="1">
                {notifications.map((item) => (
                  <NotificationLinkItem key={item.contextId + item.count} host={host} item={item}>
                    <MenuItem>
                      <Text color="brand.700" isTruncated>
                        {item.title}{' '}
                      </Text>
                      <Badge colorScheme="red" size="xs">
                        {' '}
                        {item.count}
                      </Badge>
                    </MenuItem>
                  </NotificationLinkItem>
                ))}
              </Box>
            </MenuGroup>
          )}
          {isNotification && <MenuDivider />}

          <MenuGroup>
            <Box px="1">
              <Link to={currentUser && `/@${currentUser?.username}`}>
                <MenuItem color="brand.700">{tc('menu.member.profile')}</MenuItem>
              </Link>
              <Link to={currentUser && `/@${currentUser?.username}/edit`}>
                <MenuItem color="brand.700">{tc('menu.member.settings')}</MenuItem>
              </Link>
              {canCreateContent && (
                <Link to="/my-activities">
                  <MenuItem color="brand.700">{tc('menu.member.activities')}</MenuItem>
                </Link>
              )}
            </Box>
          </MenuGroup>

          {role === 'admin' && <MenuDivider />}
          {role === 'admin' && (
            <MenuGroup title={tc('domains.community')}>
              <Box px="1">
                {adminMenu.map((item) => (
                  <Link key={item.key} to={item.value}>
                    <MenuItem color="brand.700">{tc(`menu.admin.${item.key}`)}</MenuItem>
                  </Link>
                ))}
              </Box>
            </MenuGroup>
          )}
          {isSuperAdmin && isPortalHost && <MenuDivider />}
          {isSuperAdmin && isPortalHost && (
            <MenuGroup title={tc('domains.platform')}>
              <Box px="1">
                {superadminMenu.map((item) => (
                  <Link key={item.key} to={item.value}>
                    <MenuItem color="brand.700">{tc(`menu.admin.${item.key}`)}</MenuItem>
                  </Link>
                ))}
              </Box>
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

function NotificationLinkItem({ host, item, children }) {
  if (item.host && host === item.host) {
    return <Link to={`/${item.context}/${item.contextId}`}>{children}</Link>;
  }

  return (
    <CLink href={`https://${item.host || host}/${item.context}/${item.contextId}`}>
      {children}
    </CLink>
  );
}

export default UserPopup;
