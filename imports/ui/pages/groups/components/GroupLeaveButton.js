import React, { useContext, useState } from 'react';
import { Button, Center, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Modal from '/imports/ui/core/Modal';
import { call } from '../../../utils/shared';
import { GroupContext } from '../Group';
import { StateContext } from '../../../LayoutContainer';
import { message } from '../../../generic/message';

export default function LeaveButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const [t] = useTranslation('groups');
  const { group, getGroupById } = useContext(GroupContext);
  const { currentUser } = useContext(StateContext);

  if (!group || !currentUser) {
    return null;
  }

  const leaveGroup = async () => {
    try {
      await call('leaveGroup', group._id);
      getGroupById();
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
          variant="link"
          onClick={() => setModalOpen(true)}
        >
          {t('actions.leave')}
        </Button>
      </Center>

      <Modal
        confirmButtonProps={{
          colorScheme: 'red',
        }}
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
