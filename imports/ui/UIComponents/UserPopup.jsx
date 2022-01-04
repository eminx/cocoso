import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
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

function UserPopup({ currentUser }) {
  if (!currentUser) {
    return (
      <Box px="1">
        <Link to="/login">
          <Button as="span" size="sm" variant="ghost">
            Login
          </Button>
        </Link>
      </Box>
    );
  }

  const { role } = useContext(StateContext);

  return (
    <Menu>
      <MenuButton>
        <Avatar
          mr="2"
          showBorder
          src={currentUser.avatar && currentUser.avatar.src}
        />
      </MenuButton>
      <MenuList>
        <MenuGroup title="My">
          {userMenu.map((item) => (
            <Link key={item.label} to={item.value}>
              <MenuItem>{item.label}</MenuItem>
            </Link>
          ))}
        </MenuGroup>
        {role === 'admin' && <MenuDivider />}
        {role === 'admin' && (
          <MenuGroup title="Admin">
            {adminMenu.map((item) => (
              <Link key={item.label} to={item.value}>
                <MenuItem>{item.label}</MenuItem>
              </Link>
            ))}
          </MenuGroup>
        )}
      </MenuList>
    </Menu>
  );
}

export default UserPopup;
