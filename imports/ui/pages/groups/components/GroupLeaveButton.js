import React, { useState } from 'react';
import { Button, Center, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import ConfirmModal from '/imports/ui/components/ConfirmModal';
import { call } from '/imports/ui/utils/shared';

export default function LeaveButton({ currentUser, group }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [t] = useTranslation('groups');

  if (!group || !currentUser) {
    return null;
  }

  const leaveGroup = async () => {
    try {
      await call('leaveGroup', group._id);
      // message.success(t('message.removed'));
    } catch (error) {
      // message.error(error.error || error.reason);
    }
  };

  return (
    <>
      <Center>
        <Button colorScheme="red" variant="link" onClick={() => setModalOpen(true)}>
          {t('actions.leave')}
        </Button>
      </Center>

      <ConfirmModal
        visible={modalOpen}
        title={t('modal.leave.title')}
        onConfirm={leaveGroup}
        onCancel={() => setModalOpen(false)}
        onClose={() => setModalOpen(false)}
      >
        <Text>
          {t('modal.leave.body', {
            title: group?.title,
          })}
        </Text>
      </ConfirmModal>
    </>
  );
}
