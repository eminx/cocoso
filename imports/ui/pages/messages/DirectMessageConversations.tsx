import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { useTranslation } from 'react-i18next';

import { Avatar, Badge, Box, Center, Flex, Text } from '/imports/ui/core';
import { decryptMessage } from '/imports/utils/crypto';
import { currentUserAtom, isDesktopAtom, privateKeyAtom } from '/imports/state';
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
  lastMessageSenderPublicKey?: string;
  unreadCounts?: Record<string, number>;
}

interface Props {
  conversations: DirectConversation[];
}

const getFirst4Words = (text: string) => text.split(' ').slice(0, 4).join(' ');

export default function DirectMessageConversations({ conversations }: Props) {
  const [t] = useTranslation('accounts');
  const currentUser = useAtomValue(currentUserAtom);
  const privateKey = useAtomValue(privateKeyAtom);
  const isDesktop = useAtomValue(isDesktopAtom);
  const navigate = useNavigate();
  const { conversationId } = useParams();

  const isIndexPage = typeof conversationId !== 'string';
  const blockedIds: string[] = (currentUser as any)?.blockedUserIds ?? [];

  if (conversations.length === 0) {
    return (
      <Center p="8">
        <Text color="gray.500">{t('messages.empty')}</Text>
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
          const unreadCount =
            (conv.unreadCounts ?? {})[currentUser?._id ?? ''] ?? 0;

          let preview = '';
          const isLastFromMe = conv.lastMessageBy === currentUser?._id;
          const lastCiphertext = isLastFromMe
            ? conv.lastMessageSenderCiphertext
            : conv.lastMessageRecipientCiphertext;

          if (lastCiphertext && privateKey) {
            const senderPublicKey = isLastFromMe
              ? (currentUser as any)?.publicKey
              : conv.lastMessageSenderPublicKey;
            if (senderPublicKey) {
              preview =
                decryptMessage(lastCiphertext, senderPublicKey, privateKey) ??
                '';
            }
          }

          return (
            <Flex
              key={conv._id}
              align="center"
              bg={isCurrentThread ? 'gray.100' : 'gray.50'}
              gap="2"
              p={isDesktop || isIndexPage ? '4' : '0'}
              w="100%"
              css={{
                borderBottom: '1px solid var(--cocoso-colors-gray-200)',
                cursor: 'pointer',
                opacity: isUserBlocked ? 0.5 : 1,
                transition: 'background 0.15s ease',
                '&:hover': {
                  background: 'var(--cocoso-colors-gray-200)',
                },
              }}
              onClick={() => navigate(`/admin/messages/${conv._id}`)}
            >
              {(isDesktop || isIndexPage) && (
                <Box
                  css={{
                    flexShrink: 0,
                  }}
                >
                  <Avatar
                    name={otherUsername}
                    size="sm"
                    src={otherAvatar ?? undefined}
                  />
                </Box>
              )}

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

              {isIndexPage && unreadCount > 0 ? (
                <Box css={{ flexShrink: 0 }}>
                  <Badge colorScheme="red" size="sm">
                    {unreadCount}
                  </Badge>
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
