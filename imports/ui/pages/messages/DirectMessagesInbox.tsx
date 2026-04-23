import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { Trans, useTranslation } from 'react-i18next';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import EllipsisVertical from 'lucide-react/dist/esm/icons/ellipsis-vertical';

import {
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
  Alert,
} from '/imports/ui/core';

import { currentUserAtom } from '/imports/state';
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
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [starting, setStarting] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const { conversationId } = useParams();

  useSubscribe('directMessages');
  useSubscribe('membersForPublic');

  const isIndexPage = typeof conversationId !== 'string';

  const conversations = useTracker(() => {
    if (!currentUser) return [];
    return DirectMessages.find(
      { participantIds: currentUser._id },
      { sort: { lastMessageAt: -1 } }
    ).fetch();
  }, [currentUser]);

  const members = useTracker(() => {
    if (!currentUser) return [];
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
  const currentOtherUsername = currentConversation?.participantUsernames.find(
    (u) => u !== currentUser?.username
  );
  const currentOtherUserId = currentConversation?.participantIds.find(
    (id) => id !== currentUser?._id
  );
  const isOtherUserBlocked = (
    (currentUser as any)?.blockedUserIds ?? []
  ).includes(currentOtherUserId);

  const handleBlock = async () => {
    try {
      await Meteor.callAsync('users_blockUser', currentOtherUserId);
      message.info(t('messages.notify.blocked', { username: currentOtherUsername }));
    } catch (err: any) {
      message.error(err.reason || err.message);
    }
  };

  const handleUnblock = async () => {
    try {
      await Meteor.callAsync('users_unblockUser', currentOtherUserId);
      message.info(t('messages.notify.unblocked', { username: currentOtherUsername }));
    } catch (err: any) {
      message.error(err.reason || err.message);
    }
  };

  if (!currentUser) {
    return (
      <Alert>
        <Trans i18nKey="common:message.access.deny" />
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
            />
          ) : (
            <Flex align="center" justify="space-between" gap="2">
              <Link to="/admin/messages">
                <Center w="80px">
                  <IconButton
                    aria-label="Back to inbox"
                    icon={<ArrowLeft fontSize="44px" />}
                    variant="ghost"
                  />
                </Center>
              </Link>
              <Center
                css={{ transform: 'translateX(-12px)' }}
                onClick={() => handleFetchUser(currentOtherUsername)}
              >
                <Text fontWeight="bold" size="lg">
                  <CLink>{currentOtherUsername}</CLink>
                </Text>
              </Center>
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
                      {t('messages.actions.unblock', { username: currentOtherUsername })}
                    </MenuItem>
                  ) : (
                    <MenuItem onClick={handleBlock}>
                      {t('messages.actions.block', { username: currentOtherUsername })}
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => setReportOpen(true)}>
                    {t('messages.actions.report', { username: currentOtherUsername })}
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
