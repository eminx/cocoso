import React, { useEffect, useState } from 'react';
import { Avatar, Box, Flex, Link as CLink, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import GroupMembers from '../GroupMembers';
import Modal from '/imports/ui/components/Modal';
import NiceList from '/imports/ui/components/NiceList';
import { call } from '/imports/ui/utils/shared';

export default function ManageMembers({ group, isOpen, onClose }) {
  const [t] = useTranslation('groups');

  const setAsAGroupAdmin = async (username) => {
    try {
      await call('setAsAGroupAdmin', group._id, username);
      // message.success(t('meeting.success.admin'));
    } catch (error) {
      console.log(error);
      // message.error(error.error);
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
    <Modal bg="gray.100" isOpen={isOpen} title={t('labels.member')} onClose={onClose}>
      <NiceList actionsDisabled={false} keySelector="username" list={members} py="4" spacing="4">
        {(member) => (
          <Flex align="center">
            <Avatar
              borderRadius="8px"
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
