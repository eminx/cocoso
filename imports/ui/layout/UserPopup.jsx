import { Meteor } from 'meteor/meteor';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import {
  Avatar,
  AvatarBadge,
  Badge,
  Box,
  Button,
  Center,
  Flex,
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
import Bolt from 'lucide-react/dist/esm/icons/bolt';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';

import { StateContext } from '../LayoutContainer';
import { getFullName } from '../utils/shared';

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

const linkButtonProps = {
  as: 'span',
  bg: 'brand.50',
  color: 'brand.500',
  fontWeight: 'normal',
  variant: 'ghost',
  size: 'sm',
};

export function UserThumb({ isNotification = false }) {
  const { currentUser, isDesktop, role } = useContext(StateContext);

  if (!currentUser) {
    return null;
  }

  return (
    <Flex>
      <Avatar
        _hover={{ bg: 'brand.500' }}
        bg="brand.600"
        borderRadius="lg"
        showBorder
        size={isDesktop ? 'md' : 'sm'}
        src={currentUser.avatar && currentUser.avatar.src}
      >
        {role === 'admin' && (
          <AvatarBadge bg="brand.50" borderWidth="2px">
            <Bolt color="#010101" size="16" />
          </AvatarBadge>
        )}
        {role === 'contributor' && (
          <AvatarBadge bg="brand.50" borderWidth="2px">
            <CheckCircle color="#010101" size="16" />
          </AvatarBadge>
        )}
        {isNotification && <AvatarBadge bg="tomato" borderColor="white" boxSize="1em" />}
      </Avatar>

      <Box align="flex-start" lineHeight={isDesktop ? '1.5' : '1.2'} px="2" textAlign="left">
        <Text fontSize={isDesktop ? 'md' : 'sm'}>{currentUser.username}</Text>
        <Text fontSize={isDesktop ? 'sm' : 'xs'} fontWeight="light">
          {getFullName(currentUser)}
        </Text>
      </Box>
    </Flex>
  );
}

export default function UserPopup({ isOpen, setIsOpen }) {
  const { canCreateContent, currentHost, currentUser, isDesktop, role } = useContext(StateContext);
  const navigate = useNavigate();

  if (!currentHost) {
    return null;
  }

  if (!currentUser) {
    return (
      <Link to="/login" style={{ marginRight: '12px' }}>
        <Button {...linkButtonProps}>
          <Trans i18nKey="common:menu.guest.login">Login</Trans>
        </Button>
      </Link>
    );
  }

  const handleLogout = () => {
    Meteor.logout();
    navigate('/');
  };

  const notifications = currentUser?.notifications;

  let notificationsCounter = 0;
  if (notifications && notifications.length > 0) {
    notifications.forEach((notification) => {
      notificationsCounter = notification.count + notificationsCounter;
    });
  }

  const isNotification = notifications && notifications.length > 0;
  const host = currentHost?.host;
  const roleTranslated = <Trans i18nKey={`roles.${role}`} ns="members" />;

  const isAdmin = role === 'admin';

  return (
    <Box>
      <Modal isOpen={isOpen}>
        <ModalOverlay
          zIndex={1}
          onClick={() => {
            setIsOpen(false);
          }}
        />
      </Modal>

      <Menu
        isOpen={isOpen}
        placement="bottom-end"
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      >
        <MenuButton
          _hover={{ bg: 'white' }}
          bg="rgba(255, 252, 250, 0.9)"
          borderRadius="lg"
          mr="1"
          p="1"
          onClick={() => setIsOpen(!isOpen)}
        >
          <UserThumb
            currentUser={currentUser}
            isDesktop={isDesktop}
            isNotification={isNotification}
          />
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

          {isAdmin && <MenuDivider />}
          {isAdmin && (
            <Link to="/admin/home">
              <MenuItem px="4">
                <Bolt size="20" style={{ marginRight: '6px' }} />
                <Trans i18nKey="members:dashboard">Admin Dashboard</Trans>
              </MenuItem>
            </Link>
          )}
          {isAdmin && <MenuDivider />}

          {isNotification && (
            <MenuGroup title={<Trans i18nKey="common:menu.notifications.label">Login</Trans>}>
              <Box px="1">
                {notifications.map((item) => (
                  <NotificationLinkItem key={item.contextId + item.count} host={host} item={item}>
                    <MenuItem>
                      <Text>{item.title} </Text>
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
                <MenuItem as="span">
                  <Trans i18nKey="common:menu.member.profile">My Profile</Trans>
                </MenuItem>
              </Link>
              <Link to={'/edit'}>
                <MenuItem as="span">
                  <Trans i18nKey="common:menu.member.settings">Profile Settings</Trans>
                </MenuItem>
              </Link>
              {canCreateContent && (
                <Link to="/my-activities">
                  <MenuItem as="span">
                    <Trans i18nKey="common:menu.member.activities">My Activities</Trans>
                  </MenuItem>
                </Link>
              )}
            </Box>
          </MenuGroup>

          <MenuDivider />

          <MenuGroup>
            <Center py="2">
              <Button variant="outline" onClick={() => handleLogout()}>
                <Trans i18nKey="common:actions.logout">Logout</Trans>
              </Button>
            </Center>
          </MenuGroup>
        </MenuList>
      </Menu>
    </Box>
  );
}
