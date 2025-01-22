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
import { useTranslation } from 'react-i18next';

import AddDocument from './admin/AddDocument';
import AddMeeting from './admin/AddMeeting';
import ManageMembers from './admin/ManageMembers';

export default function GroupAdminFunctions() {
  const [popup, setPopup] = useState('none');
  const [t] = useTranslation('groups');

  const props = {
    onClose: () => setPopup('none'),
  };

  return (
    <>
      <Center position="relative">
        <Box pt="2" position="absolute" top="0" w="100px">
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
                {t('admin.admin')}
              </Text>
            </MenuButton>
            <MenuList size="lg">
              <MenuItem onClick={() => setPopup('document')}>{t('admin.add_document')}</MenuItem>
              <MenuItem onClick={() => setPopup('meeting')}>{t('admin.add_meeting')}</MenuItem>
              <MenuItem onClick={() => setPopup('members')}>{t('admin.manage_members')}</MenuItem>
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
