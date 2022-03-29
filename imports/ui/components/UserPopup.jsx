import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  AvatarBadge,
  Badge,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';

import { StateContext } from '../LayoutContainer';
import { userMenu, adminMenu } from '../@/constants/general';

function UserPopup({ currentUser }) {
  const [tc] = useTranslation('common');

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

  const { role } = useContext(StateContext);

  return (
    <Menu>
      <MenuButton>
        <Avatar
          mr="2"
          showBorder
          src={currentUser.avatar && currentUser.avatar.src}
        >
          <AvatarBadge borderColor="papayawhip" bg="tomato" boxSize=".7em" />
        </Avatar>
      </MenuButton>
      <MenuList>
        {notifications && notifications.length > 0 && (
          <MenuGroup title={tc('menu.notifications.label')}>
            {notifications.map((item) => (
              <Link key={item.title} to={`/${item.context}/${item.contextId}`}>
                <MenuItem>
                  {item.title} <Badge>{item.count}</Badge>
                </MenuItem>
              </Link>
            ))}
          </MenuGroup>
        )}
        <MenuGroup title={tc('menu.member.label')}>
          {userMenu.map((item) => (
            <Link key={item.key} to={item.value}>
              <MenuItem>{tc('menu.member.' + item.key)}</MenuItem>
            </Link>
          ))}
        </MenuGroup>
        {role === 'admin' && <MenuDivider />}
        {role === 'admin' && (
          <MenuGroup title={tc('menu.admin.label')}>
            {adminMenu.map((item) => (
              <Link key={item.key} to={item.value}>
                <MenuItem>{tc('menu.admin.' + item.key)}</MenuItem>
              </Link>
            ))}
          </MenuGroup>
        )}
      </MenuList>
    </Menu>
  );
}

export default UserPopup;
