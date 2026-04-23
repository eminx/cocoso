import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { useTranslation } from 'react-i18next';

import { Avatar, Box, Center, Flex, Text } from '/imports/ui/core';
import { decryptMessage } from '/imports/utils/crypto';
import { currentUserAtom, privateKeyAtom } from '/imports/state';
import ChatteryBubble from '/imports/ui/chattery/ChatteryBubble';
import '/imports/ui/chattery/chattery.css';

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

const getFirst4Words = (text: string) => text.split(' ').slice(0, 4).join(' ');

export default function DirectMessageConversations({ conversations }: Props) {
  const [t] = useTranslation('accounts');
  const currentUser = useAtomValue(currentUserAtom);
  const privateKey = useAtomValue(privateKeyAtom);
  const navigate = useNavigate();
  const { conversationId } = useParams();

  const isIndexPage = typeof conversationId !== 'string';
  const blockedIds: string[] = (currentUser as any)?.blockedUserIds ?? [];

  if (conversations.length === 0) {
    return (
      <Center p="8">
        <Text color="gray.500">
          {t('messages.empty')}
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
          const isCurrentThread = conv._id === conversationId;
          const isUserBlocked = blockedIds.includes(otherUserId);

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
              bg={isCurrentThread ? 'bluegray.300' : 'bluegray.50'}
              gap="2"
              p="3"
              w="100%"
              css={{
                borderBottom: '1px solid var(--cocoso-colors-bluegray-200)',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                '&:hover': {
                  background: 'var(--cocoso-colors-bluegray-200)',
                },
                opacity: isUserBlocked ? 0.5 : 1,
              }}
              onClick={() => navigate(`/admin/messages/${conv._id}`)}
            >
              <Box css={{ flexShrink: 0 }}>
                <Avatar
                  name={otherUsername}
                  size="md"
                  src={otherAvatar ?? undefined}
                />
              </Box>

              {isIndexPage ? (
                <Box css={{ flex: 1, lineHeight: '0.6' }}>
                  <Text fontWeight="bold" size="md">
                    {otherUsername}
                  </Text>{' '}
                  <br />
                  <Text color="gray.500" size="xs">
                    {conv.lastMessageAt
                      ? dayjs(conv.lastMessageAt).fromNow()
                      : '—'}
                  </Text>
                </Box>
              ) : null}

              {isIndexPage && preview ? (
                <Box
                  css={{
                    flex: 3,
                    '& .talk-bubble': {
                      margin: '0 0.4rem 0 0',
                      fontSize: '0.8rem',
                    },
                  }}
                >
                  <ChatteryBubble
                    createdDate={conv.lastMessageAt ?? new Date()}
                    senderUsername={isLastFromMe ? 'You' : otherUsername}
                    isFromMe={isLastFromMe}
                    removeNotification={() => {}}
                  >
                    {`${getFirst4Words(preview)}..`}
                  </ChatteryBubble>
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
