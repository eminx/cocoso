import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Box, Avatar, DropButton, List, Text } from 'grommet';
import { UserSettings } from 'grommet-icons';

export const userRoutes = [
  { label: 'Profile', value: '/my-profile' },
  { label: 'Works', value: '/my-works' }
];

export const adminRoutes = [
  { label: 'Settings', value: '/admin/settings' },
  { label: 'Members', value: '/admin/members' }
];

const UserPopup = ({ isAdmin }) => {
  const [open, setOpen] = useState(false);
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
          {isAdmin && (
            <Box margin={{ top: 'medium' }}>
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
          )}
        </Box>
      }
    >
      <Box justify="center" pad="small">
        <Avatar size="medium">
          <UserSettings />
        </Avatar>
      </Box>
    </DropButton>
  );
};

export default UserPopup;
