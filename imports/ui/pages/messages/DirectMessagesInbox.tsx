import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';

import {
  Avatar,
  Box,
  Center,
  Flex,
  IconButton,
  Input,
  Text,
} from '/imports/ui/core';
import DirectChats from '/imports/api/directChats/directChat';
import { currentUserAtom } from '/imports/state';
import DirectMessageConversations from '/imports/ui/pages/messages/DirectMessageConversations';

export default function DirectMessagesInbox() {
  const currentUser = useAtomValue(currentUserAtom);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [starting, setStarting] = useState(false);
  const { conversationId } = useParams();

  useSubscribe('directChats');
  useSubscribe('membersForPublic');

  const isIndexPage = typeof conversationId !== 'string';

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

  const currentConversation = conversations?.find(
    (conv) => conv._id === conversationId
  );
  const currentOtherUsername = currentConversation?.participantUsernames.find(
    (u) => u !== currentUser.username
  );

  return (
    <Box css={{ maxWidth: '540px' }}>
      <Box mb="4" css={{ position: 'relative' }}>
        <Box mb="4">
          {isIndexPage ? (
            <Input
              placeholder="Start a new conversation..."
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
            />
          ) : (
            <Flex align="center">
              <Link to="/admin/messages">
                <Center w="72px">
                  <IconButton icon={<ArrowLeft size="44" />} variant="ghost" />
                </Center>
              </Link>
              <Center>
                <Text size="lg">{currentOtherUsername}</Text>
              </Center>
            </Flex>
          )}
        </Box>

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
                  '&:hover': { background: 'var(--cocoso-colors-bluegray-50)' },
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

      <DirectMessageConversations conversations={conversations} />
    </Box>
  );
}
