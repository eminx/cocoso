import React, { useState } from 'react';
import { Box, DropButton, Text } from 'grommet';
import { Notification } from 'grommet-icons';

const NotificationsPopup = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <DropButton
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      dropAlign={{ right: 'right', top: 'bottom' }}
      dropContent={<Box pad="medium">{children}</Box>}
    >
      <Box justify="center" pad="small">
        <Notification />
      </Box>
    </DropButton>
  );
};

export default NotificationsPopup;
