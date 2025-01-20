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
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={
          notificationsCounter === 0 ? (
            <BellIcon />
          ) : (
            <BellIcon>
              <AvatarBadge borderColor="papayawhip" bg="tomato" boxSize=".25em" />
            </BellIcon>
          )
        }
      />

      {notifications.length === 0 ? (
        <Box p="2">
          <Text fontSize="sm"> You don't have unread messages</Text>
        </Box>
      ) : (
        <MenuList>
          {notifications.map((item) => (
            <MenuItem
              key={item.title}
              onClick={() => navigate(`/${item.context}/${item.contextId}`)}
            >
              {item.title} <Badge>{item.count}</Badge>
            </MenuItem>
          ))}
        </MenuList>
      )}
    </Menu>
  );
}

const Badge = ({ children }) => (
  <Box bg="tomato" py="2" borderRadius="50%">
    <Code size="sm">{children}</Code>
  </Box>
);

export default NotificationsPopup;
