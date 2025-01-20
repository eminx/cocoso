import React, { useState } from 'react';
import { Box, Button, Center, Flex, IconButton, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import MessagesSquare from 'lucide-react/dist/esm/icons/messages-square';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import ConfirmModal from '/imports/ui/components/ConfirmModal';
import { call } from '/imports/ui/utils/shared';
import Drawer from '../components/Drawer';
import { Chattery, useChattery } from '../chattery';

export function ChatUI({ context, currentUser, item, open, setOpen }) {
  const [tc] = useTranslation('common');
  const { isChatLoading, discussion } = useChattery(item?._id);

  if (!item) {
    return null;
  }

  const isMember =
    currentUser && item.members.some((member) => member.memberId === currentUser._id);

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
      return notification.unSeenIndexes.some((unSeenIndex) => unSeenIndex === messageIndex);
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
    <Drawer isOpen={open} title={tc('labels.discussion')} onClose={() => setOpen(false)}>
      <Chattery
        messages={discussion}
        onNewMessage={addNewChatMessage}
        removeNotification={removeNotification}
        withInput={isMember}
      />
    </Drawer>
  );
}

export function ChatButton({ context, currentUser, item }) {
  const [open, setOpen] = useState(false);
  const [tc] = useTranslation('common');

  const props = { context, currentUser, item, open, setOpen };

  return (
    <Box>
      <Center>
        <VStack className="hover-link" spacing="0">
          <IconButton
            bg="brand.50"
            border="1px solid #fff"
            fontSize="32px"
            icon={<MessagesSquare />}
            isRound
            variant="ghost"
            onClick={() => setOpen(true)}
          />
          <Button fontWeight="normal" size="xs" variant="link" onClick={() => setOpen(true)}>
            {tc('labels.discussion')}
          </Button>
        </VStack>
      </Center>
      {open && <ChatUI {...props} />}
    </Box>
  );
}
