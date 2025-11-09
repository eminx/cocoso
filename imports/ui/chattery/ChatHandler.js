import React, { useState } from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import MessagesSquare from 'lucide-react/dist/esm/icons/messages-square';

import {
  Badge,
  Box,
  Center,
  Drawer,
  Flex,
  IconButton,
  NotificationBadge,
  Text,
} from '/imports/ui/core';
import { call } from '/imports/api/_utils/shared';
import Chats from '/imports/api/chats/chat';

import { Chattery } from '../chattery';

export function ChatUI({
  context,
  currentUser,
  item,
  open,
  title,
  withInput,
  setOpen,
}) {
  const [tc] = useTranslation('common');

  if (!currentUser || !item) {
    return null;
  }

  const contextId = item._id;
  const isChatLoading = useSubscribe('chat', contextId);
  const chat = useTracker(() => {
    return Chats.findOne({ contextId });
  }, []);
  const discussion = chat?.messages?.map((message) => ({
    ...message,
    isFromMe: currentUser && message && message.senderId === currentUser._id,
  }));

  const addNewChatMessage = async (messageContent) => {
    const values = {
      context,
      contextId,
      message: messageContent,
    };

    try {
      await call('addChatMessage', values);
    } catch (error) {
      console.log('error', error);
    }
  };

  const removeNotification = async (messageIndex) => {
    const shouldRun = currentUser?.notifications?.find((notification) => {
      if (!notification.unSeenIndexes) {
        return false;
      }
      return notification.unSeenIndexes.some(
        (unSeenIndex) => unSeenIndex === messageIndex
      );
    });

    if (!shouldRun) {
      return;
    }

    try {
      await call('removeNotification', item._id, messageIndex);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Drawer
      open={open}
      size="xl"
      title={title || tc('labels.discussion')}
      onClose={() => setOpen(false)}
    >
      {open && (
        <Chattery
          messages={discussion}
          withInput={withInput}
          onNewMessage={addNewChatMessage}
          removeNotification={removeNotification}
        />
      )}
    </Drawer>
  );
}

export function ChatButton({
  context,
  currentUser,
  item,
  notificationCount,
  title,
  withInput,
}) {
  const [open, setOpen] = useState(false);
  const [tc] = useTranslation('common');

  const props = {
    context,
    currentUser,
    item,
    open,
    title,
    withInput,
    setOpen,
  };

  return (
    <Box css={{ flexGrow: '0' }}>
      <Center>
        <Flex
          align="center"
          direction="column"
          gap="0"
          style={{
            position: 'relative',
          }}
        >
          <Box mb="1">
            <IconButton
              icon={<MessagesSquare />}
              variant="outline"
              onClick={() => setOpen(true)}
            />
          </Box>
          {notificationCount && notificationCount !== 0 && (
            <NotificationBadge colorScheme="red">
              {notificationCount?.toString()}
            </NotificationBadge>
          )}
          <Text
            css={{
              color: 'var(--cocoso-colors-theme-50)',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
            onClick={() => setOpen(true)}
          >
            {tc('labels.discussion')}
          </Text>
        </Flex>
      </Center>

      <ChatUI {...props} />
    </Box>
  );
}
