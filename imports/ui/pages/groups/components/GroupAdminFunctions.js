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
import { useTranslation } from 'react-i18next';
import Settings from 'lucide-react/dist/esm/icons/settings';

import Modal from '/imports/ui/components/Modal';

export default function GroupAdminFunctions({ currentUser, group }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [t] = useTranslation('groups');

  return (
    <>
      <Center position="relative">
        <Box w="100px" position="absolute">
          <Menu>
            <MenuButton colorScheme="blue" size="sm">
              <Box>
                <IconButton
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
              <MenuItem>Add Document</MenuItem>
              <MenuItem>Add Meeting</MenuItem>
              <MenuItem>Manage Members</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Center>

      <Modal
        h="80%"
        isCentered
        isOpen={modalOpen}
        title={t('labels.meetings')}
        onCancel={() => setModalOpen(false)}
        onClose={() => setModalOpen(false)}
      >
        Admin menu
      </Modal>
    </>
  );
}
