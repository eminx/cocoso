import { Meteor } from 'meteor/meteor';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

import { StateContext } from '../LayoutContainer';

function UserPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [tc] = useTranslation('common');
  const [t] = useTranslation('members');
  const { canCreateContent, currentHost, currentUser, isDesktop, platform, role } =
    useContext(StateContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsOpen(false);
    Meteor.logout();
    navigate('/');
  };

  const isFed = platform?.isFederationLayout;

  const buttonProps = {
    as: 'span',
    color: isFed ? 'brand.50' : 'brand.500',
    fontWeight: 'normal',
    size: isDesktop ? 'sm' : 'xs',
    variant: 'link',
  };

  if (!currentUser) {
    return (
      <Flex wrap="wrap" justify="flex-end" pl="4" pr={isDesktop ? '2' : '0'}>
        <Link to="/login">
          <Button {...buttonProps}>{tc('menu.guest.login')}</Button>
        </Link>

        <Link to="/register">
          <Button {...buttonProps} ml="4">
            {tc('menu.guest.register')}
          </Button>
        </Link>
      </Flex>
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

  const { host } = currentHost;

  const roleTranslated = t(`roles.${role}`);

  return (
    <Box>
      <Menu placement="bottom-end" onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
        <MenuButton>
          <Avatar
            _hover={{ bg: 'brand.500' }}
            bg="brand.600"
            borderRadius="0"
            showBorder
            size={isDesktop ? 'md' : 'sm'}
            src={currentUser.avatar && currentUser.avatar.src}
            zIndex={isOpen ? '1403' : '10'}
          >
            {isNotification && <AvatarBadge borderColor="tomato" bg="tomato" />}
          </Avatar>
        </MenuButton>
        <MenuList zIndex={isOpen ? '1403' : '10'}>
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
                      <Text color="brand.700">{item.title} </Text>
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

          <MenuDivider />

          <MenuGroup>
            <Center py="2">
              <Button variant="outline" onClick={() => handleLogout()}>
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
