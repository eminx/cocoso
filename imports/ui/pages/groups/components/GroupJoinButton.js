import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Center, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import ConfirmModal from '../../../generic/ConfirmModal';
import { call } from '../../../utils/shared';
import { GroupContext } from '../Group';
import { StateContext } from '../../../LayoutContainer';
import { message } from '../../../generic/message';

export default function GroupJoinButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const [t] = useTranslation('groups');
  const { group, getGroupById } = useContext(GroupContext);
  const { currentUser, isDesktop } = useContext(StateContext);
  const navigate = useNavigate();

  if (!group) {
    return null;
  }

  const joinGroup = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      await call('joinGroup', group._id);
      await getGroupById();
      setModalOpen(false);
      message.success(t('message.added'));
    } catch (error) {
      message.error(error.error || error.reason);
    }
  };

  return (
    <>
      <Center>
        <Button
          borderColor="brand.200"
          borderWidth="2px"
          colorScheme="brand"
          height="48px"
          width={isDesktop ? '240px' : '180px'}
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
