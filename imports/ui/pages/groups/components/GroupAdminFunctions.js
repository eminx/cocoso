import React, { useState } from 'react';
import {
  Box,
  Button,
  Center,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import Settings from 'lucide-react/dist/esm/icons/settings';

import AddDocument from './admin/AddDocument';
import AddMeeting from './admin/AddMeeting';
import ManageMembers from './admin/ManageMembers';

export default function GroupAdminFunctions({ currentUser, group }) {
  const [popup, setPopup] = useState('none');

  const props = {
    group,
    onClose: () => setPopup('none'),
  };

  return (
    <>
      <Center position="relative">
        <Box w="100px" position="absolute">
          <Menu closeOnSelect>
            <MenuButton size="sm">
              <Box>
                <IconButton
                  as="span"
                  bg="brand.50"
                  border="1px solid #fff"
                  borderRadius="50%"
                  icon={<Settings />}
                  variant="ghost"
                />
                <Text color="brand.500" fontSize="xs">
                  Admin
                </Text>
              </Box>
            </MenuButton>
            <MenuList size="lg">
              <MenuItem onClick={() => setPopup('document')}>Add Document</MenuItem>
              <MenuItem onClick={() => setPopup('meeting')}>Add Meeting</MenuItem>
              <MenuItem onClick={() => setPopup('members')}>Manage Members</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Center>

      {popup === 'document' && <AddDocument {...props} isOpen />}
      {popup === 'meeting' && <AddMeeting {...props} isOpen />}
      {popup === 'members' && <ManageMembers {...props} isOpen />}
    </>
  );
}
