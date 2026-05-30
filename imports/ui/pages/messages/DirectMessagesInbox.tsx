import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { Trans, useTranslation } from 'react-i18next';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import EllipsisVertical from 'lucide-react/dist/esm/icons/ellipsis-vertical';

import {
  Alert,
  Avatar,
  Box,
  Center,
  Flex,
  IconButton,
  Input,
  Link as CLink,
  Loader,
  Modal,
  Text,
} from '/imports/ui/core';
import { allHostsAtom, currentUserAtom } from '/imports/state';
import { Bio } from '/imports/ui/entry/UserHybrid';
import MemberAvatarEtc from '/imports/ui/generic/MemberAvatarEtc';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/api/_utils/shared';
import DirectMessages from '/imports/api/directMessages/directMessage';
import GenericMenu, { MenuItem } from '/imports/ui/generic/Menu';
import ReportModal from '/imports/ui/generic/ReportModal';

import DirectMessageConversations from './DirectMessageConversations';

export default function DirectMessagesInbox() {
  const [t] = useTranslation('accounts');
  const currentUser = useAtomValue(currentUserAtom);
  const allHosts = useAtomValue(allHostsAtom);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [starting, setStarting] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const { conversationId } = useParams();

  useSubscribe('directMessages');

  const isIndexPage = typeof conversationId !== 'string';

  const conversations = useTracker(() => {
    if (!currentUser) return [];
    return DirectMessages.find(
      { participantIds: currentUser._id },
      { sort: { lastMessageAt: -1 } }
    ).fetch();
  }, [currentUser]);

  useEffect(() => {
    if (!conversationId || !currentUser) return;
    Meteor.callAsync('directMessages_markAsRead', conversationId).catch(
      () => {}
    );
  }, [conversationId, currentUser]);

  useEffect(() => {
    if (!search.trim() || !currentUser) {
      setMembers([]);
      setFocusedIndex(-1);
      return;
    }
    let cancelled = false;
    Meteor.callAsync('users_searchForMessages', search.trim())
      .then((results: any[]) => {
        if (!cancelled) {
          setMembers(results ?? []);
          setFocusedIndex(-1);
        }
      })
      .catch(() => {
        if (!cancelled) setMembers([]);
      });
    return () => {
      cancelled = true;
    };
  }, [search, currentUser]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (members.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, members.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      if (focusedIndex >= 0 && members[focusedIndex]) {
        handleStartConversation(members[focusedIndex]._id);
      }
    } else if (e.key === 'Escape') {
      setSearch('');
    }
  };

  const getCommunityLabel = (memberHosts: string[]) => {
    if (!memberHosts?.length) return null;
    const names = memberHosts
      .map((h) => allHosts.find((ah: any) => ah.host === h)?.name)
      .filter(Boolean);
    if (!names.length) return null;
    const [first, ...rest] = names;
    return rest.length > 0 ? `${first} +${rest.length}` : first;
  };

  const handleStartConversation = async (userId: string) => {
    if (starting) return;
    setStarting(true);
    try {
      const conversationId = await Meteor.callAsync(
        'directMessages_findOrCreate',
        userId
      );
      navigate(`/admin/messages/${conversationId}`);
    } finally {
      setStarting(false);
      setSearch('');
    }
  };

  const handleFetchUser = async (username) => {
    setLoadingUser(true);
    try {
      const user = await call('getUserInfo', username);
      setModalItem(user);
      setModalOpen(true);
    } catch (error) {
      message.error(error.error || error.reason);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => {
      setModalItem(null);
    }, 400);
  };

  const currentConversation = conversations?.find(
    (conv) => conv._id === conversationId
  );
  const currentOtherIndex = currentConversation?.participantIds.findIndex(
    (id) => id !== currentUser?._id
  );
  const currentOtherUsername =
    currentOtherIndex !== undefined && currentOtherIndex !== -1
      ? currentConversation?.participantUsernames[currentOtherIndex]
      : undefined;
  const currentOtherUserId =
    currentOtherIndex !== undefined && currentOtherIndex !== -1
      ? currentConversation?.participantIds[currentOtherIndex]
      : undefined;
  const currentOtherAvatar =
    currentOtherIndex !== undefined && currentOtherIndex !== -1
      ? currentConversation?.participantAvatars?.[currentOtherIndex]
      : undefined;
  const isOtherUserBlocked = (
    (currentUser as any)?.blockedUserIds ?? []
  ).includes(currentOtherUserId);

  const handleBlock = async () => {
    try {
      await Meteor.callAsync('users_blockUser', currentOtherUserId);
      message.info(
        t('messages.notify.blocked', { username: currentOtherUsername })
      );
    } catch (err: any) {
      message.error(err.reason || err.message);
    }
  };

  const handleUnblock = async () => {
    try {
      await Meteor.callAsync('users_unblockUser', currentOtherUserId);
      message.info(
        t('messages.notify.unblocked', { username: currentOtherUsername })
      );
    } catch (err: any) {
      message.error(err.reason || err.message);
    }
  };

  if (!currentUser) {
    return (
      <Alert>
        <Trans i18nKey="common:message.access.deny" />
        <Box>
          <Link to="/login">
            <CLink>
              <Trans i18nKey="common:labels.clickToLogin" />
            </CLink>
          </Link>
        </Box>
      </Alert>
    );
  }

  return (
    <Box css={{ maxWidth: '540px' }}>
      {loadingUser && <Loader />}

      <Box mb="4" css={{ position: 'relative' }}>
        <Box mb="4">
          {isIndexPage ? (
            <Input
              placeholder={t('messages.search')}
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          ) : (
            <Flex align="center" justify="space-between" gap="2">
              <Link to="/admin/messages">
                <Center px="4">
                  <IconButton
                    aria-label="Back to inbox"
                    icon={<ArrowLeft fontSize="44px" />}
                    variant="ghost"
                  />
                </Center>
              </Link>
              <Flex
                align="center"
                gap="2"
                css={{ cursor: 'pointer', transform: 'translateX(-12px)' }}
                onClick={() => handleFetchUser(currentOtherUsername)}
              >
                <Avatar
                  name={currentOtherUsername}
                  size="md"
                  src={currentOtherAvatar ?? undefined}
                />
                <Text fontWeight="bold" size="lg">
                  <CLink>{currentOtherUsername}</CLink>
                </Text>
              </Flex>
              <Box css={{ position: 'relative' }}>
                <GenericMenu
                  align="end"
                  button={
                    <IconButton
                      aria-label="Chat Menu"
                      icon={<EllipsisVertical fontSize="44px" />}
                      variant="ghost"
                    />
                  }
                >
                  {isOtherUserBlocked ? (
                    <MenuItem onClick={handleUnblock}>
                      {t('messages.actions.unblock', {
                        username: currentOtherUsername,
                      })}
                    </MenuItem>
                  ) : (
                    <MenuItem onClick={handleBlock}>
                      {t('messages.actions.block', {
                        username: currentOtherUsername,
                      })}
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => setReportOpen(true)}>
                    {t('messages.actions.report', {
                      username: currentOtherUsername,
                    })}
                  </MenuItem>
                </GenericMenu>

                <ReportModal
                  contentId={conversationId}
                  contentType="directMessage"
                  isOpen={reportOpen}
                  reportedUserId={currentOtherUserId}
                  reportedUsername={currentOtherUsername}
                  onClose={() => setReportOpen(false)}
                />
              </Box>
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
            {members.map((u: any, index: number) => (
              <Flex
                key={u._id}
                align="center"
                css={{
                  cursor: 'pointer',
                  padding: '0.6rem 0.75rem',
                  background:
                    index === focusedIndex
                      ? 'var(--cocoso-colors-gray-100)'
                      : 'transparent',
                  '&:hover': { background: 'var(--cocoso-colors-gray-50)' },
                }}
                gap="1"
                onClick={() => handleStartConversation(u._id)}
              >
                <Avatar name={u.username} size="sm" src={u.avatar?.src} />
                <Box css={{ flex: 1 }}>
                  <Text
                    fontWeight="bold"
                    size="md"
                    css={{ marginRight: '0.2rem' }}
                  >
                    {u.username}
                  </Text>
                  {(u.firstName || u.lastName) && (
                    <Text size="sm" color="gray.500">
                      {[u.firstName, u.lastName].filter(Boolean).join(' ')}
                    </Text>
                  )}
                </Box>
                {getCommunityLabel(u.memberHosts) && (
                  <Text size="xs" color="gray.400" css={{ flexShrink: 0 }}>
                    {getCommunityLabel(u.memberHosts)}
                  </Text>
                )}
              </Flex>
            ))}
          </Box>
        )}
      </Box>

      <DirectMessageConversations conversations={conversations} />

      <Modal
        cancelText={<Trans i18nKey="common:actions.close">Close</Trans>}
        confirmText={
          <Trans i18nKey="members:actions.visit">Visit Profile</Trans>
        }
        hideHeader
        id="users-hybrid"
        open={modalOpen}
        size="xl"
        onConfirm={() => navigate(`/@${modalItem?.username}`)}
        onClose={handleCloseModal}
      >
        <Box pt="8">
          <MemberAvatarEtc isThumb={false} user={modalItem} />
        </Box>
        <Center>
          <Bio user={modalItem} />
        </Center>
      </Modal>
    </Box>
  );
}
