import React, { useState } from 'react';
import { Box, Button, Center, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Modal from '/imports/ui/components/Modal';

export default function GroupAdminFunctions({ currentUser, group }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [t] = useTranslation('groups');

  return (
    <>
      <Center>
        <Box w="240px">
          <Menu matchWidth>
            <MenuButton
              as={Button}
              bg="white"
              // borderWidth="2px"
              colorScheme="blue"
              height="32px"
              size="md"
              variant="outline"
              width="100%"
            >
              Admin
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
