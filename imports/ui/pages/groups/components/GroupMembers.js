import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHydrated } from 'react-hydration-provider';

import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  Link as CLink,
  Text,
} from '/imports/ui/core';

import Modal from '/imports/ui/core/Modal';
import NiceList from '/imports/ui/generic/NiceList';

export default function GroupMembers({ group }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [t] = useTranslation('groups');
  const hydrated = useHydrated();

  if (!group) {
    return null;
  }

  return (
    <Box>
      <AvatarGroup
        max={6}
        p="2"
        css={{
          cursor: 'pointer',
          ':hover': {
            bg: 'var(--cocoso-colors-gray-200)',
            borderRadius: '8px',
          },
        }}
        onClick={() => setModalOpen(true)}
      >
        {group.members?.map((member) => (
          <Avatar
            key={member.memberId}
            name={member.username}
            size="lg"
            src={member.avatar}
          />
        ))}
      </AvatarGroup>

      {hydrated && (
        <Modal
          hideFooter
          open={modalOpen}
          title={t('labels.member')}
          onClose={() => setModalOpen(false)}
        >
          <NiceList
            keySelector="username"
            list={group.members}
            py="4"
            spacing="4"
          >
            {(member) => (
              <Link to={`/@${member.username}/bio`}>
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
              </Link>
            )}
          </NiceList>
        </Modal>
      )}
    </Box>
  );
}
