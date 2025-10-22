import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

import { Button, Center, Modal, Text } from '/imports/ui/core';

import { call } from '../../../utils/shared';
import { GroupContext } from '../Group';
import { currentUserAtom, isDesktopAtom } from '../../../LayoutContainer';
import { message } from '../../../generic/message';

export default function GroupJoinButton() {
  const currentUser = useAtomValue(currentUserAtom);
  const isDesktop = useAtomValue(isDesktopAtom);
  const [modalOpen, setModalOpen] = useState(false);
  const [t] = useTranslation('groups');
  const { group, getGroupById } = useContext(GroupContext);
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
          size={isDesktop ? 'lg' : 'md'}
          onClick={() => setModalOpen(true)}
        >
          {t('actions.join')}
        </Button>
      </Center>

      <Modal
        id="group-join-button"
        open={modalOpen}
        title={t('modal.join.title')}
        onConfirm={joinGroup}
        onClose={() => setModalOpen(false)}
      >
        <Text>
          {t('modal.join.body', {
            title: group?.title,
          })}
        </Text>
      </Modal>
    </>
  );
}
