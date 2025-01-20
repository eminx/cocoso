import React, { useState } from 'react';
import { Button, Center, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import ConfirmModal from '../../../components/ConfirmModal';
import { call } from '../../../utils/shared';

export default function GroupJoinButton({ currentUser, group }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [t] = useTranslation('groups');

  if (!group) {
    return null;
  }

  const joinGroup = async () => {
    if (!currentUser) {
      alert('Login first!');
    }

    try {
      await call('joinGroup', group._id);
      // message.success(t('message.added'));
    } catch (error) {
      // message.error(error.error || error.reason);
    }
  };

  return (
    <>
      <Center>
        <Button
          borderColor="green.200"
          borderWidth="2px"
          colorScheme="green"
          height="48px"
          size="lg"
          width="240px"
          onClick={() => setModalOpen(true)}
        >
          {t('actions.join')}
        </Button>
      </Center>

      <ConfirmModal
        visible={modalOpen}
        title={t('modal.join.title')}
        onConfirm={joinGroup}
        onCancel={() => setModalOpen(false)}
        onClose={() => setModalOpen(false)}
      >
        <Text>
          {t('modal.join.body', {
            title: group?.title,
          })}
        </Text>
      </ConfirmModal>
    </>
  );
}
