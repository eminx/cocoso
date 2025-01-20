import React from 'react';
import {
  AvatarBadge,
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import BellIcon from 'lucide-react/dist/esm/icons/bell';

function NotificationsPopup({ notifications }) {
  if (!notifications) {
    return null;
  }

  let notificationsCounter = 0;
  if (notifications && notifications.length > 0) {
    notifications.forEach((notification) => {
      notificationsCounter += notification.count;
    });
  }

  return (
    <Menu data-oid="i50ghkw">
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={
          notificationsCounter === 0 ? (
            <BellIcon data-oid="5xckmvu" />
          ) : (
            <BellIcon data-oid="z0touqh">
              <AvatarBadge
                borderColor="papayawhip"
                bg="tomato"
                boxSize=".25em"
                data-oid="cln3vf."
              />
            </BellIcon>
          )
        }
        data-oid="8p0t5tc"
      />

      {notifications.length === 0 ? (
        <Box p="2" data-oid="q.bvig8">
          <Text fontSize="sm" data-oid="zxw.:zj">
            {' '}
            You don't have unread messages
          </Text>
        </Box>
      ) : (
        <MenuList data-oid="_kooxg0">
          {notifications.map((item) => (
            <MenuItem
              key={item.title}
              onClick={() => navigate(`/${item.context}/${item.contextId}`)}
              data-oid="tgx1h3m"
            >
              {item.title} <Badge data-oid="f0xh2jl">{item.count}</Badge>
            </MenuItem>
          ))}
        </MenuList>
      )}
    </Menu>
  );
}

const Badge = ({ children }) => (
  <Box bg="tomato" py="2" borderRadius="50%" data-oid="25:tz0q">
    <Code size="sm" data-oid="lmvgy35">
      {children}
    </Code>
  </Box>
);

export default NotificationsPopup;
