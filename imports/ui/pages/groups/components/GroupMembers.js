import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHydrated } from 'react-hydration-provider';

const maxShownAvatars = 6;

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
      <Box
        p="2"
        mt="1"
        css={{
          cursor: 'pointer',
          ':hover': {
            backgroundColor: 'var(--cocoso-colors-gray-100)',
            borderRadius: '8px',
          },
        }}
        onClick={() => setModalOpen(true)}
      >
        <AvatarGroup>
          {group.members?.map((member, index) => (
            <Box
              key={member.memberId}
              css={{ marginInlineEnd: '-1rem', zIndex: 100 - index }}
            >
              {index < maxShownAvatars ? (
                <Avatar
                  borderRadius="2rem"
                  name={member.username}
                  src={member.avatar}
                />
              ) : index === maxShownAvatars ? (
                <Box
                  css={{
                    backgroundColor: 'var(--cocoso-colors-gray-50)',
                    borderRadius: '2rem',
                    border: '2px solid white',
                    fontSize: '1.4rem',
                    height: '3.5rem',
                    paddingLeft: '1rem',
                    paddingTop: '0.5rem',
                    width: '3.5rem',
                  }}
                >
                  +{group.members.length - maxShownAvatars}
                </Box>
              ) : null}
            </Box>
          ))}
        </AvatarGroup>
      </Box>

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
