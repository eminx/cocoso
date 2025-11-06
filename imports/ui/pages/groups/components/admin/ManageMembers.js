import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAtom, useAtomValue } from 'jotai';

import { Avatar, Flex, Link as CLink, Text } from '/imports/ui/core';
import Modal from '/imports/ui/core/Modal';
import NiceList from '/imports/ui/generic/NiceList';
import { call } from '../../../../../api/_utils/shared';
import { message } from '/imports/ui/generic/message';

import { groupAtom } from '../../GroupItemHandler';

export default function ManageMembers({ onClose }) {
  const [t] = useTranslation('groups');
  const [group, setGroup] = useAtom(groupAtom);

  const setAsAGroupAdmin = async (username) => {
    try {
      const groupId = group?._id;
      await call('setAsAGroupAdmin', groupId, username);
      setGroup(await call('getGroupById', groupId));
      message.success(t('meeting.success.admin'));
    } catch (error) {
      message.error(error.error);
    }
  };

  const members = group.members?.map((member) => ({
    ...member,
    actions: [
      {
        content: t('meeting.actions.makeAdmin'),
        handleClick: () => {
          setAsAGroupAdmin(member.username);
        },
        isDisabled: member.isAdmin,
      },
    ],
  }));

  return (
    <Modal
      hideFooter
      open
      id="group-manage-members"
      title={t('labels.member')}
      onClose={onClose}
    >
      <NiceList
        actionsDisabled={false}
        keySelector="username"
        list={members}
        py="4"
        spacing="4"
      >
        {(member) => (
          <Flex align="center">
            <Avatar
              borderRadius="lg"
              mr="2"
              name={member.username}
              size="md"
              src={member.avatar}
            />
            <CLink as="span" fontWeight={member.isAdmin ? 700 : 400}>
              {member.username}
            </CLink>
            <Text ml="1">{member.isAdmin && '(admin)'}</Text>
          </Flex>
        )}
      </NiceList>
    </Modal>
  );
}
