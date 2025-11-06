import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAtom, useAtomValue } from 'jotai';

import { Button, Center, Modal, Text } from '/imports/ui/core';
import { currentUserAtom } from '/imports/state';

import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';

import { groupAtom } from '../GroupItemHandler';

export default function LeaveButton() {
  const currentUser = useAtomValue(currentUserAtom);
  const [modalOpen, setModalOpen] = useState(false);
  const [t] = useTranslation('groups');
  const [group, setGroup] = useAtom(groupAtom);

  if (!group || !currentUser) {
    return null;
  }

  const leaveGroup = async () => {
    try {
      const groupId = group?._id;
      await call('leaveGroup', groupId);
      setGroup(await call('getGroupById', groupId));
      message.success(t('message.removed'));
    } catch (error) {
      message.error(error.error || error.reason);
    }
  };

  return (
    <>
      <Center mb="8">
        <Button
          colorScheme="red"
          variant="outline"
          onClick={() => setModalOpen(true)}
        >
          {t('actions.leave')}
        </Button>
      </Center>

      <Modal
        confirmButtonProps={{
          colorScheme: 'red',
        }}
        id="group-leave-button"
        open={modalOpen}
        title={t('modal.leave.title')}
        onConfirm={leaveGroup}
        onClose={() => setModalOpen(false)}
      >
        <Text>
          {t('modal.leave.body', {
            title: group?.title,
          })}
        </Text>
      </Modal>
    </>
  );
}
