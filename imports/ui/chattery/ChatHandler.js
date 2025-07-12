import React, { useState } from 'react';
import {
  Badge,
  Button,
  Center,
  IconButton,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import MessagesSquare from 'lucide-react/dist/esm/icons/messages-square';

import { Drawer } from '/imports/ui/core';

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
    const shouldRun = currentUser?.notifications?.find(
      (notification) => {
        if (!notification.unSeenIndexes) {
          return false;
        }
        return notification.unSeenIndexes.some(
          (unSeenIndex) => unSeenIndex === messageIndex
        );
      }
    );

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
      <Chattery
        messages={discussion}
        withInput={withInput}
        onNewMessage={addNewChatMessage}
        removeNotification={removeNotification}
      />
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
    <>
      <Center>
        <VStack spacing="0" position="relative">
          <IconButton
            _hover={{ bg: 'brand.100' }}
            _active={{ bg: 'brand.200' }}
            bg="brand.50"
            border="1px solid"
            color="brand.600"
            fontSize="32px"
            icon={<MessagesSquare />}
            isRound
            variant="ghost"
            onClick={() => setOpen(true)}
          />
          {notificationCount && (
            <Badge
              borderRadius="full"
              border="2px solid white"
              colorScheme="red"
              position="absolute"
              right="-6px"
              size="md"
              top="24px"
              variant="solid"
            >
              {notificationCount}
            </Badge>
          )}
          <Button
            color="brand.50"
            size="xs"
            variant="link"
            onClick={() => setOpen(true)}
          >
            {tc('labels.discussion')}
          </Button>
        </VStack>
      </Center>

      <ChatUI {...props} />
    </>
  );
}
