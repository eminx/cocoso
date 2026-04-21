import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import {
  Avatar,
  Box,
  Center,
  Flex,
  Image,
  Input,
  Text,
} from '/imports/ui/core';
import DirectChats from '/imports/api/directChats/directChat';
import { currentUserAtom, privateKeyAtom } from '/imports/state';
import { decryptMessage } from '/imports/utils/crypto';

export default function DirectMessagesInbox() {
  const currentUser = useAtomValue(currentUserAtom);
  const privateKey = useAtomValue(privateKeyAtom);
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [starting, setStarting] = useState(false);

  useSubscribe('directChats');
  useSubscribe('membersForPublic');

  const conversations = useTracker(() => {
    if (!currentUser) return [];
    return DirectChats.find(
      { participantIds: currentUser._id },
      { sort: { lastMessageAt: -1 } }
    ).fetch();
  }, [currentUser]);

  const members = useTracker(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return Meteor.users
      .find(
        { _id: { $ne: currentUser?._id } },
        { fields: { username: 1, firstName: 1, lastName: 1, avatar: 1 } }
      )
      .fetch()
      .filter((u: any) => {
        const full = `${u.firstName ?? ''} ${u.lastName ?? ''} ${
          u.username ?? ''
        }`.toLowerCase();
        return full.includes(q);
      })
      .slice(0, 8);
  }, [search, currentUser]);

  const handleStartConversation = async (userId: string) => {
    if (starting) return;
    setStarting(true);
    try {
      const conversationId = await Meteor.callAsync(
        'directChats_findOrCreate',
        userId
      );
      navigate(`/admin/messages/${conversationId}`);
    } finally {
      setStarting(false);
      setSearch('');
    }
  };

  return (
    <Box css={{ maxWidth: '540px' }}>
      <Box mb="4" css={{ position: 'relative' }}>
        <Input
          placeholder="Start a new conversation..."
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
        />
        {members.length > 0 && (
          <Box
            css={{
              background: 'white',
              border: '1px solid var(--cocoso-colors-gray-200)',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              left: 0,
              position: 'absolute',
              right: 0,
              top: '100%',
              zIndex: 10,
            }}
          >
            {members.map((u: any) => (
              <Flex
                key={u._id}
                align="center"
                css={{
                  cursor: 'pointer',
                  padding: '0.6rem 0.75rem',
                  '&:hover': { background: 'var(--cocoso-colors-gray-50)' },
                }}
                gap="1"
                onClick={() => handleStartConversation(u._id)}
              >
                <Avatar name={u.username} size="sm" src={u.avatar?.src} />
                <Text fontWeight="bold" size="md">
                  {u.username}
                </Text>
                {(u.firstName || u.lastName) && (
                  <Text size="sm" color="gray.500">
                    {[u.firstName, u.lastName].filter(Boolean).join(' ')}
                  </Text>
                )}
              </Flex>
            ))}
          </Box>
        )}
      </Box>

      {conversations.length === 0 ? (
        <Center p="8">
          <Text color="gray.500">
            No conversations yet. Search for someone above.
          </Text>
        </Center>
      ) : (
        conversations.map((conv: any) => {
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
              ? Meteor.users.findOne(otherUserId, { fields: { publicKey: 1 } })
              : null;
            if ((otherUser as any)?.publicKey) {
              preview =
                decryptMessage(
                  lastCiphertext,
                  (otherUser as any).publicKey,
                  privateKey
                ) ?? '';
            }
          }

          return (
            <Box
              key={conv._id}
              css={{
                borderBottom: '1px solid var(--cocoso-colors-gray-200)',
                cursor: 'pointer',
                padding: '0.75rem 0.5rem',
                '&:hover': { background: 'var(--cocoso-colors-bluegray-50)' },
              }}
              onClick={() => navigate(`/admin/messages/${conv._id}`)}
            >
              <Flex align="center" gap="2">
                <Avatar name={otherUsername} size="md" src={otherAvatar} />
                <Text fontWeight="bold">{otherUsername}</Text>
              </Flex>
              {preview && (
                <Text
                  size="sm"
                  color="gray.500"
                  css={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isLastFromMe ? 'You: ' : ''}
                  {preview}
                </Text>
              )}
              <Text size="xs" color="gray.600">
                {conv.lastMessageAt
                  ? dayjs(conv.lastMessageAt).fromNow()
                  : "Conversation hasn't started yet"}
              </Text>
            </Box>
          );
        })
      )}
    </Box>
  );
}
