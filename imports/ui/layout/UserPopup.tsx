import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link, useNavigate } from 'react-router';
import { Trans } from 'react-i18next';
import BoltIcon from 'lucide-react/dist/esm/icons/bolt';
import CogIcon from 'lucide-react/dist/esm/icons/cog';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/check-circle';
import { useAtom, useAtomValue } from 'jotai';

import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Link as CLink,
  NotificationBadge,
  Text,
} from '/imports/ui/core';
import Menu, { MenuItem } from '/imports/ui/generic/Menu';
import {
  canCreateContentAtom,
  currentHostAtom,
  currentUserAtom,
  isDesktopAtom,
  roleAtom,
} from '/imports/state';
import { getFullName } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';

interface NotificationLinkItemProps {
  host: string;
  item: any;
  children: React.ReactNode;
}

function NotificationLinkItem({
  host,
  item,
  children,
}: NotificationLinkItemProps) {
  if (item.host && host === item.host) {
    return <Link to={`/${item.context}/${item.contextId}`}>{children}</Link>;
  }

  return (
    <CLink
      href={`https://${item.host || host}/${item.context}/${item.contextId}`}
    >
      {children}
    </CLink>
  );
}

const linkButtonProps = {
  as: 'div',
  bg: 'theme.50',
  color: 'theme.500',
  fontWeight: 'normal',
  mt: '1',
  variant: 'ghost',
  size: 'sm',
};

export interface UserThumbProps {
  notificationsCounter?: number;
}

export function UserThumb({ notificationsCounter = 0 }: UserThumbProps) {
  const currentUser = useAtomValue(currentUserAtom);
  const isDesktop = useAtomValue(isDesktopAtom);
  const role = useAtomValue(roleAtom);

  if (!currentUser) {
    return null;
  }

  const isNotification = notificationsCounter && notificationsCounter !== 0;

  return (
    <Flex
      gap="0"
      css={{
        background: 'rgba(255, 252, 250, 0.9)',
        border: '2px solid var(--cocoso-colors-theme-200)',
        borderRadius: 'var(--cocoso-border-radius)',
        marginTop: '-0.075rem',
        marginRight: '-0.4rem',
        '&:hover': {
          background: 'rgba(255, 252, 250, 0.9)',
        },
      }}
    >
      <Avatar
        name={currentUser.username}
        size={isDesktop ? 'md' : 'sm'}
        src={currentUser.avatar && currentUser.avatar.src}
      >
        {isNotification ? (
          <NotificationBadge
            colorScheme="red"
            style={{
              left: '-2px',
              top: '-5px',
              width: '1.5rem',
              height: '1.5rem',
            }}
          >
            {notificationsCounter?.toString()}
          </NotificationBadge>
        ) : // <CircleIcon color="red" fill="red" size="16" />
        role === 'admin' ? (
          <BoltIcon color="#010101" size={16} />
        ) : role === 'contributor' ? (
          <CheckCircleIcon color="#010101" size={16} />
        ) : null}
      </Avatar>

      <Flex
        align="flex-start"
        direction="column"
        gap="0"
        pl="2"
        pr="4"
        pt="1"
        css={{ lineHeight: isDesktop ? '1.2' : '0.8' }}
      >
        <Text
          fontSize={isDesktop ? 'md' : 'sm'}
          css={{ fontWeight: 'bold', margin: '0.125rem 0' }}
        >
          {currentUser.username}
        </Text>
        <Text fontSize={isDesktop ? 'sm' : 'xs'} fontWeight="light" truncated>
          {getFullName(currentUser)}
        </Text>
      </Flex>
    </Flex>
  );
}

export interface UserPopupProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function UserPopup({ isOpen }: UserPopupProps) {
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const currentHost = useAtomValue(currentHostAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const role = useAtomValue(roleAtom);
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
    setCurrentUser(null);
    message.info(<Trans i18nKey="accounts:logout.messages.success" />);
    navigate('/');
  };

  const notifications = currentUser?.notifications;

  const isNotification = notifications && notifications.length > 0;
  let notificationsCounter = 0;
  if (isNotification) {
    notifications.forEach((notification: any) => {
      notificationsCounter = notification.count + notificationsCounter;
    });
  }

  const host = currentHost?.host;
  const roleTranslated = <Trans i18nKey={`roles.${role}`} ns="members" />;

  const isAdmin = role === 'admin';
  const isSuperAdmin = currentUser?.isSuperAdmin;

  return (
    <Box>
      <Menu
        align="end"
        button={<UserThumb notificationsCounter={notificationsCounter} />}
        open={isOpen}
      >
        <Box p="2">
          <Text fontWeight="bold" fontSize="xl" css={{ marginLeft: '1rem' }}>
            {currentUser.username}{' '}
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '300',
                textTransform: 'lowercase',
              }}
            >
              {roleTranslated}
            </span>
          </Text>
        </Box>

        <Divider />

        {isAdmin && (
          <Link to="/admin/home">
            <MenuItem>
              <Text>
                <Flex align="center" gap="2">
                  <BoltIcon size="18" />
                  <Trans i18nKey="members:dashboard">Admin Panel</Trans>
                </Flex>
              </Text>
            </MenuItem>
          </Link>
        )}

        {isAdmin && <Divider />}

        {isSuperAdmin && (
          <Link to="/superadmin">
            <MenuItem>
              <Text>
                <Flex align="center" gap="2">
                  <CogIcon size={18} />
                  <Trans i18nKey="members:super">Superadmin</Trans>
                </Flex>
              </Text>
            </MenuItem>
          </Link>
        )}

        {isSuperAdmin && <Divider />}

        {isNotification && (
          <>
            <Box pl="6" pt="2">
              <Text color="gray.600" size="xs">
                <Trans i18nKey="common:menu.notifications.label">
                  Notifications
                </Trans>
              </Text>
            </Box>
            {notifications.map((item) => (
              <NotificationLinkItem
                key={item.contextId + item.count}
                host={host}
                item={item}
              >
                <MenuItem>
                  <Text>
                    <em>{item.title}</em>{' '}
                  </Text>
                  <Box pl="2">
                    <Badge colorScheme="red" size="xs">
                      {' '}
                      {item.count}
                    </Badge>
                  </Box>
                </MenuItem>
              </NotificationLinkItem>
            ))}
          </>
        )}

        {isNotification && <Divider />}

        <Link to={currentUser && `/@${currentUser?.username}`}>
          <MenuItem>
            <Text>
              <Trans i18nKey="common:menu.member.profile">My Profile</Trans>
            </Text>
          </MenuItem>
        </Link>
        <Link to={'/admin/my-profile'}>
          <MenuItem as="span">
            <Text>
              <Trans i18nKey="common:menu.member.settings">
                Profile Settings
              </Trans>
            </Text>
          </MenuItem>
        </Link>
        {canCreateContent && (
          <Link to="/my-activities">
            <MenuItem as="span">
              <Text>
                <Trans i18nKey="common:menu.member.activities">
                  My Activities
                </Trans>
              </Text>
            </MenuItem>
          </Link>
        )}

        <Divider />

        <Center py="2">
          <Button size="sm" variant="ghost" onClick={() => handleLogout()}>
            <Trans i18nKey="common:actions.logout">Logout</Trans>
          </Button>
        </Center>
      </Menu>
    </Box>
  );
}
