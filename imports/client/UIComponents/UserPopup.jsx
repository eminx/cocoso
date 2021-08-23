import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Box, Anchor, Avatar, DropButton, List, Text } from 'grommet';
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

  const [open, setOpen] = useState(false);
  const { role } = useContext(StateContext);

  return (
    <DropButton
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      dropAlign={{ right: 'right', top: 'bottom' }}
      dropContent={
        <Box pad="medium" width="small">
          <Box>
            <Text size="small" weight="bold">
              My
            </Text>
            <List data={userMenu} border={false} pad="small">
              {(datum, index) => (
                <Anchor
                  onClick={() => history.push(datum.value)}
                  label={
                    <Text
                      margin={{ bottom: 'medium' }}
                      textAlign="end"
                      color="dark-2"
                    >
                      {datum.label}
                    </Text>
                  }
                />
              )}
            </List>
          </Box>
          {role === 'admin' && (
            <Box margin={{ top: 'medium' }}>
              <Text size="small" weight="bold">
                Admin
              </Text>
              <List data={adminMenu} border={false} pad="small">
                {(datum, index) => (
                  <Anchor
                    onClick={() => history.push(datum.value)}
                    label={
                      <Text
                        margin={{ bottom: 'medium' }}
                        textAlign="end"
                        color="dark-2"
                      >
                        {datum.label}
                      </Text>
                    }
                  />
                )}
              </List>
            </Box>
          )}
        </Box>
      }
    >
      <Box justify="center" pad="small">
        {currentUser.avatar ? (
          <Avatar
            size="36px"
            src={currentUser.avatar && currentUser.avatar.src}
          />
        ) : (
          <UserSettings />
        )}
      </Box>
    </DropButton>
  );
});

export default UserPopup;
