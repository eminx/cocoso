import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Anchor, Avatar, Box, Button, Text } from 'grommet';
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { UserSettings } from 'grommet-icons/icons/UserSettings';
import { StateContext } from '../LayoutContainer';
import { userMenu, adminMenu } from '../constants/general';

const UserPopup = withRouter(({ currentUser, history }) => {
  if (!currentUser) {
    return (
      <Box justify="center" pad={{ horizontal: 'xsmall' }}>
        <Anchor
          onClick={() => history.push('/login')}
          label={<Text size="small">Login</Text>}
        />
      </Box>
    );
  }

  const { role } = useContext(StateContext);

  return (
    <Menu>
      <MenuButton as={Button} colorScheme="pink">
        {currentUser && currentUser.avatar ? (
          <Avatar
            size="36px"
            src={currentUser.avatar && currentUser.avatar.src}
          />
        ) : (
          <UserSettings />
        )}
      </MenuButton>
      <MenuList>
        <MenuGroup title="My">
          {userMenu.map((item) => (
            <MenuItem key={item.label} onClick={() => history.push(item.value)}>
              {item.label}
            </MenuItem>
          ))}
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title="Admin">
          {adminMenu.map((item) => (
            <MenuItem key={item.label} onClick={() => history.push(item.value)}>
              {item.label}
            </MenuItem>
          ))}
        </MenuGroup>
      </MenuList>
    </Menu>
  );
});

export default UserPopup;
