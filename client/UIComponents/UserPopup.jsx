import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Box, Avatar, DropButton, List, Text } from 'grommet';

export const userRoutes = [
  { label: 'Profile', value: '/my-profile' },
  { label: 'Works', value: '/my-works' }
];

export const adminRoutes = [
  { label: 'Settings', value: '/admin/settings' },
  { label: 'Members', value: '/admin/members' }
];

const UserPopup = () => {
  const [open, setOpen] = useState(false);
  return (
    <DropButton
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      dropAlign={{ right: 'right', top: 'bottom' }}
      dropContent={
        <Box pad="medium" width="small">
          <Box margin={{ bottom: 'medium' }}>
            <Text size="small" weight="bold">
              User
            </Text>
            <List data={userRoutes} border={false} pad="small">
              {(datum, index) => (
                <Link to={datum.value}>
                  <Text
                    margin={{ bottom: 'medium' }}
                    textAlign="end"
                    color="dark-2"
                  >
                    {datum.label}
                  </Text>
                </Link>
              )}
            </List>
          </Box>
          <Box>
            <Text size="small" weight="bold">
              Admin
            </Text>
            <List data={adminRoutes} border={false} pad="small">
              {(datum, index) => (
                <Link to={datum.value}>
                  <Text
                    margin={{ bottom: 'medium' }}
                    textAlign="end"
                    color="dark-2"
                  >
                    {datum.label}
                  </Text>
                </Link>
              )}
            </List>
          </Box>
        </Box>
      }
    >
      <Box justify="center" pad="small">
        <Avatar
          background={{ color: 'dark-1' }}
          size="medium"
          src="https://s.gravatar.com/avatar/b7fb138d53ba0f573212ccce38a7c43b?s=80"
        />
      </Box>
    </DropButton>
  );
};

export default UserPopup;
