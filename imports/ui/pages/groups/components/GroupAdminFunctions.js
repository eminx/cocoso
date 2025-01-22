import React, { useState } from 'react';
import {
  Box,
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

export default function GroupAdminFunctions() {
  const [popup, setPopup] = useState('none');

  const props = {
    onClose: () => setPopup('none'),
  };

  return (
    <>
      <Center position="relative">
        <Box w="100px" position="absolute">
          <Menu>
            <MenuButton size="sm">
              <IconButton
                _hover={{ bg: 'brand.100' }}
                _active={{ bg: 'brand.200' }}
                as="span"
                bg="brand.50"
                border="1px solid #fff"
                borderRadius="50%"
                icon={<Settings />}
                variant="ghost"
              />
              <Text color="brand.400" fontSize="xs">
                Admin
              </Text>
            </MenuButton>
            <MenuList size="lg">
              <MenuItem onClick={() => setPopup('document')}>Add Document</MenuItem>
              <MenuItem onClick={() => setPopup('meeting')}>Add Meeting</MenuItem>
              <MenuItem onClick={() => setPopup('members')}>Manage Members</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Center>

      {popup === 'document' && <AddDocument {...props} />}
      {popup === 'meeting' && <AddMeeting {...props} />}
      {popup === 'members' && <ManageMembers {...props} />}
    </>
  );
}
