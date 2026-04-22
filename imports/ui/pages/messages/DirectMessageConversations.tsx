import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { Avatar, Box, Center, Flex, Text } from '/imports/ui/core';
import { decryptMessage } from '/imports/utils/crypto';
import { currentUserAtom, privateKeyAtom } from '/imports/state';

interface DirectConversation {
  _id: string;
  participantIds: string[];
  participantUsernames: string[];
  participantAvatars?: (string | null)[];
  lastMessageBy?: string;
  lastMessageAt?: Date;
  lastMessageSenderCiphertext?: string;
  lastMessageRecipientCiphertext?: string;
}

interface Props {
  conversations: DirectConversation[];
}

export default function DirectMessageConversations({ conversations }: Props) {
  const currentUser = useAtomValue(currentUserAtom);
  const privateKey = useAtomValue(privateKeyAtom);
  const navigate = useNavigate();

  return (
    <Box>
      {conversations.length === 0 ? (
        <Center p="8">
          <Text color="gray.500">
            No conversations yet. Search for someone above.
          </Text>
        </Center>
      ) : (
        conversations.map((conv) => {
          const otherIndex = conv.participantIds.findIndex(
            (id: string) => id !== currentUser?._id
          );
          const otherUsername = conv.participantUsernames[otherIndex];
          const otherAvatar = conv.participantAvatars?.[otherIndex];
          const otherUserId = conv.participantIds[otherIndex];

          let preview = '';
          const isLastFromMe = conv.lastMessageBy === currentUser?._id;
          const lastCiphertext = isLastFromMe
            ? conv.lastMessageSenderCiphertext
            : conv.lastMessageRecipientCiphertext;

          if (lastCiphertext && privateKey) {
            const otherUser = otherUserId
              ? Meteor.users.findOne(otherUserId, {
                  fields: { publicKey: 1 },
                })
              : null;
            const decryptKey = isLastFromMe
              ? (currentUser as any)?.publicKey
              : (otherUser as any)?.publicKey;
            if (decryptKey) {
              preview =
                decryptMessage(lastCiphertext, decryptKey, privateKey) ?? '';
            }
          }

          return (
            <Flex
              key={conv._id}
              align="center"
              gap="4"
              css={{
                borderBottom: '1px solid var(--cocoso-colors-bluegray-200)',
                cursor: 'pointer',
                padding: '0.6rem 0.5rem',
                position: 'relative',
                transition: 'background 0.15s ease',
                '&:hover': { background: 'var(--cocoso-colors-bluegray-50)' },
              }}
              onClick={() => navigate(`/admin/messages/${conv._id}`)}
            >
              <Box css={{ flexShrink: 0, width: '52px' }}>
                <Avatar name={otherUsername} size="md" src={otherAvatar ?? undefined} />
              </Box>

              <Box css={{ flex: 1, minWidth: 0 }}>
                <Text fontWeight="bold" size="md">
                  {otherUsername}
                </Text>
                <br />
                <Text
                  color="gray.600"
                  size="xs"
                  css={{ position: 'absolute', bottom: '0.6rem' }}
                >
                  {conv.lastMessageAt
                    ? dayjs(conv.lastMessageAt).fromNow()
                    : '—'}
                </Text>
              </Box>

              {preview ? (
                <Box css={{ flex: 3 }}>
                  <Text
                    size="sm"
                    color="gray.700"
                    css={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isLastFromMe ? 'You: ' : ''}
                    {preview}
                  </Text>
                </Box>
              ) : null}
            </Flex>
          );
        })
      )}
    </Box>
  );
}
