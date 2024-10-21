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
  Divider,
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
import { ChevronLeftIcon } from '@chakra-ui/icons';

import { StateContext } from '../LayoutContainer';

function UserPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubOpen, setIsSubOpen] = useState(false);
  const [tc] = useTranslation('common');
  const [t] = useTranslation('members');
  const { canCreateContent, currentHost, currentUser, isDesktop, platform, role } =
    useContext(StateContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    closeBothMenus();
    Meteor.logout();
    navigate('/');
  };

  const closeBothMenus = () => {
    setIsOpen(false);
    setIsSubOpen(false);
  };

  const notifications = currentUser?.notifications;

  let notificationsCounter = 0;
  if (notifications && notifications.length > 0) {
    notifications.forEach((notification) => {
      notificationsCounter += notification.count;
    });
  }

  const isNotification = notifications && notifications.length > 0;
  const host = currentHost?.host;
  const roleTranslated = t(`roles.${role}`);

  return (
    <Box>
      <Menu isOpen={isOpen} placement="bottom-end" onOpen={() => setIsOpen(true)}>
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
                    <MenuItem onClick={() => closeBothMenus()}>
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
                <MenuItem as="span" color="brand.700" onClick={() => closeBothMenus()}>
                  {tc('menu.member.profile')}
                </MenuItem>
              </Link>
              <Link to={'/edit'}>
                <MenuItem as="span" color="brand.700" onClick={() => closeBothMenus()}>
                  {tc('menu.member.settings')}
                </MenuItem>
              </Link>
              {canCreateContent && (
                <Link to="/my-activities">
                  <MenuItem as="span" color="brand.700" onClick={() => closeBothMenus()}>
                    {tc('menu.member.activities')}
                  </MenuItem>
                </Link>
              )}

              <MenuDivider />

              <MenuItem onClick={() => setIsSubOpen(true)}>
                <Menu isOpen={isSubOpen} placement="left-end" onOpen={() => setIsSubOpen(true)}>
                  <MenuButton>
                    <ChevronLeftIcon /> {t('profile.myCommunities')}
                  </MenuButton>

                  <MenuList zIndex="1405">
                    {currentUser?.memberships?.map((m) => (
                      <MenuItem key={m.host} onClick={() => (location.href = `https://${m.host}`)}>
                        {m.hostname}
                      </MenuItem>
                    ))}
                    <Divider colorScheme="gray.700" mt="2" />
                    <MenuItem
                      key="all-communities"
                      onClick={() =>
                        currentHost?.isPortalHost
                          ? navigate('/communities')
                          : (location.href = `https://${platform?.portalHost}/communities`)
                      }
                    >
                      {tc('labels.allCommunities')}
                    </MenuItem>
                  </MenuList>
                </Menu>
              </MenuItem>
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
        <ModalOverlay
          onClick={() => {
            setIsOpen(false);
            setIsSubOpen(false);
          }}
        />
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
