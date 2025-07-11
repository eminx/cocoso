import React, { useContext } from 'react';
import { Avatar, Flex, Link as CLink, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Modal from '/imports/ui/core/Modal';
import NiceList from '/imports/ui/generic/NiceList';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import { GroupContext } from '../../Group';

export default function ManageMembers({ onClose }) {
  const [t] = useTranslation('groups');
  const { group, getGroupById } = useContext(GroupContext);

  const setAsAGroupAdmin = async (username) => {
    try {
      await call('setAsAGroupAdmin', group._id, username);
      getGroupById();
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
    <Modal hideFooter open title={t('labels.member')} onClose={onClose}>
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
