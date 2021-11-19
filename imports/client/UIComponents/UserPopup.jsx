import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Avatar,
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
import { userMenu, adminMenu } from '../constants/general';

const UserPopup = withRouter(({ currentUser, history }) => {
  if (!currentUser) {
    return (
      <Box px="1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => history.push('/login')}
        >
          Login
        </Button>
      </Box>
    );
  }

  const { role } = useContext(StateContext);

  return (
    <Menu>
      <MenuButton>
        <Avatar
          mr="2"
          size="sm"
          src={currentUser.avatar && currentUser.avatar.src}
        />
      </MenuButton>
      <MenuList>
        <MenuGroup title="My">
          {userMenu.map((item) => (
            <MenuItem key={item.label} onClick={() => history.push(item.value)}>
              {item.label}
            </MenuItem>
          ))}
        </MenuGroup>
        {role === 'admin' && <MenuDivider />}
        {role === 'admin' && (
          <MenuGroup title="Admin">
            {adminMenu.map((item) => (
              <MenuItem
                key={item.label}
                onClick={() => history.push(item.value)}
              >
                {item.label}
              </MenuItem>
            ))}
          </MenuGroup>
        )}
      </MenuList>
    </Menu>
  );
});

export default UserPopup;
