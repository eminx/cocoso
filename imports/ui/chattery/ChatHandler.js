import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MessagesSquare from 'lucide-react/dist/esm/icons/messages-square';

import {
  Badge,
  Box,
  Center,
  Drawer,
  Flex,
  IconButton,
  Text,
} from '/imports/ui/core';
import { call } from '/imports/ui/utils/shared';

import { Chattery, useChattery } from '../chattery';

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
  const { discussion } = item && useChattery(item._id);

  if (!item) {
    return null;
  }

  const addNewChatMessage = async (messageContent) => {
    const values = {
      context,
      contextId: item._id,
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
          css={{
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
          {notificationCount && (
            <Badge
              style={{
                border: '2px solid white',
                borderRadius: '50%',
                colorScheme: 'red',
                fontSize: '0.75rem',
                height: '1.5rem',
                padding: '0.45rem',
                position: 'absolute',
                right: '-0.75rem',
                top: '-0.5rem',
                width: '1.5rem',
              }}
            >
              {notificationCount}
            </Badge>
          )}
          <Text
            color="theme.50"
            fontSize="xs"
            fontWeight="bold"
            textAlign="center"
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
