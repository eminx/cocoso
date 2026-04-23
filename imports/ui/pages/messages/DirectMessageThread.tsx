import React from 'react';
import { useTranslation } from 'react-i18next';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';

import { Box, Loader } from '/imports/ui/core';
import DirectMessages from '../../../api/directMessages/directMessage';
import { currentUserAtom, privateKeyAtom } from '/imports/state';
import { encryptMessage, decryptMessage } from '/imports/utils/crypto';
import Chattery from '/imports/ui/chattery/ChatteryContainer';

interface DmMessage {
  content: string;
  createdDate: Date;
  isFromMe: boolean;
  senderId: string;
  senderUsername: string;
}

export default function DirectMessageThread() {
  const [t] = useTranslation('accounts');
  const { conversationId } = useParams<{ conversationId: string }>();
  const currentUser = useAtomValue(currentUserAtom);
  const privateKey = useAtomValue(privateKeyAtom);

  const isLoading = useSubscribe('directMessage', conversationId);

  const conversation = useTracker(
    () => DirectMessages.findOne(conversationId),
    [conversationId]
  );

  const myId = currentUser?._id;
  const otherUserId = conversation?.participantIds?.find(
    (id: string) => id !== myId
  );

  useSubscribe('dmParticipant', otherUserId);

  const otherUser = useTracker(
    () =>
      otherUserId
        ? Meteor.users.findOne(otherUserId, {
            fields: { username: 1, publicKey: 1 },
          })
        : null,
    [otherUserId]
  );

  const messages: DmMessage[] = useTracker(() => {
    if (!conversation || !privateKey || !myId) return [];

    return (conversation.messages ?? []).map((msg: any) => {
      const isFromMe = msg.senderId === myId;
      const ciphertext = isFromMe
        ? msg.senderCiphertext
        : msg.recipientCiphertext;

      const decryptWithKey = isFromMe
        ? (currentUser as any)?.publicKey
        : (otherUser as any)?.publicKey;

      let content = '…';
      if (ciphertext && decryptWithKey) {
        content =
          decryptMessage(ciphertext, decryptWithKey, privateKey) ??
          '(unreadable)';
      }

      return {
        content,
        createdDate: msg.createdAt,
        isFromMe,
        senderId: msg.senderId,
        senderUsername: isFromMe
          ? currentUser?.username ?? 'me'
          : (otherUser as any)?.username ?? '?',
      };
    });
  }, [conversation, privateKey, myId, otherUser]);

  const handleSend = async (plaintext: string) => {
    const myPublicKey: string | undefined = (currentUser as any)?.publicKey;
    const otherPublicKey: string | undefined = (otherUser as any)?.publicKey;
    if (!myPublicKey || !otherPublicKey || !privateKey) return;

    const { recipientCiphertext, senderCiphertext } = encryptMessage(
      plaintext,
      otherPublicKey,
      myPublicKey,
      privateKey
    );

    await Meteor.callAsync('directMessages_sendMessage', {
      conversationId,
      recipientCiphertext,
      senderCiphertext,
    });
  };

  if (isLoading()) return <Loader />;

  if (!privateKey) {
    return (
      <Box p="4">{t('messages.encryption.notLoaded')}</Box>
    );
  }

  const canSend = Boolean((otherUser as any)?.publicKey);
  const isOtherUserBlocked = ((currentUser as any)?.blockedUserIds ?? []).includes(otherUserId);

  const handleUnblock = async () => {
    try {
      await Meteor.callAsync('users_unblockUser', otherUserId);
    } catch {
      // handled silently; user will see no change if it fails
    }
  };

  return (
    <Box h="100%">
      {!canSend && otherUser && !isOtherUserBlocked && (
        <Box
          p="3"
          css={{
            background: 'var(--cocoso-colors-orange-50)',
            borderBottom: '1px solid var(--cocoso-colors-orange-200)',
            fontSize: '0.85rem',
            textAlign: 'center',
          }}
        >
          {t('messages.encryption.notSetUp', { username: (otherUser as any)?.username })}
        </Box>
      )}
      {isOtherUserBlocked && (
        <Box
          p="3"
          css={{
            background: 'var(--cocoso-colors-gray-50)',
            borderBottom: '1px solid var(--cocoso-colors-gray-200)',
            fontSize: '0.85rem',
            textAlign: 'center',
          }}
        >
          {t('messages.blocked.notice')}{' '}
          <span
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={handleUnblock}
          >
            {t('messages.actions.unblockLink')}
          </span>
        </Box>
      )}
      <Box bg="bluegray.300" p="2">
        <Chattery
          messages={messages}
          withInput={canSend && !isOtherUserBlocked}
          onNewMessage={handleSend}
          removeNotification={() => {}}
        />
      </Box>
    </Box>
  );
}
