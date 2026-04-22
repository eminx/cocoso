import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';
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
  const { conversationId } = useParams();

  console.log('conversationId:', conversationId);
  const isIndexPage = typeof conversationId !== 'string';

  if (conversations.length === 0) {
    return (
      <Center p="8">
        <Text color="gray.500">
          No conversations yet. Search for someone above.
        </Text>
      </Center>
    );
  }

  return (
    <Flex gap="0" w="100%">
      <Flex
        direction="column"
        gap="0"
        css={{ flexGrow: isIndexPage ? '1' : '0' }}
      >
        {conversations.map((conv) => {
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

          const isCurrentThread = conv._id === conversationId;

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
              bg={isCurrentThread ? 'bluegray.300' : 'none'}
              gap="4"
              css={{
                borderBottom: '1px solid var(--cocoso-colors-bluegray-200)',
                cursor: 'pointer',
                padding: '0.6rem 0.5rem',
                position: 'relative',
                transition: 'background 0.15s ease',
                '&:hover': { background: 'var(--cocoso-colors-bluegray-200)' },
              }}
              onClick={() => navigate(`/admin/messages/${conv._id}`)}
            >
              <Box
                css={{
                  flexShrink: 0,
                }}
              >
                <Avatar
                  name={otherUsername}
                  size="md"
                  src={otherAvatar ?? undefined}
                />
              </Box>

              {isIndexPage ? (
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
              ) : null}

              {isIndexPage && preview ? (
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
        })}
      </Flex>

      {isIndexPage ? null : (
        <Box css={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      )}
    </Flex>
  );
}
